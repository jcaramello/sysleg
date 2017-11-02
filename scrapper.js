var config = require('./config');
var osmosis = require('osmosis');
var http = require('http');
var fs = require('fs');
var url = require('url');


function downloadPage(pageNumer) {

        osmosis
                .get(config.page + pageNumer)
                .find('a[href*="../includes/descarga.asp"]')
                .set({
                        'url': '@href'
                })
                .data(item => {

                        var params = url.parse(item.url, true).query;
                        var name = params.n.replace("Ver", "").trim();
                        var file = fs.createWriteStream(config.outputDir + '/' + name);
                        var path = item.url.replace("..", "");
                        http.get(config.server + path, r => r.pipe(file));
                })
                .log(console.log)
                .error(console.log)
                .debug(console.log);

}


for (var pageNumber = 1; pageNumber <= 31; pageNumber++) {
        downloadPage(pageNumber);
}