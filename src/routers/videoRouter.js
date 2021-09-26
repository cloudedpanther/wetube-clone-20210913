import express from "express";
import {
  getEdit,
  getUpload,
  postEdit,
  postUpload,
  remove,
  see,
} from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.route("/upload").get(getUpload).post(postUpload);
videoRouter.get("/:id", see);
videoRouter.route("/:id/edit").get(getEdit).post(postEdit);
videoRouter.get("/:id/delete", remove);

export default videoRouter;
