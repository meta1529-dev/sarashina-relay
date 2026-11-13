import { forward } from "./_shared.js";
export const config = { regions: ["hnd1"] };
export default async function handler(req, res) {
  if (req.method !== "GET") { res.status(405).json({ message: "GET only" }); return; }
  try { await forward(req, res, "/v1/models"); }
  catch (e) { res.status(502).json({ message: `relay upstream error: ${e.message}` }); }
}
