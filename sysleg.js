var juba = require('./juba.scrapper');
var textractor = require('./text.extractor');
var path = require('path');
var fs = require('fs');

var program = require('commander');

program
  .version('0.1.0')
  .option('-o, --output <file>', 'Especifica el directorio de salida, en el que se guardaran los documentos extraidos por el scrapper')
  .option('-d, --destacadas', 'Especifica la descarga de todas las sentencias destacadas de la juba')
  .parse(process.argv);

program.output = program.output || "./descargas"

if (!fs.existsSync(program.output)) {
  fs.mkdirSync(program.output);
}

if (program.destacadas) {
  juba.downloadAll(program.output).then(files => {
    textFilesDir = path.join(program.output, 'txt')
    if (!fs.existsSync(textFilesDir)) {
      fs.mkdirSync(textFilesDir);
    }

    textractor.fromDir(program.output, textFilesDir)
  });
}