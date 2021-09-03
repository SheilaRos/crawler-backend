const dbConnection = require('../config/dbConnection');
const Crawler = require('js-crawler');
const express = require('express');
const router = express.Router();

//all urls
router.get('/all', (req, res) => {

   dbConnection.query('select * from web', (err, rows, fields) =>{
        if(!err){
            res.json(rows);
        }else{
            console.log('Error');
            res.status(500).send(err);
            return;
        }
    });

});


router.post('/run-crawler', async(req, res) =>{
    const {url, depths} = req.query;
     new Crawler().configure({depth: depths})
    .crawl(url, function onSuccess(page) {
        var urlNew = page.url;
        var headers = page.response.headers;
        manageNewUrl(urlNew, headers);
    }, function onFailure(){
        console.log('Error');
    }, function onAllFinished(result){
        res.json(result);
    });

   // res.json('"http://www.google.com/","http://www.google.es/imghp?hl=es&tab=wi","https://accounts.google.com/ServiceLogin?hl=es&passive=true&continue=http://www.google.com/&ec=GAZAAQ","https://www.google.com/preferences?hl=es","https://www.youtube.com/?gl=ES&tab=w1","https://accounts.google.com/ServiceLogin?service=wise&passive=1209600&continue=https://drive.google.com/?tab%3Dwo&followup=https://drive.google.com/?tab%3Dwo&emr=1","https://accounts.google.com/ServiceLogin?service=mail&passive=true&rm=false&continue=https://mail.google.com/mail/?tab%3Dwm&scc=1&ltmpl=default&ltmplcache=2&emr=1&osid=1#","https://about.google/intl/es/products/?tab=wh","https://support.google.com/news/publisher-center/answer/9609687?hl=es","https://play.google.com/store?hl=es&tab=w8","https://www.google.com/advanced_search?hl=es&amp;authuser=0","https://ads.google.com/intl/es/home/","https://www.google.es/intl/es/services/","https://www.google.com/preferences?hl=es","https://www.google.com/preferences?hl=es","http://www.google.com/intl/es/policies/privacy/","http://www.google.com/","http://www.google.com/intl/es/policies/terms/","https://about.google/intl/es/","https://www.google.com/preferences?hl=es","https://www.google.es/history/optout?hl=es&ucbcb=1&nzb=1","https://www.google.es/maps?hl=es&tab=wl&ucbcb=1"');
});

function manageNewUrl(urlNew, headers){
    var sql = "select * from web where url = ?";
    dbConnection.query(sql, [urlNew], (err, rows, fields) =>{
        if(!err){
            if(!Object.keys(rows).length){
                insertNewUrl(urlNew, headers);
            }else{
                updateUrl(urlNew, headers);
            }
        }
    });
}

function insertNewUrl(urlNew, headers){
    
    var sql = "Insert into web (url, header_date, header_expires, header_server, header_connection, header_vary) values (?, ?, ?, ?, ?, ?)";
    
    dbConnection.query(sql, [urlNew, headers.date, headers.expires, headers.server, headers.connection, headers.vary], (err, rows, fields) =>{
        if(err) throw err;
    });       
    
    var mssg ="Se ha encontrado una nueva url "+urlNew;
    console.log(mssg);
}

function updateUrl(urlNew, headers){
    var sql = "update  web set header_date = ?, header_expires = ?, header_server = ?, header_connection = ?, header_vary = ? where url = ? and (header_date <> ? or header_expires <> ? or header_server <> ? or header_connection <> ? or header_vary <> ?)";
   
    dbConnection.query(sql, [headers.date, headers.expires, headers.server, headers.connection, headers.vary, urlNew, headers.date, headers.expires, headers.server, headers.connection, headers.vary], (err, rows, fields) =>{
          if(err) throw err;
          if(rows.affectedRows){

            var mssg ="Se han actualizado los headers de la url "+urlNew;
            console.log(mssg);

          }
     });
}


module.exports = router;