
import fs from "fs/promises";
import path from "path";

const ordersFile = path.join(process.cwd(), "data", "orders.json");

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const newOrder = { ...req.body, timestamp: new Date().toISOString() };
      let orders = [];
      try {
        const data = await fs.readFile(ordersFile, "utf8");
        orders = JSON.parse(data);
      } catch (error) {
        // File doesn't exist yet, start with empty array
      }
      orders.push(newOrder);
      await fs.writeFile(ordersFile, JSON.stringify(orders, null, 2));
      res.status(200).json({ message: "Order saved" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
