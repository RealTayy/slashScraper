/***************|
|* DEPENDECIES *| 
|***************/
/* GENERAL */
// Utilities for working with file and directory paths
const path = require('path');

/* WEB FRAMEWORKS */
// lightweight web framework for node server
const express = require('express');
// create instance of express router
const router = express.Router();

/* VIEW ENGINE */
// Handlebars view engine for express
var exphbs = require('express-handlebars');

/******************|
|* INITIALIZATION *| 
|******************/
/* SET UP FOLDER PATHS */
const mongoModelDir = path.join(__dirname, '..', 'db', 'models', 'mongoose-models');

/* TALK TO MODELS */
const articles = require(path.join(mongoModelDir, 'Article.js'));
const notes = require(path.join(mongoModelDir, 'Note.js'));

/*****************|
|* SET UP ROUTER *| 
|*****************/
/* SET ROUTES */
router.get('/', (req, res) => {
    res.render('./main/index.hbs', { text: 'Hello Tay!' });
});

/***********|
|* EXPORTS *| 
|***********/
// Export instance of express router
module.exports = router;