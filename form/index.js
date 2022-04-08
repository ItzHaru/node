const express = require('express');
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const app = express();
const csv = require('csvtojson');
const urlencodedParser = bodyParser.urlencoded({extended: false});
const port = 5000;


app.use(express.static('public'));
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

/* Spuštění webového serveru */

app.post('/savedata', urlencodedParser, (req, res) => {
    let str = `${req.body.bias},${req.body.song},${req.body.album},${req.body.year}\n`;
    fs.appendFile('./data/answers.csv', str, function(err) {
        if (err) {
            console.error(err);
            return res.status(400).json({
               success: false,
               message: 'An error was encountered while writing to the file' 
            });
        }
    });
    res.redirect(301, '/savedata');
});

app.get('/savedata', (req, res) => {  
    csv().fromFile(path.join(__dirname,'./data/answers.csv')).then(data => { 
   res.render('answers.pug', {'form':data,'title': 'ARMY stats '});
    })
     .catch(err => {
    console.log(err);
    });
    });

app.listen(port, () => { 
    console.log('Server naslouchá na portu 5000');
    });