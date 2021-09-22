const videos = [
  {
    title: "whadda",
    rating: 4,
    views: 579,
    id: 1,
  },
  {
    title: "locco",
    rating: 3,
    views: 637,
    id: 2,
  },
  {
    title: "combriiito",
    rating: 3,
    views: 1,
    id: 3,
  },
];

export const home = (req, res) => {
  return res.render("Home", { pageTitle: "Home", videos });
};
export const search = (req, res) => res.send("Search");

export const see = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("watch", { pageTitle: `Watch ${video.title}`, video });
};
export const getEdit = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("editVideo", { pageTitle: `Edit: ${video.title}`, video });
};
export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  videos[id - 1].title = title;
  return res.redirect(`/videos/${id}`);
};
export const upload = (req, res) => res.send("Upload Video");
export const remove = (req, res) => res.send("Delete Video");
