import express from "express";
import {
  getEdit,
  postEdit,
  remove,
  see,
  upload,
} from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/upload", upload);
videoRouter.get("/:id", see);
videoRouter.route("/:id/edit").get(getEdit).post(postEdit);
videoRouter.get("/:id/delete", remove);

export default videoRouter;
