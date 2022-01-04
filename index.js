const express = require('express');
const dotenv = require('dotenv');
const  cors = require('cors');
const oneShortScrapper = require('./OneShortScrapper/oneShortScrapper');
const categories = require('./utils/categories');

const app = express();
app.use(express.json())
dotenv.config();
app.use(cors());

let newsArray = [];
app.get('/api/:lang/news/', async(req, res) => {
    console.log('waiting');
    try {
        if(req.params.lang==='en' || req.params.lang==='hi') {
            await oneShortScrapper(req.params.lang,'').then(resArray => {
                newsArray=resArray;
            }).catch(err => {
                console.log(err);
            })
        }
    } catch(error) {
        console.log(error);
    }
    if(newsArray.length)
        res.json({status: 'success', newsArray});
    else
        res.json({status: 'error', newsArray});
})

app.get('/api/:lang/news/:category/', async(req, res) => {
    console.log('waiting');
    try {
        if((req.params.lang==='en' || req.params.lang=='hi') && categories.indexOf(req.params.category)!==-1) {
            await oneShortScrapper(req.params.lang, req.params.category).then(resArray => {
            newsArray=resArray;
            }).catch(err => {
                console.log(err);
            })
        }
    } catch(error) {
        console.log(error);
    }
      
    if(newsArray.length)
        res.json({status: 'success', newsArray});
    else
        res.json({status: 'error', newsArray});
})


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
})