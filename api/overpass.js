export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await fetch(
      "https://overpass-api.de/api/interpreter",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "BusinessOpportunityFinder/1.0",
        },
        body:
          typeof req.body === "string"
            ? req.body
            : new URLSearchParams(req.body || {}).toString(),
      }
    );

    const text = await response.text();

    res.status(response.status).send(text);
  } catch (error) {
    console.error("Overpass proxy error:", error);

    res.status(500).json({
      error: "Overpass request failed",
      details: error.message,
    });
  }
}