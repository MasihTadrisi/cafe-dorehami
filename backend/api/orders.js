
   import fs from "fs/promises";
   import path from "path";

   const dbFile = path.join(process.cwd(), "data", "db.json");

   export default async function handler(req, res) {
     let db = { orders: [], users: [], discounts: [], weeklyRevenue: [] };
     try {
       const data = await fs.readFile(dbFile, "utf8");
       db = JSON.parse(data);
     } catch (error) {
       if (error.code !== "ENOENT") {
         console.error("Read file error:", error);
         return res.status(500).json({ error: "Error reading db file" });
       }
     }

     if (req.method === "GET") {
       res.status(200).json(db.orders || []);
     } else if (req.method === "POST") {
       try {
         const newOrder = { ...req.body, id: Date.now().toString() };
         db.orders = [...(db.orders || []), newOrder];
         await fs.writeFile(dbFile, JSON.stringify(db, null, 2));
         res.status(200).json(newOrder);
       } catch (error) {
         console.error("Post order error:", error);
         res.status(500).json({ error: error.message });
       }
     } else if (req.method === "DELETE") {
       try {
         const { id } = req.query;
         if (!id) return res.status(400).json({ error: "Order ID required" });
         db.orders = (db.orders || []).filter(o => o.id !== id);
         await fs.writeFile(dbFile, JSON.stringify(db, null, 2));
         res.status(200).json({ message: "Order deleted" });
       } catch (error) {
         console.error("Delete order error:", error);
         res.status(500).json({ error: error.message });
       }
     } else {
       res.status(405).json({ error: "Method not allowed" });
     }
   }
