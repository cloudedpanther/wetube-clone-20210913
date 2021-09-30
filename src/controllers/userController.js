import User from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
  const { userName, email, password, passwordConfirm, name, location } =
    req.body;
  const exists = await User.exists({ $or: [{ userName }, { email }] });
  if (password !== passwordConfirm) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: "Password confirmation does not match.",
    });
  }
  if (exists) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: "This username or email is already taken.",
    });
  }
  try {
    await User.create({
      userName,
      email,
      password,
      name,
      location,
    });
    res.redirect("/login");
  } catch (error) {
    return res.status(404).render("join", {
      pageTitle: "Join",
      errorMessage: error._message,
    });
  }
};

export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Log In" });
export const postLogin = async (req, res) => {
  const { userName, password } = req.body;
  const pageTitle = "Log In";
  const user = await User.findOne({ userName });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "An account with this username doesn't exists.",
    });
  }
  const passwordMatch = bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "You got the wrong password.",
    });
  }
  return res.rendirect("/");
};

export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const see = (req, res) => res.send("See User");
export const logout = (req, res) => res.send("Log-Out");
