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
let request = require('request');
// scraper that implements jQuery
let cheerio = require('cheerio');
// Integrates Bluebird' promise library with request and cheerio
request = Promise.promisifyAll(request);
// cheerio = Promise.promisifyAll(cheerio);

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
    request.getAsync('https://slashdot.org/')
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
        .each((article) => {
            console.log(`Pushing ${article.key} into DB`);
            Articles.create(article, (error, data) => {
                if (error) {
                    if (error.code == 11000) console.log(`Article ID:${data.key} already in database.`);
                    else console.log(error);
                }
                else {
                    console.log(`Article ID:${data.key} pushed in successfully!`);
                }
            });
            return;
        })
        .then((blah) => {
            console.log(`Scraping complete!`);
            res.json(blah);;            
        })
        .catch((error) => {
            throw new Error(error);
        })
});

router.post('/articles', (req, res) => {
});

router.delete('/article/:id', (req, res) => {
});

router.put('/notes/:id', (req, res) => {
});

/********************|
|* HELPER FUNCTIONS *|
|********************/

/***********|
|* EXPORTS *|
|***********/
// Export instance of express router
module.exports = router;