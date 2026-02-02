const jwt = require("jsonwebtoken");
const authConfig = require("@/configs/auth.config");
const authModel = require("@/models/auth.model");
const AppError = require("@/utils/AppError");
const { httpCodes } = require("../configs/constants");

class AuthService {
  async signAccessToken(user) {
    try {
      const ttl = authConfig.accessTokenTTL;

      const accessToken = await jwt.sign(
        {
          sub: user.id,
          exp: Date.now() / 1000 + ttl,
        },
        authConfig.jwtAccessTokenSecret,
      );

      await authModel.saveAccessToken({
        userId: user.id,
        accessToken,
      });

      return accessToken;
    } catch (error) {
      throw error;
    }
  }

  async signRefreshToken(user) {
    try {
      const ttl = authConfig.refreshTokenTTL;

      const refreshToken = await jwt.sign(
        {
          sub: user.id,
          exp: Date.now() / 1000 + ttl * 24 * 60 * 60,
        },
        authConfig.jwtRefreshTokenSecret,
      );

      await authModel.saveRefreshToken({
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + ttl * 24 * 60 * 60 * 1000),
      });

      return refreshToken;
    } catch (error) {
      throw error;
    }
  }

  async verifyAccessToken(accessToken) {
    try {
      const payload = await jwt.verify(
        accessToken,
        authConfig.jwtAccessTokenSecret,
      );
      return payload;
    } catch (error) {
      throw error;
    }
  }

  async verifyRefreshToken(refreshToken) {
    try {
      const payload = await jwt.verify(
        refreshToken,
        authConfig.jwtRefreshTokenSecret,
      );
      return payload;
    } catch (error) {
      throw error;
    }
  }

  async checkCredentials(credentials) {
    try {
      const { email, password } = credentials;
      if (!email) {
        throw new AppError(httpCodes.badRequest || 400, "Email is required.");
      }
      if (!password) {
        throw new AppError(
          httpCodes.badRequest || 400,
          "Password is required.",
        );
      }
      if (password.length < 8) {
        throw new AppError(
          httpCodes.badRequest || 400,
          "Password must be at least 8 characteristics.",
        );
      }
      return credentials;
    } catch (error) {
      throw error;
    }
  }

  async checkValidRefreshToken(refreshToken) {
    try {
      const body = { refreshToken };
      const isValid = await authModel.checkValidRefreshToken(body);
      if (!isValid) {
        throw new AppError(
          httpCodes.badRequest || 400,
          "Token invalid or expired.",
        );
      }
      return isValid;
    } catch (error) {
      throw new AppError(
        httpCodes.badRequest || 400,
        "Token invalid or expired.",
      );
    }
  }

  async checkValidAccessToken(accessToken) {
    try {
      const body = { accessToken };
      const isValid = await authModel.checkValidAccessToken(body);
      if (!isValid) {
        throw new AppError(
          httpCodes.badRequest || 400,
          "Token invalid or expired.",
        );
      }
      return isValid;
    } catch (error) {
      throw new AppError(
        httpCodes.badRequest || 400,
        "Token invalid or expired.",
      );
    }
  }

  async revokeRefreshToken(refreshToken) {
    try {
      const body = { refreshToken };
      const isValid = await authModel.revokeRefreshToken(body);
      if (!isValid) {
        throw new AppError(
          httpCodes.badRequest || 400,
          "Token invalid or expired.",
        );
      }
      return isValid;
    } catch (error) {
      throw new AppError(httpCodes.badRequest || 400, "Token invalid.");
    }
  }

  async login(credentials) {
    try {
      const user = await authModel.login(credentials);
      return user;
    } catch (error) {
      throw new AppError(
        httpCodes.unauthorized || 401,
        "Email or password is incorrect.",
      );
    }
  }

  async register(credentials) {
    try {
      const id = await authModel.register(credentials);
      return id;
    } catch (error) {
      throw new AppError(httpCodes.conflict || 409, "Email already exists.");
    }
  }

  async logout(credentials) {
    try {
      await authModel.logout(credentials);
      return null;
    } catch (error) {
      throw new AppError(
        httpCodes.unauthorized || 401,
        "Email or password is incorrect.",
      );
    }
  }
}

module.exports = new AuthService();
