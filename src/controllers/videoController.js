import Video from "../models/Video";

export const home = (req, res) => {
  console.log("start");
  Video.find({}, (error, videos) => {
    console.log("finished");
    return res.render("Home", { pageTitle: "Home", videos: [] });
  });
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
export const upload = (req, res) => res.send("Upload Video");
export const remove = (req, res) => res.send("Delete Video");
