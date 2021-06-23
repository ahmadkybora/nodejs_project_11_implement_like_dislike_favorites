const User = require('../../../app/Models/UserModel');
const Token = require('../../../app/Models/TokenModel');
const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Validator = require('fastest-validator');
const v = new Validator();
const generateAccessToken = require('../../../helpers/generateAccessToken');


const AuthController = {
    handleLogin,
    rememberMe,
    login,
    register,
    logout,
    forgetPassword,
    resetPassword,
    pub,
};

async function pub(req, res) {
    return res.status(200).json({
        state: null,
        message: null,
        data: null,
        errors: null
    });
}

async function login(req, res) {
    console.log(req.body);
    const user = await User.findOne({
        where: {
            username: req.body.username
        }
    });

    const refreshToken = jwt.sign(user.username, process.env.REFRESH_TOKEN_SECRET);
    const accessToken = generateAccessToken(user.username, user.id);

    Token.create({
        token: accessToken,
        userId: user.id,
    }, {
        include: {
            model: User
        }
    });

    return res.status(200).json({
        state: true,
        message: "your are logged in!",
        data: {
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
            accessToken,
            refreshToken
        },
        errors: null
    });
}

async function handleLogin(req, res, next) {
    await passport.authenticate("local", {
        successRedirect: "panel/dashboard",
        failureRedirect: "login",
        failureFlash: true
    })(req, res, next);
}

function rememberMe(req, res) {
    console.log(req.body.remember)
    if (req.body.remember) {
        req.session.cookie.originalMaxAge = 24 * 60 * 60 * 1000;
    } else {
        req.session.cookie.expire = null;
    }

    res.redirect("/panel/dashboard")
}

async function register(req, res) {
    const {first_name, last_name, username, email, password} = req.body;
    const hash = await bcrypt.hash(password, 10);
    User.create({first_name, last_name, username, email, password: hash});

    return res.status(201).json({
        state: true,
        message: "You are successfully registered!",
        data: null,
        errors: null
    });
}

async function logout(req, res) {
    /*let authHeader = req.headers['authorization'];
    let token = authHeader && authHeader.split(' ')[1];

    return res.status(200).json({
        state: true,
        message: "You are successfully logged out!",
        data: null,
        errors: null
    });*/
}

async function forgetPassword(req, res) {

    const {email} = req.body;
    const user = await User.findOne({email: email});
    if (!user) {
        return res.render("auth/forget-password", {
            pageTitle: "",
            path: "",
        })
    }

    const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET, {expiresIn: "1h"});
    const resetLink = `http://localhost:3000/reset-password/${token}`;
    //sendEmail(user.first_name, user.last_name, user.email, 'فراموشی رمز عبور', )
}

async function resetPassword(req, res) {
    const p = req.body;
    res.send(p);
}

module.exports = AuthController;
