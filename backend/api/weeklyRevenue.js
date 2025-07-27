import fs from "fs/promises";
import path from "path";

const revenueFile = path.join(process.cwd(), "data", "weeklyRevenue.json");

export default async function handler(req, res) {
  let revenue = { id: 1, total: 0, daily: Array(7).fill(0) };
  try {
    const data = await fs.readFile(revenueFile, "utf8");
    revenue = JSON.parse(data);
  } catch (error) {
    // File doesn't exist yet, start with default
  }

  if (req.method === "GET") {
    res.status(200).json(revenue);
  } else if (req.method === "PATCH") {
    try {
      const updatedRevenue = { ...revenue, ...req.body };
      await fs.writeFile(revenueFile, JSON.stringify(updatedRevenue, null, 2));
      res.status(200).json(updatedRevenue);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}