import express from "express";
import morgan from "morgan";

const PORT = 4000;

const app = express();
const logger = morgan("dev");

const home = (req, res) => {
  return res.send("Home for you.");
};

const login = (req, res) => {
  return res.send("Login is here.");
};

app.use(logger);
app.get("/", home);
app.get("/login", login);

const handleListening = () =>
  console.log(`Listening on http://localhost:${PORT} 🚀`);

app.listen(4000, handleListening);
