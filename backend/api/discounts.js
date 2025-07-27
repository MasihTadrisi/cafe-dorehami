import fs from "fs/promises";
import path from "path";

const discountsFile = path.join(process.cwd(), "data", "discounts.json");

export default async function handler(req, res) {
  let discounts = [];
  try {
    const data = await fs.readFile(discountsFile, "utf8");
    discounts = JSON.parse(data);
  } catch (error) {
    // File doesn't exist yet, start with empty array
  }

  if (req.method === "GET") {
    const { userPhone, _sort, _order, _limit } = req.query;
    let filteredDiscounts = discounts;
    if (userPhone) {
      filteredDiscounts = discounts.filter(d => d.userPhone === userPhone);
    }
    if (_sort === "timestamp" && _order === "desc" && _limit) {
      filteredDiscounts = filteredDiscounts
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, parseInt(_limit));
    }
    res.status(200).json(filteredDiscounts);
  } else if (req.method === "POST") {
    try {
      const newDiscount = req.body;
      discounts.push(newDiscount);
      await fs.writeFile(discountsFile, JSON.stringify(discounts, null, 2));
      res.status(200).json(newDiscount);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
