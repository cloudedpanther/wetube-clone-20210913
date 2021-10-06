import express from "express";
import {
  getEdit,
  getUpload,
  postEdit,
  postUpload,
  remove,
  see,
} from "../controllers/videoController";
import { protectorMiddleware, uploadFiles, videoUpload } from "../middlewares";

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-z]{24})", see);
videoRouter
  .route("/:id([0-9a-z]{24})/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(postEdit);
videoRouter.get("/:id([0-9a-z]{24})/delete", protectorMiddleware, remove);
videoRouter
  .route("/upload")
  .all(protectorMiddleware)
  .get(getUpload)
  .post(videoUpload.single("video"), postUpload);

export default videoRouter;
