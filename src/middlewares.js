import multer from "multer";

export const localsMiddleware = (req, res, next) => {
  console.log(req.session);
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.user = req.session.user || {};
  res.locals.siteName = "Wetube";
  next();
};

export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) next();
  else {
    req.flash("error", "Not Authorized");
    res.redirect("/login");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) next();
  else {
    req.flash("error", "Not Authorized");
    res.redirect("/");
  }
};

export const avatarUpload = multer({
  dest: "uploads/avatars",
  limits: {
    fileSize: 3000000,
  },
});
export const videoUpload = multer({
  dest: "uploads/videos",
  limits: {
    fileSize: 10000000,
  },
});
