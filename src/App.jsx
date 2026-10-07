import { useEffect, useMemo, useRef, useState } from "react";

import "./App.css";



const PLACES_URL = "/api/places";



const OLA_AUTOCOMPLETE_URL =

  "https://api.olamaps.io/places/v1/autocomplete";



const OLA_API_KEY = import.meta.env.VITE_OLA_MAPS_API_KEY || "";



const CATEGORIES = [

  { label: "Restaurants", query: "restaurant" },

  { label: "Cafes", query: "cafe" },

  { label: "Real Estate", query: "real_estate" },

  { label: "Salons", query: "salon" },

  { label: "Clinics", query: "clinic" },

  { label: "Dental Clinics", query: "dentist" },

  { label: "Hospitals", query: "hospital" },

  { label: "Gyms", query: "gym" },

  { label: "Hotels", query: "hotel" },

  { label: "Travel Agencies", query: "travel_agency" },

  { label: "Car Dealers", query: "car_dealer" },

  { label: "Interior Designers", query: "interior_design" },

  { label: "Lawyers", query: "lawyer" },

  { label: "Accountants", query: "accountant" },

  { label: "Schools", query: "school" },

  { label: "Coaching / Training", query: "training" },

  { label: "Clothing Shops", query: "clothing" },

  { label: "Electronics Shops", query: "electronics" },

  { label: "Furniture Shops", query: "furniture" },

  { label: "Beauty / Spa", query: "beauty" },

];



const CONTACT_FILTERS = [

  { value: "all", label: "All Businesses" },

  { value: "phone", label: "📞 Phone Available" },

  { value: "email", label: "✉️ Email Available" },

  { value: "website", label: "🌐 Website Available" },

  { value: "social", label: "📱 Social Available" },

  { value: "contactable", label: "📞 Contactable" },

];



const CATEGORY_RULES = {

  restaurant: {

    tags: ["amenity=restaurant"],

    products: [

      "Restaurant Website",

      "Digital Menu",

      "Online Ordering Landing Page",

    ],

    services: [

      "Google Business Profile optimization",

      "Social Media Setup",

      "Website Maintenance",

    ],

  },



  cafe: {

    tags: ["amenity=cafe"],

    products: [

      "Cafe Website",

      "Digital Menu",

      "Online Ordering Page",

    ],

    services: [

      "Google Business Profile optimization",

      "Instagram Setup",

      "Local SEO",

    ],

  },



  real_estate: {

    tags: ["office=estate_agent"],

    products: [

      "Real Estate Website",

      "Property Listing Website",

      "Lead Capture Landing Page",

    ],

    services: [

      "Lead Generation Landing Page",

      "Google Business Profile optimization",

      "SEO",

    ],

  },



  salon: {

    tags: ["shop=beauty"],

    products: [

      "Salon Website",

      "Online Appointment Page",

      "Beauty Services Landing Page",

    ],

    services: [

      "Google Business Profile optimization",

      "Instagram Setup",

      "Local SEO",

    ],

  },



  clinic: {

    tags: ["amenity=clinic"],

    products: [

      "Clinic Website",

      "Appointment Booking Page",

      "Doctor Profile Website",

    ],

    services: [

      "Google Business Profile optimization",

      "Local SEO",

      "Website Maintenance",

    ],

  },



  dentist: {

    tags: ["amenity=dentist"],

    products: [

      "Dental Clinic Website",

      "Appointment Booking Website",

      "Dental Services Landing Page",

    ],

    services: [

      "Google Business Profile optimization",

      "Local SEO",

      "WhatsApp Lead Setup",

    ],

  },



  hospital: {

    tags: ["amenity=hospital"],

    products: [

      "Hospital Website",

      "Department Landing Pages",

      "Appointment Enquiry Website",

    ],

    services: [

      "Local SEO",

      "Google Business Profile optimization",

      "Website Maintenance",

    ],

  },



  gym: {

    tags: ["leisure=fitness_centre"],

    products: [

      "Gym Website",

      "Membership Landing Page",

      "Fitness Program Website",

    ],

    services: [

      "Lead Generation",

      "Instagram Setup",

      "Google Business Profile optimization",

    ],

  },



  hotel: {

    tags: ["tourism=hotel"],

    products: [

      "Hotel Website",

      "Room Booking Landing Page",

      "Hotel Promotion Website",

    ],

    services: [

      "Google Business Profile optimization",

      "Local SEO",

      "Website Maintenance",

    ],

  },



  travel_agency: {

    tags: ["shop=travel_agency"],

    products: [

      "Travel Agency Website",

      "Tour Package Landing Page",

      "Travel Booking Website",

    ],

    services: [

      "Lead Generation",

      "Google Business Profile optimization",

      "Local SEO",

    ],

  },



  car_dealer: {

    tags: ["shop=car"],

    products: [

      "Car Dealer Website",

      "Vehicle Listing Website",

      "Car Enquiry Landing Page",

    ],

    services: [

      "Lead Generation",

      "Google Business Profile optimization",

      "Local SEO",

    ],

  },



  interior_design: {

    tags: ["craft=interior_decoration"],

    products: [

      "Interior Design Portfolio Website",

      "Project Gallery Website",

      "Lead Capture Landing Page",

    ],

    services: [

      "Portfolio Optimization",

      "Google Business Profile optimization",

      "SEO",

    ],

  },



  lawyer: {

    tags: ["office=lawyer"],

    products: [

      "Law Firm Website",

      "Legal Services Landing Page",

      "Lawyer Profile Website",

    ],

    services: [

      "Local SEO",

      "Google Business Profile optimization",

      "Lead Generation",

    ],

  },



  accountant: {

    tags: ["office=accountant"],

    products: [

      "Accountant Website",

      "Tax Services Landing Page",

      "Business Consultancy Website",

    ],

    services: [

      "Local SEO",

      "Google Business Profile optimization",

      "Website Maintenance",

    ],

  },



  school: {

    tags: ["amenity=school"],

    products: [

      "School Website",

      "Admissions Landing Page",

      "School Information Portal",

    ],

    services: [

      "Local SEO",

      "Website Maintenance",

      "Google Business Profile optimization",

    ],

  },



  training: {

    tags: ["amenity=college", "amenity=school"],

    products: [

      "Coaching Institute Website",

      "Course Landing Page",

      "Online Admission Website",

    ],

    services: [

      "Lead Generation",

      "Google Business Profile optimization",

      "SEO",

    ],

  },



  clothing: {

    tags: ["shop=clothes"],

    products: [

      "Clothing Store Website",

      "Online Catalog Website",

      "WhatsApp Shopping Landing Page",

    ],

    services: [

      "Google Business Profile optimization",

      "Instagram Setup",

      "Local SEO",

    ],

  },



  electronics: {

    tags: ["shop=electronics"],

    products: [

      "Electronics Store Website",

      "Product Catalog Website",

      "WhatsApp Enquiry Website",

    ],

    services: [

      "Google Business Profile optimization",

      "Local SEO",

      "Website Maintenance",

    ],

  },



  furniture: {

    tags: ["shop=furniture"],

    products: [

      "Furniture Store Website",

      "Furniture Catalog Website",

      "Product Showcase Website",

    ],

    services: [

      "Google Business Profile optimization",

      "Instagram Setup",

      "Local SEO",

    ],

  },



  beauty: {

    tags: ["shop=beauty"],

    products: [

      "Beauty / Spa Website",

      "Appointment Landing Page",

      "Services & Pricing Website",

    ],

    services: [

      "Google Business Profile optimization",

      "Instagram Setup",

      "Local SEO",

    ],

  },

};



function escapeOverpass(value) {

  return String(value).replace(/"/g, '\\\\"');

}



function normalizePhone(phone) {

  if (!phone) return "";

  return String(phone).replace(/[^\d+]/g, "");

}



function makeWhatsAppLink(phone) {

  const clean = normalizePhone(phone);



  if (!clean) return "";



  let number = clean;



  if (number.startsWith("+")) {

    number = number.substring(1);

  } else if (number.length === 10) {

    number = `91${number}`;

  }



  return `https://wa.me/${number}`;

}



function getMapsLink(lat, lon, address = "") {

  if (lat && lon) {

    return `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;

  }



  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(

    address

  )}`;

}



function getWebsite(tags) {

  return (

    tags?.website ||

    tags?.["contact:website"] ||

    tags?.url ||

    tags?.["contact:url"] ||

    ""

  );

}



function getPhone(tags) {

  return (

    tags?.phone ||

    tags?.["contact:phone"] ||

    tags?.["contact:mobile"] ||

    tags?.mobile ||

    ""

  );

}



function getEmail(tags) {

  return tags?.email || tags?.["contact:email"] || "";

}



function getSocialLinks(tags) {

  const links = [];



  const socialFields = [

    "contact:instagram",

    "instagram",

    "contact:facebook",

    "facebook",

    "contact:twitter",

    "twitter",

    "contact:x",

    "x",

    "contact:linkedin",

    "linkedin",

    "contact:youtube",

    "youtube",

    "contact:telegram",

    "telegram",

  ];



  socialFields.forEach((field) => {

    if (tags?.[field]) {

      links.push(tags[field]);

    }

  });



  return [...new Set(links)];

}



function cleanWebsite(url) {

  if (!url) return "";



  if (!/^https?:**\\/\\/**/i.test(url)) {

    return `https://${url}`;

  }



  return url;

}



function cleanSocialUrl(url) {

  if (!url) return "";



  if (/^https?:**\\/\\/**/i.test(url)) {

    return url;

  }



  return `https://${url}`;

}



function getBusinessName(tags) {

  return (

    tags?.name ||

    tags?.["name:en"] ||

    tags?.official_name ||

    "Unnamed Business"

  );

}



function getAddress(tags, fallbackLocation = "") {

  if (!tags) return fallbackLocation;



  const parts = [

    tags["addr:housenumber"],

    tags["addr:street"],

    tags["addr:suburb"],

    tags["addr:city"],

    tags["addr:postcode"],

  ].filter(Boolean);



  return parts.join(", ") || tags["addr:full"] || fallbackLocation;

}



function calculateScore(business) {

  let score = 25;



  if (!business.website) score += 35;

  if (business.phone) score += 15;

  if (business.email) score += 10;

  if (business.address) score += 5;



  if (!business.website && business.phone) {

    score += 10;

  }



  return Math.min(score, 100);

}



function getOpportunityLevel(score) {

  if (score >= 75) return "HOT";

  if (score >= 50) return "WARM";

  return "LOW";

}



function getCategoryRule(category) {

  return CATEGORY_RULES[category] || {

    products: [

      "Business Website",

      "Landing Page",

      "Digital Presence Package",

    ],

    services: [

      "Local SEO",

      "Google Business Profile optimization",

    ],

  };

}



function getDigitalGap(business) {

  const gaps = [];



  if (!business.website) {

    gaps.push("No website listed in Ola Maps");

  }



  if (!business.phone) {

    gaps.push("No phone listed");

  }



  if (!business.email) {

    gaps.push("No email listed");

  }



  if (business.website) {

    gaps.push(

      "Website exists — potential for redesign / conversion improvements"

    );

  }



  if (gaps.length === 0) {

    return "Basic digital presence detected. Review for redesign, SEO and conversion opportunities.";

  }



  return gaps.join(" • ");

}



function extractAutocompleteItems(data) {

  const possible =

    data?.predictions ||

    data?.suggestions ||

    data?.results ||

    data?.data ||

    [];



  return Array.isArray(possible) ? possible : [];

}



function normalizeSuggestion(item) {

  const name =

    item?.description ||

    item?.formatted_address ||

    item?.address ||

    item?.name ||

    item?.text ||

    item?.structured_formatting?.main_text ||

    "Location";



  const secondary =

    item?.structured_formatting?.secondary_text ||

    item?.formatted_address ||

    item?.address ||

    item?.subtitle ||

    "";



  const placeId =

    item?.place_id ||

    item?.placeId ||

    item?.id ||

    "";



  const lat =

    item?.geometry?.location?.lat ??

    item?.geometry?.lat ??

    item?.lat ??

    item?.location?.lat ??

    null;



  const lon =

    item?.geometry?.location?.lng ??

    item?.geometry?.lng ??

    item?.lng ??

    item?.lon ??

    item?.location?.lng ??

    null;



  return {

    id: placeId || `${name}-${secondary}`,

    name,

    secondary,

    lat,

    lon,

    raw: item,

  };

}



async function geocodeWithNominatim(location) {

  const cacheKey = `boff_geocode_${location.toLowerCase().trim()}`;



  const cached = localStorage.getItem(cacheKey);



  if (cached) {

    try {

      return JSON.parse(cached);

    } catch {

      localStorage.removeItem(cacheKey);

    }

  }



  const url = new URL(

    "https://nominatim.openstreetmap.org/search"

  );



  url.searchParams.set("q", location);

  url.searchParams.set("format", "json");

  url.searchParams.set("limit", "1");

  url.searchParams.set("countrycodes", "in");



  const response = await fetch(url.toString(), {

    headers: {

      Accept: "application/json",

    },

  });



  if (!response.ok) {

    throw new Error("Could not find that location.");

  }



  const data = await response.json();



  if (!data.length) {

    throw new Error(`Location "${location}" was not found.`);

  }



  const result = {

    lat: Number(data[0].lat),

    lon: Number(data[0].lon),

    displayName: data[0].display_name,

  };



  localStorage.setItem(cacheKey, JSON.stringify(result));



  return result;

}



async function queryOverpass({ lat, lon, radius, category }) {
  const response = await fetch(PLACES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      lat,
      lon,
      radius,
      category,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data?.error || `Business search failed (${response.status}).`
    );
  }

  return data?.elements || [];
}


function normalizeBusiness(

  element,

  selectedCategory,

  fallbackLocation

) {

  const tags = element.tags || {};



  const lat = element.lat ?? element.center?.lat ?? null;

  const lon = element.lon ?? element.center?.lon ?? null;



  const website = getWebsite(tags);

  const phone = getPhone(tags);

  const email = getEmail(tags);



  const socialLinks = getSocialLinks(tags).map(

    cleanSocialUrl

  );



  const address = getAddress(

    tags,

    fallbackLocation

  );



  const business = {

    id: `${element.type}-${element.id}`,

    name: getBusinessName(tags),

    category: selectedCategory,

    address,

    phone,

    email,

    website: cleanWebsite(website),

    socialLinks,

    lat,

    lon,

    tags,

  };



  business.score = calculateScore(business);

  business.level = getOpportunityLevel(

    business.score

  );



  business.digitalGap = getDigitalGap(business);



  const rule = getCategoryRule(selectedCategory);



  business.products = rule.products || [];

  business.services = rule.services || [];



  return business;

}



function dedupeBusinesses(items) {

  const seen = new Set();



  return items.filter((item) => {

    const key = `${item.name.toLowerCase()}-${item.address

      .toLowerCase()

      .trim()}`;



    if (seen.has(key)) return false;



    seen.add(key);



    return true;

  });

}



function matchesContactFilter(business, filter) {

  switch (filter) {

    case "phone":

      return Boolean(business.phone);



    case "email":

      return Boolean(business.email);



    case "website":

      return Boolean(business.website);



    case "social":

      return business.socialLinks?.length > 0;



    case "contactable":

      return Boolean(

        business.phone ||

          business.email ||

          business.website ||

          business.socialLinks?.length

      );



    case "all":

    default:

      return true;

  }

}



function BusinessCard({ business }) {

  const whatsappLink = makeWhatsAppLink(

    business.phone

  );



  const mapsLink = getMapsLink(

    business.lat,

    business.lon,

    business.address

  );



  const copyBusiness = async () => {

    const text = [

      business.name,

      business.category,

      business.address,

      business.phone

        ? `Phone: ${business.phone}`

        : "",

      business.email

        ? `Email: ${business.email}`

        : "",

      business.website

        ? `Website: ${business.website}`

        : "",

      business.socialLinks?.length

        ? `Social: ${business.socialLinks.join(

            ", "

          )}`

        : "",

      `Opportunity: ${business.level} (${business.score}/100)`,

    ]

      .filter(Boolean)

      .join("\n");



    try {

      await navigator.clipboard.writeText(text);

      alert("Business details copied.");

    } catch {

      alert("Could not copy automatically.");

    }

  };



  return (

    <article className="business-card">

      <div className="business-card-top">

        <div>

          <div className="business-category">

            {business.category}

          </div>



          <h3>{business.name}</h3>

        </div>



        <div className="score-wrap">

          <span

            className={`opportunity-badge ${business.level.toLowerCase()}`}

          >

            {business.level}

          </span>



          <strong>{business.score}/100</strong>

        </div>

      </div>



      <div className="score-track">

        <div

          className={`score-fill ${business.level.toLowerCase()}`}

          style={{

            width: `${business.score}%`,

          }}

        />

      </div>



      <div className="business-info">

        <div>

          <span>📍</span>

          <span>

            {business.address ||

              "Address not listed"}

          </span>

        </div>



        {business.phone && (

          <div>

            <span>📞</span>

            <span>{business.phone}</span>

          </div>

        )}



        {business.email && (

          <div>

            <span>✉️</span>

            <span>{business.email}</span>

          </div>

        )}



        {business.website && (

          <div>

            <span>🌐</span>



            <a

              href={business.website}

              target="_blank"

              rel="noreferrer"

            >

              {business.website.replace(

                /^https?:**\\/\\/**/,

                ""

              )}

            </a>

          </div>

        )}



        {business.socialLinks?.length > 0 && (

          <div>

            <span>📱</span>



            <span>

              {business.socialLinks.length} social

              contact

              {business.socialLinks.length > 1

                ? "s"

                : ""}

            </span>

          </div>

        )}

      </div>



      <div className="digital-gap">

        <div className="section-label">

          DIGITAL GAP

        </div>



        <p>{business.digitalGap}</p>

      </div>



      <div className="sell-section">

        <div className="section-label">

          WHAT CAN I SELL?

        </div>



        <div className="sell-grid">

          <div className="sell-box">

            <h4>Products</h4>



            {business.products.map(

              (product) => (

                <div

                  className="sell-item"

                  key={product}

                >

                  <span>✓</span>

                  <span>{product}</span>

                </div>

              )

            )}

          </div>



          <div className="sell-box">

            <h4>Freelance Services</h4>



            {business.services.map(

              (service) => (

                <div

                  className="sell-item"

                  key={service}

                >

                  <span>✓</span>

                  <span>{service}</span>

                </div>

              )

            )}

          </div>

        </div>

      </div>



      <div className="business-actions">

        {business.phone && (

          <a

            className="action-button call"

            href={`tel:${business.phone}`}

          >

            Call

          </a>

        )}



        {whatsappLink && (

          <a

            className="action-button whatsapp"

            href={whatsappLink}

            target="_blank"

            rel="noreferrer"

          >

            WhatsApp

          </a>

        )}



        <a

          className="action-button maps"

          href={mapsLink}

          target="_blank"

          rel="noreferrer"

        >

          Maps

        </a>



        <button

          className="action-button copy"

          onClick={copyBusiness}

        >

          Copy

        </button>

      </div>

    </article>

  );

}



export default function App() {

  const [location, setLocation] = useState("");

  const [selectedLocation, setSelectedLocation] =

    useState(null);



  const [category, setCategory] =

    useState("restaurant");



  const [radius, setRadius] = useState("5");



  const [contactFilter, setContactFilter] =

    useState("all");



  const [suggestions, setSuggestions] =

    useState([]);



  const [showSuggestions, setShowSuggestions] =

    useState(false);



  const [

    autocompleteLoading,

    setAutocompleteLoading,

  ] = useState(false);



  const [

    autocompleteError,

    setAutocompleteError,

  ] = useState("");



  const [businesses, setBusinesses] =

    useState([]);



  const [loading, setLoading] =

    useState(false);



  const [error, setError] = useState("");



  const [visibleCount, setVisibleCount] =

    useState(20);



  const autocompleteTimer =

    useRef(null);



  const autocompleteAbortController =

    useRef(null);



  const selectedCategory = useMemo(

    () =>

      CATEGORIES.find(

        (item) => item.query === category

      ) || CATEGORIES[0],

    [category]

  );



  const filteredBusinesses = useMemo(

    () =>

      businesses.filter((business) =>

        matchesContactFilter(

          business,

          contactFilter

        )

      ),

    [businesses, contactFilter]

  );



  useEffect(() => {

    return () => {

      if (autocompleteTimer.current) {

        clearTimeout(

          autocompleteTimer.current

        );

      }



      if (autocompleteAbortController.current) {

        autocompleteAbortController.current.abort();

      }

    };

  }, []);



  useEffect(() => {

    const value = location.trim();



    if (!value || value.length < 2) {

      setSuggestions([]);

      setShowSuggestions(false);

      setAutocompleteError("");

      return;

    }



    if (

      selectedLocation &&

      value === selectedLocation.name

    ) {

      setSuggestions([]);

      setShowSuggestions(false);

      return;

    }



    if (!OLA_API_KEY) {

      setAutocompleteError(

        "Ola Maps API key is missing from .env"

      );



      return;

    }



    if (autocompleteTimer.current) {

      clearTimeout(

        autocompleteTimer.current

      );

    }



    autocompleteTimer.current = setTimeout(

      async () => {

        if (autocompleteAbortController.current) {

          autocompleteAbortController.current.abort();

        }



        const controller =

          new AbortController();



        autocompleteAbortController.current =

          controller;



        setAutocompleteLoading(true);

        setAutocompleteError("");



        try {

          const params = new URLSearchParams({

            input: value,

            api_key: OLA_API_KEY,

            language: "en",

          });



          const response = await fetch(

            `${OLA_AUTOCOMPLETE_URL}?${params.toString()}`,

            {

              signal: controller.signal,

              headers: {

                "X-Request-Id":

                  crypto.randomUUID(),

              },

            }

          );



          if (!response.ok) {

            throw new Error(

              `Autocomplete error: ${response.status}`

            );

          }



          const data =

            await response.json();



          const items =

            extractAutocompleteItems(data)

              .map(normalizeSuggestion)

              .filter(

                (item) => item.name

              )

              .slice(0, 8);



          setSuggestions(items);

          setShowSuggestions(

            items.length > 0

          );

        } catch (err) {

          if (

            err.name !== "AbortError"

          ) {

            console.error(err);



            setSuggestions([]);

            setShowSuggestions(false);



            setAutocompleteError(

              "Location suggestions could not be loaded."

            );

          }

        } finally {

          setAutocompleteLoading(false);

        }

      },

      350

    );



    return () => {

      if (autocompleteTimer.current) {

        clearTimeout(

          autocompleteTimer.current

        );

      }

    };

  }, [location, selectedLocation]);



  const chooseSuggestion = (

    suggestion

  ) => {

    setLocation(suggestion.name);

    setSelectedLocation(suggestion);

    setSuggestions([]);

    setShowSuggestions(false);

    setAutocompleteError("");

  };



  const handleLocationChange = (

    event

  ) => {

    const value = event.target.value;



    setLocation(value);



    if (

      selectedLocation &&

      value !== selectedLocation.name

    ) {

      setSelectedLocation(null);

    }

  };



  const handleSearch = async (

    event

  ) => {

    event?.preventDefault();



    setError("");

    setBusinesses([]);

    setVisibleCount(20);



    const searchLocation =

      location.trim();



    if (!searchLocation) {

      setError(

        "Please enter a city, area or location."

      );



      return;

    }



    setShowSuggestions(false);

    setLoading(true);



    try {

      let coordinates =

        selectedLocation;



      if (

        !coordinates ||

        coordinates.lat === null ||

        coordinates.lon === null

      ) {

        coordinates =

          await geocodeWithNominatim(

            searchLocation

          );

      }



      const lat = Number(

        coordinates.lat

      );



      const lon = Number(

        coordinates.lon

      );



      const radiusMeters =

        Number(radius) * 1000;



      const elements = await queryOverpass({
        lat,
        lon,
        radius: radiusMeters,
        category,
      });


      let normalized =

        elements.map((element) =>

          normalizeBusiness(

            element,

            selectedCategory.label,

            coordinates.displayName ||

              searchLocation

          )

        );



      normalized =

        dedupeBusinesses(normalized);



      normalized.sort((a, b) => {

        if (b.score !== a.score) {

          return b.score - a.score;

        }



        return a.name.localeCompare(

          b.name

        );

      });



      setBusinesses(normalized);

    } catch (err) {

      console.error(err);



      setError(

        err?.message ||

          "Something went wrong while searching businesses."

      );

    } finally {

      setLoading(false);

    }

  };



  const visibleBusinesses =

    filteredBusinesses.slice(

      0,

      visibleCount

    );



  const hotCount =

    filteredBusinesses.filter(

      (business) =>

        business.level === "HOT"

    ).length;



  const warmCount =

    filteredBusinesses.filter(

      (business) =>

        business.level === "WARM"

    ).length;



  const noWebsiteCount =

    filteredBusinesses.filter(

      (business) =>

        !business.website

    ).length;



  const estimatedValue =

    hotCount * 4999;



  const exportCSV = () => {

    if (!filteredBusinesses.length) {

      alert(

        "There are no businesses matching the current filter."

      );



      return;

    }



    const headers = [

      "Business Name",

      "Category",

      "Opportunity",

      "Score",

      "Address",

      "Phone",

      "Email",

      "Website",

      "Social Links",

      "Digital Gap",

      "Products",

      "Services",

      "Latitude",

      "Longitude",

    ];



    const rows =

      filteredBusinesses.map(

        (business) => [

          business.name,

          business.category,

          business.level,

          business.score,

          business.address,

          business.phone,

          business.email,

          business.website,

          business.socialLinks?.join(

            " | "

          ) || "",

          business.digitalGap,

          business.products.join(

            " | "

          ),

          business.services.join(

            " | "

          ),

          business.lat,

          business.lon,

        ]

      );



    const escapeCSV = (value) => {

      const text = String(

        value ?? ""

      );



      return `"${text.replace(

        /"/g,

        '""'

      )}"`;

    };



    const csv = [

      headers

        .map(escapeCSV)

        .join(","),

      ...rows.map((row) =>

        row

          .map(escapeCSV)

          .join(",")

      ),

    ].join("\n");



    const blob = new Blob([csv], {

      type: "text/csv;charset=utf-8;",

    });



    const url =

      URL.createObjectURL(blob);



    const link =

      document.createElement("a");



    link.href = url;



    link.download = `business-opportunities-${Date.now()}.csv`;



    document.body.appendChild(link);



    link.click();



    link.remove();



    URL.revokeObjectURL(url);

  };



  return (

    <div className="app-shell">

      <header className="hero">

        <div className="hero-content">

          <div className="eyebrow">

            BUSINESS OPPORTUNITY FINDER

          </div>



          <h1>

            Find Businesses.

            <br />

            Find Their Digital Gaps.

          </h1>



          <p>

            Discover local businesses,

            identify digital opportunities

            and find products or freelance

            services you can sell.

          </p>

        </div>

      </header>



      <main className="container">

        <section className="search-panel">

          <form onSubmit={handleSearch}>

            <div className="search-grid">

              <div className="field location-field">

                <label>LOCATION</label>



                <div className="input-wrapper">

                  <span className="input-icon">

                    📍

                  </span>



                  <input

                    type="text"

                    value={location}

                    onChange={

                      handleLocationChange

                    }

                    onFocus={() => {

                      if (

                        suggestions.length

                      ) {

                        setShowSuggestions(

                          true

                        );

                      }

                    }}

                    placeholder="Search city, town, area..."

                    autoComplete="off"

                  />



                  {autocompleteLoading && (

                    <span className="input-loading">

                      Searching...

                    </span>

                  )}



                  {showSuggestions &&

                    suggestions.length >

                      0 && (

                      <div className="location-suggestions">

                        {suggestions.map(

                          (suggestion) => (

                            <button

                              type="button"

                              className="location-suggestion"

                              key={

                                suggestion.id

                              }

                              onMouseDown={(

                                event

                              ) =>

                                event.preventDefault()

                              }

                              onClick={() =>

                                chooseSuggestion(

                                  suggestion

                                )

                              }

                            >

                              <span className="suggestion-pin">

                                📍

                              </span>



                              <span className="suggestion-text">

                                <strong>

                                  {

                                    suggestion.name

                                  }

                                </strong>



                                {suggestion.secondary && (

                                  <small>

                                    {

                                      suggestion.secondary

                                    }

                                  </small>

                                )}

                              </span>

                            </button>

                          )

                        )}

                      </div>

                    )}

                </div>



                {autocompleteError && (

                  <div className="field-help error-text">

                    {autocompleteError}

                  </div>

                )}

              </div>



              <div className="field">

                <label>CATEGORY</label>



                <select

                  value={category}

                  onChange={(event) =>

                    setCategory(

                      event.target.value

                    )

                  }

                >

                  {CATEGORIES.map(

                    (item) => (

                      <option

                        value={item.query}

                        key={item.query}

                      >

                        {item.label}

                      </option>

                    )

                  )}

                </select>

              </div>



              <div className="field">

                <label>RADIUS</label>



                <select

                  value={radius}

                  onChange={(event) =>

                    setRadius(

                      event.target.value

                    )

                  }

                >

                  <option value="1">

                    1 km

                  </option>

                  <option value="2">

                    2 km

                  </option>

                  <option value="5">

                    5 km

                  </option>

                  <option value="10">

                    10 km

                  </option>

                  <option value="15">

                    15 km

                  </option>

                  <option value="25">

                    25 km

                  </option>

                </select>

              </div>



              <button

                className="search-button"

                type="submit"

                disabled={loading}

              >

                {loading

                  ? "Finding..."

                  : "Find Opportunities"}

              </button>

            </div>



            <div

              className="field"

              style={{

                marginTop: "16px",

                maxWidth: "300px",

              }}

            >

              <label>

                CONTACT FILTER

              </label>



              <select

                value={contactFilter}

                onChange={(event) => {

                  setContactFilter(

                    event.target.value

                  );

                  setVisibleCount(20);

                }}

              >

                {CONTACT_FILTERS.map(

                  (item) => (

                    <option

                      value={item.value}

                      key={item.value}

                    >

                      {item.label}

                    </option>

                  )

                )}

              </select>

            </div>

          </form>

        </section>



        {error && (

          <div className="error-box">

            <strong>

              Search error

            </strong>



            <span>{error}</span>

          </div>

        )}



        {businesses.length > 0 && (

          <>

            <section className="stats-grid">

              <div className="stat-card">

                <span>

                  Businesses

                </span>



                <strong>

                  {

                    filteredBusinesses.length

                  }

                </strong>

              </div>



              <div className="stat-card hot-stat">

                <span>

                  HOT Leads

                </span>



                <strong>

                  {hotCount}

                </strong>

              </div>



              <div className="stat-card">

                <span>

                  WARM Leads

                </span>



                <strong>

                  {warmCount}

                </strong>

              </div>



              <div className="stat-card">

                <span>

                  No Website Listed

                </span>



                <strong>

                  {noWebsiteCount}

                </strong>

              </div>

            </section>



            <section className="summary-bar">

              <div>

                <strong>

                  {selectedCategory.label}

                </strong>



                <span>

                  {" "}

                  opportunities around{" "}

                  {location}

                </span>

              </div>



              <div className="summary-right">

                <span>

                  Potential HOT-lead value:

                </span>



                <strong>

                  ₹

                  {estimatedValue.toLocaleString(

                    "en-IN"

                  )}

                </strong>



                <button

                  className="export-button"

                  onClick={

                    exportCSV

                  }

                >

                  Export CSV

                </button>

              </div>

            </section>



            <div className="source-note">

              <strong>

                Data note:

              </strong>{" "}

              Business information comes

              from Ola Maps. “No website

              listed” means OSM does not

              currently contain a website

              field; it does not prove the

              business has no website.

            </div>



            {filteredBusinesses.length ===

              0 && (

              <div className="empty-state">

                <div className="empty-icon">

                  🔎

                </div>



                <h2>

                  No matching businesses

                </h2>



                <p>

                  No businesses match the

                  selected contact filter.

                  Try another filter.

                </p>

              </div>

            )}



            {filteredBusinesses.length >

              0 && (

              <>

                <section className="results-list">

                  {visibleBusinesses.map(

                    (business) => (

                      <BusinessCard

                        business={

                          business

                        }

                        key={

                          business.id

                        }

                      />

                    )

                  )}

                </section>



                {visibleCount <

                  filteredBusinesses.length && (

                  <div className="load-more-wrap">

                    <button

                      className="load-more-button"

                      onClick={() =>

                        setVisibleCount(

                          (current) =>

                            current + 20

                        )

                      }

                    >

                      Load More

                    </button>

                  </div>

                )}

              </>

            )}

          </>

        )}



        {!loading &&

          !error &&

          businesses.length ===

            0 && (

            <section className="empty-state">

              <div className="empty-icon">

                🔎

              </div>



              <h2>

                Find your next client

              </h2>



              <p>

                Enter any city, town,

                locality or area, choose a

                business category and

                discover potential

                digital-service leads.

              </p>

            </section>

          )}

      </main>

    </div>

  );

}