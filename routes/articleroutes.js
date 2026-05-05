'use strict'

var express = require('express');
var ArticleController = require('../controller/articlecontroller');

var router = express.Router();

//Rutas de prueba

router.post('/createArticle', ArticleController.createArticle);
router.get('/articles', ArticleController.getArticles);
router.get('/article/:id', ArticleController.getArticle);
router.put('/article/:id', ArticleController.updateArticle);
router.delete('/article/:id', ArticleController.deleteArticle);
router.post('/upload-image/:id', ArticleController.uploadImage);

//rutas utiles
module.exports = router; 