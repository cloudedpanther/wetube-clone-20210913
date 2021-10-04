import User from "../models/User";
import fetch from "node-fetch";
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
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "You got the wrong password.",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const see = (req, res) => res.send("See User");
export const logout = (req, res) => res.send("Log-Out");

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    const existingUser = await User.findOne({ email: emailObj.email });
    if (!emailObj) return res.redirect("/login");
    if (existingUser) {
      req.session.loggedIn = true;
      req.session.user = existingUser;
      return res.redirect("/");
    } else {
      const user = await User.create({
        userName: userData.login,
        email: emailObj.email,
        socialOnly: true,
        password: "",
        name: userData.name ? userData.name : "",
        location: userData.location ? userData.location : "",
      });
      req.session.loggedIn = true;
      req.session.user = user;
      return res.redirect("/");
    }
  } else {
    return res.redirect("/login");
  }
};
