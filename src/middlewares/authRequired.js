const authService = require("@root/src/services/auth.service");
const { httpCodes } = require("../configs/constants");
const userService = require("../services/user.service");

async function authRequired(req, res, next) {
  const accessToken = req.headers?.authorization?.slice(6)?.trim();
  const payload = await authService.verifyAccessToken(accessToken);

  const isValidAccessToken =
    await authService.checkValidAccessToken(accessToken);

  if (!isValidAccessToken || payload.exp < Date.now() / 1000) {
    return res.error(httpCodes.unauthorized, "Unauthorized.");
  }

  const userId = payload.sub;
  const [users] = await userService.getUsersById(userId);

  const user = users[0];

  if (!user) {
    return res.error(httpCodes.unauthorized, "Unauthorized");
  }

  req.currentUser = { ...user, access_token: accessToken };
  next();
}

module.exports = authRequired;
