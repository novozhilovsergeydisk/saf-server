const jwt = require('jsonwebtoken');
const { jwt_access_token, jwt_refresh_token } = require('../conf.js');

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, jwt_access_token, {expiresIn: '30m'});
        const refreshToken = jwt.sign(payload, jwt_refresh_token, {expiresIn: '30d'});
        return { accessToken, refreshToken };
    }

    saveToken(userId, refreshToken) {
        const tokenData = 'dumb'; // await tokenModel.findOne(userId)
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const token = 'dumb'; // await  tokenModel.create({user: userId, refreshToken})
        return token;
    }
}

module.exports = new TokenService();