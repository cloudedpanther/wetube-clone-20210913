export const home = (req, res) => {
  const videos = [
    {
      title: "whadda",
      rating: 4,
      views: 579,
    },
    {
      title: "locco",
      rating: 3,
      views: 637,
    },
    {
      title: "combriiito",
      rating: 3,
      views: 231,
    },
  ];
  return res.render("Home", { pageTitle: "Home", videos });
};
export const search = (req, res) => res.send("Search");

export const see = (req, res) =>
  res.render("watch", { pageTitle: "Watch Video" });
export const edit = (req, res) => res.send("Edit Video");
export const upload = (req, res) => res.send("Upload Video");
export const remove = (req, res) => res.send("Delete Video");
