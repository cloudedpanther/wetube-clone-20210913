import "./db";
import "./models/Video";
import app from "./server";

const PORT = 4000;

const handleListening = () =>
  console.log(`✅ Listening on http://localhost:${PORT} 🚀`);

app.listen(4000, handleListening);
