const express = require('express');
const router = express.Router();
const HomeController = require('../../app/Controllers/Front/HomeController');

router.get('/', HomeController.index);
router.get('/brands', HomeController.brands);
router.get('/product-categories', HomeController.productCategories);
router.get('/products', HomeController.products);
router.post('/product-likes', HomeController.productLikes);
router.post('/product-dislikes', HomeController.productDisLikes);
router.get('/article-categories', HomeController.articleCategories);
router.get('/articles', HomeController.articles);
router.get('/contact-us', HomeController.getContactUs);
router.post('/contact-us', HomeController.postContactUs);
router.get('/captcha.png', HomeController.getCaptcha);

module.exports = router;
