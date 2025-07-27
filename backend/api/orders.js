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
        // اگر فایل وجود نداشت، آرایه خالی در نظر گرفته میشه
        if (error.code !== "ENOENT") {
          console.error("Read file error:", error);
          return res.status(500).json({ error: "Error reading orders file" });
        }
      }
      orders.push(newOrder);
      await fs.writeFile(ordersFile, JSON.stringify(orders, null, 2));
      res.status(200).json({ message: "Order saved" });
    } catch (error) {
      console.error("Save order error:", error);
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === "GET") {
    try {
      const data = await fs.readFile(ordersFile, "utf8");
      const orders = JSON.parse(data);
      res.status(200).json(orders);
    } catch (error) {
      if (error.code === "ENOENT") {
        // اگر فایل وجود ندارد، آرایه خالی برگردان
        res.status(200).json([]);
      } else {
        console.error("Read orders error:", error);
        res.status(500).json({ error: "Error reading orders file" });
      }
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
