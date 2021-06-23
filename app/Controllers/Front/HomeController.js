const Brand = require('../../Models/BrandModel');
const ProductCategory = require('../../Models/ProductCategoryModel');
const Product = require('../../Models/ProductModel');
const ArticleCategory = require('../../Models/ArticleCategoryModel');
const Article = require('../../Models/ArticleModel');
const Employee = require('../../Models/EmployeeModel');
const User = require('../../Models/UserModel');
const ProductLike = require('../../Models/ProductLikeModel');
const ArticleLike = require('../../Models/ArticleLikeModel');
const isLoggedIn = require('../../../middlewares/isLoggedIn');
//import captchapng from 'captchapng';
//let CAPTCHA_NUM = parseInt(Math.random() * 9000 + 1000);
//let CAPTCHA_NUM = parseInt(1);

const HomeController = {
    index,
    brands,
    productCategories,
    products,
    productLikes,
    productDisLikes,
    articleCategories,
    articles,
    getContactUs,
    postContactUs,
    getCaptcha
};

async function index(req, res) {
    try {
        return res.status(200).json({
            state: true,
            message: "Success!",
            data: await Product.findAll(),
            errors: null
        });
    } catch (err) {
        console.log(err)
    }
}

async function brands(req, res) {
    try {
        return res.status(200).json({
            state: true,
            message: "Success!",
            data: {
                brands: await Brand.findAll({
                    where: {
                        state: "ACTIVE"
                    }
                }),
                poupular_brands: '',
            },
            errors: null
        });
    } catch (err) {
        console.log(err)
    }
}

async function productCategories(req, res) {
    try {
        return res.status(200).json({
            state: true,
            message: "Success!",
            data: {
                data: await ProductCategory.findAll({
                    include: [
                        {
                            model: Employee,
                            attributes: ['id', 'username']
                        }
                    ],
                    where: {
                        state: "ACTIVE"
                    }
                })
            },
            errors: null
        });
    } catch (err) {
        console.log(err)
    }
}

async function products(req, res) {
    try {
        //options.through.where
        return res.status(200).json({
            state: true,
            message: "Success!",
            data: {
                data: await Product.findAll({
                    where: {
                        state: "ACTIVE"
                    },
                    include: [
                        {
                            model: User,
                            //as: "productLikes",
                            attributes: ['id'],
                            through: {
                                attributes: [],
                            },
                        }
                    ]
                })
            },
            errors: null
        });
    } catch (err) {
        console.log(err)
    }
}

async function productLikes(req, res) {
    ProductLike.create({
        userId: req.body.userId,
        productId: req.body.productId,
        isLike: true,
    })
        .then(async () => {
            return res.status(200).json({
                state: true,
                message: "Success!",
                data: {
                    data: await Product.findAll({
                        where: {
                            state: "ACTIVE"
                        }
                    }),
                },
                errors: null
            });
        })
        .catch((err) => {
            console.log(err)
        })
}

async function productDisLikes(req, res) {

    await ProductLike.findOne({
        where: {
            userId: req.body.userId,
            productId: req.body.productId,
        }
    })
        .then(async (result) => {
            if (result) {
                const pl = {
                    userId: req.body.userId,
                    productId: req.body.productId,
                    isLike: false,
                };
                await ProductLike.update(pl, {
                    where: {
                        userId: req.body.userId,
                        productId: req.body.productId,
                    }
                })
                    .then(() => {
                        return res.status(200).json({
                                state: true,
                                message: "Success!",
                                data: null,
                                errors: null
                            }
                        );
                    })
            }
            await ProductLike.create({
                userId: req.body.userId,
                productId: req.body.productId,
                isLike: false,
            })
                .then(() => {
                    return res.status(200).json({
                        state: true,
                        message: "Success!",
                        data: null,
                        errors: null
                    });
                });
        }).catch(err => {
            console.log(err)
        })
}

async function articleCategories(req, res) {
    try {
        return res.status(200).json({
                state: true,
                message: "Success!",
                data: {
                    data: await ArticleCategory.findAll({
                        where: {
                            state: "ACTIVE"
                        }
                    })
                },
                errors: null
            }
        );
    } catch
        (err) {
        console.log(err)
    }
}

async function articles(req, res) {
    try {
        return res.status(200).json({
            state: true,
            message: "Success!",
            data: {
                data: await Article.findAll({
                    where: {
                        state: "ACTIVE"
                    }
                })
            },
            errors: null
        });
    } catch (err) {
        console.log(err)
    }
}

function getContactUs(req, res) {
    res.render("front/home/contact-us");
}

async function postContactUs(req, res) {
    const errArr = [];
    const {first_name, last_name, username, email, captcha, message} = req.body;

    /*try {
        if (parseInt(captcha) === CAPTCHA_NUM) {
            sendEmail(
                first_name,
                last_name,
                username,
                "پیام از طرف من",
                `${message} <br> ایمیل کاربر : ${email}`);

            return res.render("front/home/contact-us", {
                pageTitle: "",
                path: "/contact-us",
                errors: errArr,
            })
        }
        res.send("no");
    } catch (err) {
        console.log(err);
    }*/
}

async function getCaptcha(req, res) {
    /*var p = new captchapng(80, 30, parseInt(Math.random() * 9000 + 1000));
    p.color(0, 0, 0, 0);
    p.color(80, 80, 80, 255);

    var img = p.getBase64();
    var imgbase64 = new Buffer(img, 'base64');
    res.writeHead(200, {
        'Content-Type': 'image/png'
    });
    res.end(imgbase64);*/
}

module.exports = HomeController;
