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

/* WEB SCRAPERS */
// tool for making HTTP calls
const request = require('request');
// scraper that implements jQuery
const cheerio = require('cheerio');

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
    request(
        'https://slashdot.org/',
        function (error, response, html) {
            if (error) throw new Error(error);
            if (response.statusCode != 200) console.log(`Exiting request: Page returned status code: ' ${response.statusCode}`);

            var $ = cheerio.load(html);

            let articlesArr = [];

            $('article.article').each((i, ele) => {
                let article = {};
                article.key = $(ele).attr('id');
                article.title = $(ele).find('span[class="story-title"] > a').text();
                article.innerHTML = $(ele).find('div[class="body"] > div').html().replace(/((\n|\t))+( )?((\n|\t))+/gm, '');
                Articles.create(article, (error, data) => {
                    if (error) {
                        if (error.code == 11000) console.log(`Article ID:${article.key} already in database.`);
                        else console.log(error);
                    }
                    else {
                        articlesArr.push(data);
                    }
                });
            });
            res.json(articlesArr);
        }

    )
});

router.post('/articles', (req, res) => {
});

router.delete('/article/:id', (req, res) => {
});

router.put('/notes/:id', (req, res) => {
});

/***********|
|* EXPORTS *| 
|***********/
// Export instance of express router
module.exports = router;