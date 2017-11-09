var osmosis = require('osmosis');

var server = 'http://www.scba.gov.ar';
var sentencias_destacadas = 'http://www.scba.gov.ar/jurisprudencia/NovedadesSCBA.asp?expre=&date1=&date2=&id=1&cat=0&pg=';

/**
 * Download a page
 */
function extractFromPage(pageNumer, outputDir) {
    var files = [];   
    return new Promise((resolve, reject) => {

        osmosis
            .get(sentencias_destacadas + pageNumer)
            .find('a[href*="../includes/descarga.asp"]')
            .set({
                'url': '@href'
            })
            .then((ctx, item, n) => {
                var url = server + item.url.replace("..", "");
                files.push(url);
                n(ctx, item);
            })
            .done((ctx, data) => {
                resolve(files)
            })
            .error(console.log)
        // .log(console.log)
        // .debug(console.log)

    });

}

/**
 * Download all files
 */
function extractUrls(outputDir) {
    var promises = []
    var files = [];    

    for (var pageNumber = 1; pageNumber <= 31; pageNumber++) {
        var p = extractFromPage(pageNumber, outputDir).then(r => files = files.concat(r))
        promises.push(p);
    }

    return Promise.all(promises).then(() => files);
}



module.exports = {
    extractUrls: extractUrls,
    extractFromPage: extractFromPage
}