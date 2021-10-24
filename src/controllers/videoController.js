import User from "../models/User";
import Video from "../models/Video";
import Comment from "../models/Comment";

export const home = async (req, res) => {
  try {
    const videos = await Video.find({})
      .sort({ createdAt: "desc" })
      .populate("owner");
    return res.render("home", { pageTitle: "Home", videos });
  } catch {
    return res.send("Server Error!");
  }
};
export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(`${keyword}$`, "i"),
      },
    }).populate("owner");
  }
  return res.render("search", { pageTitle: "Search ", videos });
};

export const see = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner").populate("comments");
  if (!video) return res.render("404", { pageTitle: "Video Not Found" });
  else return res.render("watch", { pageTitle: video.title, video });
};
export const getEdit = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id },
    },
  } = req;
  const video = await Video.findById(id);
  if (!video) return res.render("404", { pageTitle: "Video Not Found" });
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "Not Authorized");
    return res.status(403).redirect("/");
  }
  req.flash("success", "Video Updated");
  return res.render("editVideo", { pageTitle: `Edit ${video.title}`, video });
};
export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id });
  if (!video)
    return res.status(404).render("404", { pageTitle: "Video Not Found" });
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  return res.redirect(`/videos/${id}`);
};
export const getUpload = (req, res) => {
  res.header("Cross-Origin-Embedder-Policy", "require-corp");
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  return res.render("upload", { pageTitle: "Upload Video" });
};
export const postUpload = async (req, res) => {
  const {
    files: { video, thumb },
    body: { title, description, hashtags },
    session: {
      user: { _id },
    },
  } = req;
  try {
    const isHeroku = process.env.NODE_ENV === "production";
    const newVideo = await Video.create({
      title,
      fileUrl: isHeroku ? video[0].location : video[0].path,
      thumbUrl: isHeroku ? thumb[0].location : thumb[0].path,
      owner: _id,
      description,
      hashtags: Video.formatHashtags(hashtags),
    });
    const user = await User.findById(newVideo.owner);
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    return res.status(404).render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};
export const remove = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id },
    },
  } = req;
  const video = await Video.findById(id);
  if (!video) return res.render("404", { pageTitle: "Video Not Found" });
  if (String(video.owner) !== String(_id)) return res.status(403).redirect("/");
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) return res.sendStatus(404);
  video.meta.views++;
  await video.save();
  return res.sendStatus(200);
};

export const createComment = async (req, res) => {
  const {
    params: { id },
    body: { text },
    session: { user },
  } = req;
  const video = await Video.findById(id);
  if (!video) return res.sendStatus(404);
  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });
  video.comments.push(comment._id);
  video.save();
  return res.status(201).json({ newCommentId: comment._id });
};

export const deleteComment = async (req, res) => {
  const {
    params: { id },
    session: { user },
  } = req;
  const comment = await Comment.findById(id);
  if (!comment) return res.render("404", { pageTitle: "Video Not Found" });
  if (String(comment.owner._id) !== String(user._id))
    return res.sendStatus(403);
  await Comment.findByIdAndDelete(id);
  return res.sendStatus(201);
};
