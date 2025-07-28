   import fs from "fs/promises";
   import path from "path";

   const dbFile = path.join(process.cwd(), "data", "db.json");

   export default async function handler(req, res) {
     let db = { weeklyRevenue: [{ id: 1, total: 0, daily: Array(7).fill(0) }] };
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
       const revenue = db.weeklyRevenue.find(r => r.id === "1") || { id: 1, total: 0, daily: Array(7).fill(0) };
       res.status(200).json(revenue);
     } else if (req.method === "PATCH") {
       try {
         const updatedRevenue = { ...req.body };
         db.weeklyRevenue = db.weeklyRevenue.map(r => (r.id === "1" ? updatedRevenue : r));
         await fs.writeFile(dbFile, JSON.stringify(db, null, 2));
         res.status(200).json(updatedRevenue);
       } catch (error) {
         console.error("Update revenue error:", error);
         res.status(500).json({ error: error.message });
       }
     } else {
       res.status(405).json({ error: "Method not allowed" });
     }
   }
