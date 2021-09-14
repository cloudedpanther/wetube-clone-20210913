import express from "express";

const PORT = 4000;

const app = express();

const handleHome = (req, res) => {
  return res.send("Home for you.");
};

const handleLogin = (req, res) => {
  return res.send("Login is here.");
};

app.get("/", handleHome);
app.get("/login", handleLogin);

const handleListening = () =>
  console.log(`Listening on http://localhost:${PORT} 🚀`);

app.listen(4000, handleListening);
