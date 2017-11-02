var config = require('./config');
var fs = require('fs');
var path = require('path');
var extract = require('pdf-text-extract')


fs.readdir(config.outputDir, (err, files) => {

    if (err) {
        console.error("Could not list the directory.", err);
        //process.exit(1);
    }


    files.forEach(file => {

        var filePath = path.join(__dirname, 'test/data/multipage.pdf')
        extract(filePath, {
            splitPages: false
        }, (err, pages) => {
            if (err) {
                console.dir(err)
                return
            }
            console.dir(pages)
        })

    });   

});