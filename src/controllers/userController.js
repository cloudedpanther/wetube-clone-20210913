import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";
import Video from "../models/Video";

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
  const user = await User.findOne({ userName, socialOnly: false });
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

export const getEdit = (req, res) => {
  res.render("editProfile", { pageTitle: "Edit Profile" });
};
export const postEdit = async (req, res) => {
  const pageTitle = "Edit Profile";
  const {
    session: {
      user: { _id, userName: sessionUserName, email: sessionEmail, avatarUrl },
    },
    body: { name, email, userName, location },
    file,
  } = req;
  if (userName !== sessionUserName && (await User.exists({ userName }))) {
    return res.status(400).render("editProfile", {
      pageTitle,
      errorMessage: "An account with the username already exists.",
    });
  }
  if (email !== sessionEmail && (await User.exists({ email }))) {
    return res.status(400).render("editProfile", {
      pageTitle,
      errorMessage: "An account with the e-mail already exists.",
    });
  }
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl: file ? file.path : avatarUrl,
      name,
      email,
      userName,
      location,
    },
    { new: true }
  );
  req.session.user = updatedUser;
  return res.redirect("/users/edit");
};

export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) return res.redirect("/users/edit");
  return res.render("changePassword", { pageTitle: "Change Password" });
};

export const postChangePassword = async (req, res) => {
  const pageTitle = "Change Password";
  const {
    session: {
      user: { _id },
    },
    body: { password, newPassword, newPasswordConfirm },
  } = req;
  const user = await User.findById(_id);
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(400).render("editProfile", {
      pageTitle,
      errorMessage: "You've got the wrong password.",
    });
  }
  if (newPassword !== newPasswordConfirm) {
    return res.status(400).render("editProfile", {
      pageTitle,
      errorMessage: "Password confirmation does not match.",
    });
  }
  user.password = newPassword;
  await user.save();
  return res.redirect("/users/logout");
};

export const see = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate("videos");
  if (!user)
    return res.status("404").render("404", { pageTitle: "User Not Found." });
  return res.render("profile", {
    pageTitle: user.name ? user.name : user.userName,
    user,
  });
};

export const logout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};

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
    console.log(userData);
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
    if (!emailObj) return res.redirect("/login");
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        userName: userData.login,
        email: emailObj.email,
        avatarUrl: userData.avatar_url,
        socialOnly: true,
        password: "",
        name: userData.name ? userData.name : "",
        location: userData.location ? userData.location : "",
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};
