import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/wetube-clone-20210913", {
  useNewUrlParser: true,
  useUnifiedToPology: true,
});

const db = mongoose.connection;

db.on("error", (error) => console.log("DB Error", error));
db.once("open", () => console.log("✅ Connected to DB"));
