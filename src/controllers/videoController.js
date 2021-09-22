const fakeUser = {
  name: "dooley",
  loggedIn: true,
};

export const home = (req, res) =>
  res.render("Home", { pageTitle: "Home", fakeUser });
export const search = (req, res) => res.send("Search");

export const see = (req, res) =>
  res.render("watch", { pageTitle: "Watch Video" });
export const edit = (req, res) => res.send("Edit Video");
export const upload = (req, res) => res.send("Upload Video");
export const remove = (req, res) => res.send("Delete Video");
