import fs from "fs/promises";
import path from "path";

const usersFile = path.join(process.cwd(), "data", "users.json");

export default async function handler(req, res) {
  let users = [];
  try {
    const data = await fs.readFile(usersFile, "utf8");
    users = JSON.parse(data);
  } catch (error) {
    // File doesn't exist yet, start with empty array
  }

  if (req.method === "GET") {
    const phoneNumber = req.query.phoneNumber;
    if (phoneNumber) {
      const filteredUsers = users.filter(user => user.phoneNumber === phoneNumber);
      res.status(200).json(filteredUsers);
    } else {
      res.status(200).json(users);
    }
  } else if (req.method === "POST") {
    try {
      const newUser = req.body;
      users.push(newUser);
      await fs.writeFile(usersFile, JSON.stringify(users, null, 2));
      res.status(200).json(newUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}