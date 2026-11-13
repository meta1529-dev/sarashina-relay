// Shared relay logic: injects the Sarashina API key server-side and
// forwards to api.sarashina.ai. Callers must present the relay token.
export async function forward(req, res, upstreamPath) {
  const token = req.headers["x-relay-token"];
  if (!process.env.RELAY_TOKEN || token !== process.env.RELAY_TOKEN) {
    res.status(401).json({ message: "relay unauthorized" });
    return;
  }
  if (!process.env.SARASHINA_API_KEY) {
    res.status(500).json({ message: "SARASHINA_API_KEY not configured" });
    return;
  }
  let body;
  if (req.method === "POST") {
    body = await new Promise((resolve, reject) => {
      const chunks = [];
      req.on("data", (c) => chunks.push(c));
      req.on("end", () => resolve(Buffer.concat(chunks)));
      req.on("error", reject);
    });
  }
  const upstream = await fetch(`https://api.sarashina.ai${upstreamPath}`, {
    method: req.method,
    headers: {
      Authorization: `Bearer ${process.env.SARASHINA_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: body && body.length ? body : undefined,
  });
  const text = await upstream.text();
  res.status(upstream.status);
  res.setHeader("Content-Type", upstream.headers.get("content-type") || "application/json");
  res.send(text);
}
