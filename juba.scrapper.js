var config = require('./config');
var osmosis = require('osmosis');
var http = require('http');
var fs = require('fs');
var url = require('url');

var server = 'http://www.scba.gov.ar';
var sentencias_destacadas = 'http://www.scba.gov.ar/jurisprudencia/NovedadesSCBA.asp?expre=&date1=&date2=&id=1&cat=0&pg=';
var JUBA_HOME = config.outputDir + '/juba/sentencias destacadas/';

/**
 * Download a page
 */
function downloadPage(pageNumer) {

    osmosis.get(sentencias_destacadas + pageNumer)
        .find('a[href*="../includes/descarga.asp"]')
        .set({
            'url': '@href'
        })
        .data(item => {

            var params = url.parse(item.url, true).query;
            var name = params.n.replace("Ver", "").trim();

            if (!fs.existsSync(JUBA_HOME)) {
                fs.mkdirSync(config.outputDir + '/juba');
                fs.mkdirSync(config.outputDir + '/juba/sentencias destacadas');
            }

            var file = fs.createWriteStream(JUBA_HOME + name);
            var path = item.url.replace("..", "");
            http.get(server + path, r => r.pipe(file));
        })
        .log(console.log)
        .error(console.log)
        .debug(console.log);

}


/**
 * Download all files
 */
function downloadAll() {

    for (var pageNumber = 1; pageNumber <= 31; pageNumber++) {
        downloadPage(pageNumber);
    }
}


module.exports = {
    downloadAll: downloadAll,
    downloadPage: downloadPage,
    JUBA_HOME: JUBA_HOME
}