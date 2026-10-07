const OLA_PLACES_URL = "https://api.olamaps.io/places/v1/nearbysearch/advanced";

const CATEGORY_TYPES = {
  restaurant: "restaurant",
  cafe: "cafe",
  salon: "salon",
  clinic: "clinic",
  dentist: "dentist",
  hospital: "hospital",
  gym: "gym",
  hotel: "hotel",
  travel_agency: "travel_agency",
  car_dealer: "car_dealer",
  school: "school",
  clothing: "clothing",
  electronics: "electronics",
  furniture: "furniture",
  beauty: "beauty",
};

const CATEGORY_TEXT = {
  real_estate: "real estate agents",
  interior_design: "interior designers",
  lawyer: "lawyers",
  accountant: "accountants",
  training: "coaching institutes training centers",
};

function first(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

function numberOrNull(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function getLat(place) {
  return numberOrNull(
    first(
      place?.geometry?.location?.lat,
      place?.geometry?.lat,
      place?.location?.lat,
      place?.latitude,
      place?.lat,
      place?.coordinates?.lat,
      place?.coordinates?.latitude
    )
  );
}

function getLon(place) {
  return numberOrNull(
    first(
      place?.geometry?.location?.lng,
      place?.geometry?.lng,
      place?.location?.lng,
      place?.longitude,
      place?.lng,
      place?.lon,
      place?.coordinates?.lng,
      place?.coordinates?.longitude
    )
  );
}

function getPhone(place) {
  const contacts = place?.contacts || place?.contact || {};
  return first(
    place?.phone,
    place?.phone_number,
    place?.phoneNumber,
    contacts?.phone,
    contacts?.phone_number,
    contacts?.phoneNumber,
    Array.isArray(place?.phones) ? place.phones[0] : null,
    Array.isArray(contacts?.phones) ? contacts.phones[0] : null,
    ""
  );
}

function getEmail(place) {
  const contacts = place?.contacts || place?.contact || {};
  return first(
    place?.email,
    contacts?.email,
    Array.isArray(place?.emails) ? place.emails[0] : null,
    ""
  );
}

function getWebsite(place) {
  const contacts = place?.contacts || place?.contact || {};
  return first(
    place?.website,
    place?.website_url,
    place?.url,
    contacts?.website,
    contacts?.website_url,
    contacts?.url,
    ""
  );
}

function getSocial(place) {
  const contacts = place?.contacts || place?.contact || {};
  const values = [
    place?.instagram,
    place?.facebook,
    place?.twitter,
    place?.x,
    place?.linkedin,
    place?.youtube,
    contacts?.instagram,
    contacts?.facebook,
    contacts?.twitter,
    contacts?.x,
    contacts?.linkedin,
    contacts?.youtube,
  ];
  return values.filter(Boolean);
}

function getName(place) {
  return first(
    place?.name,
    place?.display_name,
    place?.displayName,
    place?.title,
    place?.text,
    "Unnamed Business"
  );
}

function getAddress(place) {
  return first(
    place?.formatted_address,
    place?.formattedAddress,
    place?.address,
    place?.vicinity,
    place?.address_line,
    place?.addressLine,
    ""
  );
}

function normalizePlace(place, index) {
  const lat = getLat(place);
  const lon = getLon(place);
  const id = first(place?.place_id, place?.placeId, place?.id, `${Date.now()}-${index}`);
  const phone = getPhone(place);
  const email = getEmail(place);
  const website = getWebsite(place);
  const social = getSocial(place);

  const tags = {
    name: getName(place),
    address: getAddress(place),
    "addr:full": getAddress(place),
    phone,
    email,
    website,
    "contact:phone": phone,
    "contact:email": email,
    "contact:website": website,
    instagram: place?.instagram || place?.contacts?.instagram || "",
    facebook: place?.facebook || place?.contacts?.facebook || "",
    twitter: place?.twitter || place?.contacts?.twitter || "",
    x: place?.x || place?.contacts?.x || "",
    linkedin: place?.linkedin || place?.contacts?.linkedin || "",
    youtube: place?.youtube || place?.contacts?.youtube || "",
    types: place?.types || place?.categories || [],
    ola_place_id: id,
  };

  return {
    type: "ola",
    id,
    lat,
    lon,
    tags,
    raw: place,
    socialLinks: social,
  };
}

function extractPlaces(data) {
  const candidates = [
    data?.results,
    data?.places,
    data?.items,
    data?.data,
    data?.predictions,
    data?.features,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  return [];
}

async function olaRequest(params) {
  const url = new URL(OLA_PLACES_URL);

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url, {
    headers: {
      "X-Request-Id": `business-opportunity-finder-${Date.now()}`,
      Accept: "application/json",
    },
  });

  const text = await response.text();
  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { error: text || "Ola Maps returned an invalid response." };
  }

  if (!response.ok) {
    const message =
      data?.error?.message ||
      data?.message ||
      data?.error ||
      `Ola Maps request failed (${response.status}).`;
    const error = new Error(String(message));
    error.status = response.status;
    throw error;
  }

  return data;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { lat, lon, radius = 5000, category } = req.body || {};

    if (!Number.isFinite(Number(lat)) || !Number.isFinite(Number(lon))) {
      return res.status(400).json({ error: "Valid lat and lon are required." });
    }

    if (!category) {
      return res.status(400).json({ error: "Category is required." });
    }

    const apiKey = process.env.VITE_OLA_MAPS_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Ola Maps API key is missing on Vercel." });
    }

    const safeRadius = Math.min(Math.max(Number(radius) || 5000, 500), 25000);
    const location = `${Number(lat)},${Number(lon)}`;
    const type = CATEGORY_TYPES[category];

    let data;

    if (type) {
      data = await olaRequest({
        layers: "venue",
        types: type,
        location,
        radius: safeRadius,
        limit: 50,
        language: "en",
        withCentroid: true,
        api_key: apiKey,
      });
    } else {
      const text = CATEGORY_TEXT[category] || category.replace(/_/g, " ");
      data = await olaRequest({
        query: `${text} near ${location}`,
        location,
        radius: safeRadius,
        limit: 50,
        language: "en",
        api_key: apiKey,
      });
    }

    const places = extractPlaces(data);

    return res.status(200).json({
      elements: places.map(normalizePlace),
      source: "Ola Maps",
      count: places.length,
    });
  } catch (error) {
    console.error("Ola Places error:", error);

    return res.status(error.status || 500).json({
      error: error.message || "Ola Maps business search failed.",
    });
  }
}
