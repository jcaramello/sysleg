var osmosis = require('osmosis');
var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');

var server = 'http://www.scba.gov.ar';
var sentencias_destacadas = 'http://www.scba.gov.ar/jurisprudencia/NovedadesSCBA.asp?expre=&date1=&date2=&id=1&cat=0&pg=';

/**
 * Download a page
 */
function downloadPage(pageNumer, outputDir) {

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    return new Promise((resolve, reject) => {
        var files = [];
        osmosis.get(sentencias_destacadas + pageNumer)
            .find('a[href*="../includes/descarga.asp"]')
            .set({
                'url': '@href'
            })
            .data(item => {

                var params = url.parse(item.url, true).query;
                var name = params.n.replace("Ver", "").trim();
                var fname = path.join(outputDir, name);

                var file = fs.createWriteStream(fname);
                item.url = item.url.replace("..", "");
                http.get(server + item.url, r => {
                    var stream = r.pipe(file)
                    stream.on('finish', () => file.close())
                    files.push(fname)
                });
            })
            .done(() => resolve(files))
            .log(console.log)
            .error(console.log)
            .debug(console.log);
    });

}


/**
 * Download all files
 */
function downloadAll(outputDir) {
    var request = []
    var files = [];

    for (var pageNumber = 1; pageNumber <= 31; pageNumber++) {
        var req = downloadPage(pageNumber, outputDir).then(f => files.concat(f));
        request.push(req);
    }

    return Promise.all(request).then(() => files);
}


module.exports = {
    downloadAll: downloadAll,
    downloadPage: downloadPage
}