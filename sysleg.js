var juba = require('./juba.scrapper');
var textractor = require('./text.extractor');
var path = require('path');
var fs = require('fs');
var program = require('commander');
var request = require('request');
var url = require('url');

program
  .version('0.1.0')
  .option('-o, --output <file>', 'Especifica el directorio de salida, en el que se guardaran los documentos extraidos por el scrapper')
  .option('-d, --download', 'Especifica la descarga de todas las sentencias destacadas de la juba')
  .option('-e, --extract', 'Especifica la extraccion de todas las sentencias destacadas de la juba')
  .option('-a, --all', 'Especifica la extraccion de todas las sentencias destacadas de la juba')
  .parse(process.argv);

/**
 * Main program
 * 
 */
function main() {

  program.output = program.output || "../descargas"
  program.all = program.all || !(program.download || program.extract)

  if (!fs.existsSync(program.output)) {
    fs.mkdirSync(program.output);
  }

  if (program.all || program.download) {

    juba.extractUrls(program.output)
      .then(files => downloadFiles(program.output, files))
      .then(() => extract(program.output));

  } else {
    extract(program.output);
  }

}


/**
 * Extract all the download files
 * 
 * @param {any} output 
 */
function extract(output) {

  textFilesDir = path.join(output, 'txt');

  if (!fs.existsSync(textFilesDir)) {
    fs.mkdirSync(textFilesDir);
  }

  textractor.fromDir(output, textFilesDir);
}


/**
 * Download a list of files
 * 
 * @param {any} files 
 * @returns 
 */
function downloadFiles(outputDir, files) {
  var promises = [];  
  var idGenerator = 1;
  console.log(files)

  files.forEach(f => {
    var promise = new Promise((res, rej) => {
      downloadFile(outputDir, f, idGenerator++).then(() => res());
    });

    promises.push(promise);
  })

  return Promise.all(promises);
}

/**
 * Download a file from JUBA
 * 
 * @param {any} file 
 */
function downloadFile(outputDir, docUrl, id) {
  var params = url.parse(docUrl, true).query;
  var oName = params.n.replace("Ver", "").trim().split(".");
  var fileExt = oName[oName.length - 1];
  var name = "text-" + id + "." + fileExt;
  var fname = path.join(outputDir, name);
  console.log("Downloading file >> " + oName.join(".") + " ...");

  return new Promise((resolve, reject) => {
    var stream = fs.createWriteStream(fname)
    request(docUrl)
      .on('end', () => {
        resolve();
        stream.close();
      })
      .on('error', console.log)
      .pipe(stream)
  })


}


main();