var config = require('./config');
var fs = require('fs');
var path = require('path');
var textract = require('textract');  

/**
 * Extract content from all files in the given directory
 */
function fromDir(sourceDir, outputDir, types) {

    if (!sourceDir) return;

    types = types || ['pdf'];

    fs.readdir(sourceDir, (err, files) => {

        if (err) {
            console.error("Could not list the diarectory.", err);
            return
        }

        files = files.map(f => {
            var data = path.parse(f);
            data.dir = sourceDir;
            data.path = path.join(sourceDir, f);
            data.output = outputDir || data.dir;
            return data;
        }).filter(f => types.indexOf(f.ext.replace('.', '')) > -1);

        // we need to extrac one by one, to avoid freeze the thread and the whole machine
        extractSync(files, 0);
    });
}

/**
 * Extract Sync
 * @param {*} files 
 * @param {*} index 
 */
function extractSync(files, index) {

    if (files.length == index + 1) return;

    var file = files[index];
    console.log('extracting file >> ' + file.path)

    textract.fromFileWithPath(file.path, (err, text) => {
        if (err) {
            console.dir(err)
            return
        }

        console.log(text);
        // var stream = fs.createWriteStream(path.join(file.output, file.name + '.txt'));
        // stream.once('open', function (fd) {
        //     stream.write(text);            
        //     stream.end();
        // });

        // extractSync(files, index++);
    });


}


module.exports = {
    fromDir: fromDir
}