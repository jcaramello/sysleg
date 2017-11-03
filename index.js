var config = require('./config');
var juba = require('./juba.scrapper');
var textractor = require('./text.extractor');
var path = require('path');

//juba.downloadAll();

textractor.fromDir(juba.JUBA_HOME, path.join(config.outputDir, 'juba-txt'))
