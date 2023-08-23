require('dotenv').config();

//WebsiteStuff
const express = require('express');
const fs = require('fs');
const util = require('util')
const path = require('path');
const app = express();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

//Setup
function getLanguages() {
    let lang = [];

    fs.readdir('views/partials/languages/pages', function(err, folders) {
        folders = folders.filter(folder => path.extname(folder) === '');
    
        for(let i = 0; i < folders.length; i++) {
            util.promisify(fs.readdir)(`views/partials/languages/pages/${folders[i]}`).then(pages => {
                pages = pages.filter(page => path.extname(page) === '.ejs');
                lang[folders[i]] = pages;
            }).catch(err => {
                console.log(err)
            });
        }
    });

    return lang;
}

let lang = getLanguages();

// Middleware Routes
app.get('/', (req,res) => {
    res.render('index', { languages: lang, page: `core/home.ejs` });
});

app.get('/tutorial', (req,res) => {
    if(req.query.language != null && req.query.page !=null) {
        res.render('index', { languages: lang, page: `partials/languages/pages/${req.query.language}/${req.query.page}` });
    } else {
        res.redirect('/');
    }
});

app.get('*', function(req, res) {
    res.render('errorpage');
});

//Listeners for website
app.listen(process.env.PORT || 5000);