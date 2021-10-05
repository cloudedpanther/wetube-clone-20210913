export const localsMiddleware = (req, res, next) => {
  console.log(req.session);
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.user = req.session.user || {};
  res.locals.siteName = "Wetube";
  next();
};

export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) next();
  else res.redirect("/login");
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) next();
  else res.redirect("/");
};
