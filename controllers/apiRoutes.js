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

/* PROMISE LIBRARY */
// Bluebird is a fully featured promise library with focus on features and performance
const Promise = require('bluebird');

/* WEB SCRAPERS */
// tool for making HTTP calls
// Integrates Bluebird' promise library with request
const request = Promise.promisifyAll(require('request'));
// scraper that implements jQuery
const cheerio = require('cheerio');

/* DATABASE TOOLS*/
// Loads ObjectId class to search by ObjectId
const ObjectId = require('mongoose').Types.ObjectId;

/******************|
|* INITIALIZATION *|
|******************/
/* SET UP FOLDER PATHS */
const mongoModelDir = path.join(__dirname, '..', 'db', 'models', 'mongoose-models');

/* TALK TO MODELS */
const Articles = require(path.join(mongoModelDir, 'Article.js'));
const Notes = require(path.join(mongoModelDir, 'Note.js'));

/*****************|
|* SET UP ROUTER *|
|*****************/
/* SET ROUTES */
router.get('/scrap', (req, res) => {
    console.log(`Starting Scraping...`)
    console.log(`Requesting "https://slashdot.org"...`)
    request
        .getAsync('https://slashdot.org/')
        .then((response) => {
            console.log(`Response code: ${response.statusCode}`)
            if (response.statusCode != 200) {
                console.log(`Exiting request: Page returned status code: ' ${response.statusCode}`);
            }
            return response.body;
        })
        .then((body) => {
            console.log(`Loading body into cheerio...`);
            var $ = cheerio.load(body);
            console.log(`Grabbing html elements with <articles class="articles">`);
            let articlesArr = [];
            console.log(`Creating articles array from html elements found`);
            $('article.article').each((i, ele) => {
                let article = {};
                article.key = $(ele).attr('id');
                article.title = $(ele).find('span[class="story-title"] > a').text();
                article.innerHTML = $(ele).find('div[class="body"] > div').html().replace(/((\n|\t))+( )?((\n|\t))+/gm, '');
                articlesArr.push(article);
            })
            return articlesArr
        })
        .then((articlesArr) => {
            console.log(`Scraping complete!`);
            res.json(articlesArr);;
        })
        .catch((error) => {
            throw new Error(error);
        });
});

router.get('/articles', (req, res) => {
    Articles
        .find({}, (error, data) => {
            res.json(data);
        });
});

router.post('/articles', (req, res) => {    
    const article = req.body;
    Articles
        .create(article, (error, data) => {
            if (error) {
                if (error.code == 11000) console.log(`ARTICLES_CREATE_ERROR: Article already exist. Not adding to DB again.`);
                else console.log(error)
            }
            res.json(data);
        });
});


router.delete('/articles/:id', (req, res) => {
    const id = req.params.id;
    Articles
        .deleteOne({ _id: new ObjectId(id) }, (error, data) => {
            if (error) console.log(error);
            res.json(data);
        });

});

router.post('/notes', (req, res) => {
    const note = req.body.note;
    Notes
        .create(note, (error, data) => {
            if (error) console.log(error);
            res.json(data);
        });

});

router.get('/notes/:id', (req, res) => {    
    const id = req.params.id;
    Notes
        .find({ _id: new ObjectId(id) }, (error, data) => {
            if (error) console.log(error);
            res.json(data);
        });
})

router.delete('/notes/:id', (req, res) => {
    const id = req.params.id;
    Notes
        .deleteOne({ _id: new ObjectId(id) }, (error, data) => {
            if (error) console.log(error);
            res.json(data);
        });
})

/***********|
|* EXPORTS *|
|***********/
// Export instance of express router
module.exports = router;