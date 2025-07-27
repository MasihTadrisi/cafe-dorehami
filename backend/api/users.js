import fs from "fs/promises";
import path from "path";

const usersFile = path.join(process.cwd(), "data", "users.json");

export default async function handler(req, res) {
  let users = [];
  try {
    const data = await fs.readFile(usersFile, "utf8");
    users = JSON.parse(data);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("Read users file error:", error);
      return res.status(500).json({ error: "Error reading users file" });
    }
    // اگر فایل وجود نداشت آرایه خالی در نظر گرفته می‌شود
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

      // اعتبارسنجی اولیه (اختیاری ولی توصیه می‌شود)
      if (!newUser || !newUser.phoneNumber || !newUser.name) {
        return res.status(400).json({ error: "Invalid user data" });
      }

      users.push(newUser);
      await fs.writeFile(usersFile, JSON.stringify(users, null, 2));
      res.status(200).json(newUser);

    } catch (error) {
      console.error("Write user error:", error);
      res.status(500).json({ error: error.message });
    }

  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
