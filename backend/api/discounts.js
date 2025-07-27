import fs from "fs/promises";
import path from "path";

const discountsFile = path.join(process.cwd(), "data", "discounts.json");

export default async function handler(req, res) {
  let discounts = [];
  try {
    const data = await fs.readFile(discountsFile, "utf8");
    discounts = JSON.parse(data);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("Read discounts file error:", error);
      return res.status(500).json({ error: "Error reading discounts file" });
    }
    // اگر فایل وجود نداشت آرایه خالی بمونه
  }

  if (req.method === "GET") {
    const { userPhone, _sort, _order, _limit } = req.query;
    let filteredDiscounts = discounts;

    if (userPhone) {
      filteredDiscounts = filteredDiscounts.filter(d => d.userPhone === userPhone);
    }

    if (_sort === "timestamp" && _order === "desc" && _limit) {
      filteredDiscounts = filteredDiscounts
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, parseInt(_limit));
    }

    res.status(200).json(filteredDiscounts);

  } else if (req.method === "POST") {
    try {
      const newDiscount = req.body;

      // (اختیاری) اعتبارسنجی اولیه
      if (!newDiscount || !newDiscount.userPhone || !newDiscount.timestamp) {
        return res.status(400).json({ error: "Invalid discount data" });
      }

      discounts.push(newDiscount);
      await fs.writeFile(discountsFile, JSON.stringify(discounts, null, 2));
      res.status(200).json(newDiscount);

    } catch (error) {
      console.error("Write discount error:", error);
      res.status(500).json({ error: error.message });
    }

  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
