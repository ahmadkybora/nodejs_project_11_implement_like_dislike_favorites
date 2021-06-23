const jwt = require('jsonwebtoken');

async function isLoggedIn(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({
            state: true,
            message: "unAuthorized!",
            data: null,
            errors: null
        });
    } else {
        jwt.verify(token, process.env.Access_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.status(401).json({
                    state: true,
                    message: "unAuthorized!",
                    data: null,
                    errors: null
                });
            } else {
                req.user = user;
                next()
            }
        })
    }

}

module.exports = isLoggedIn;

