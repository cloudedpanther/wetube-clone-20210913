import Video from "../models/Video";

export const home = async (req, res) => {
  try {
    const videos = await Video.find({});
    console.log(videos);
    return res.render("Home", { pageTitle: "Home", videos });
  } catch {
    return res.send("Server Error!");
  }
};
export const search = (req, res) => res.send("Search");

export const see = (req, res) => {
  const { id } = req.params;
  return res.render("watch", { pageTitle: `Watch` });
};
export const getEdit = (req, res) => {
  const { id } = req.params;
  return res.render("editVideo", { pageTitle: `Edit` });
};
export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  return res.redirect(`/videos/${id}`);
};
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};
export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  try {
    await Video.create({
      title,
      description,
      hashtags: hashtags.split(",").map((word) => `#${word}`),
    });
    return res.redirect("/");
  } catch (error) {
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};
export const remove = (req, res) => res.send("Delete Video");
