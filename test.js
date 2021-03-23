const CONFIG = require('./config.json')
const path = require('path');
const fs = require('fs');
const DIR_PATH = path.join(__dirname, CONFIG.specsDir);

function findAllSpecs(specDir) {
    console.log("Finding Specs in Directory :: " + specDir);
    // const readdir = util.promisify(fs.readdir);
    let specFiles;
  
    try {
      specFiles = fs.readdirSync(specDir);
    } catch (e) {
      console.log("Error while reading specs from dir :: " + specDir);
    }
    if (specFiles === undefined) {
      specFiles = [];
    }
    return specFiles;
  }
  console.log(findAllSpecs(DIR_PATH))