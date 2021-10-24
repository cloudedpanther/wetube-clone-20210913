import "dotenv/config";
import "regenerator-runtime/runtime.js";
import "./db";
import "./models/Video";
import "./models/User";
import "./models/Comment";
import app from "./server";

const PORT = process.env.PORT || 4000;

const handleListening = () =>
  console.log(`✅ Listening on http://localhost:${PORT} 🚀`);

app.listen(4000, handleListening);
