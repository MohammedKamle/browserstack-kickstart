const { fork, spawn } = require('child_process')
const CONFIG = require('./config.json')
const DEVICES = CONFIG.devices;
const events = require('events');
const fs = require('fs');
const util = require('util');
const path = require('path');

const NUM_PARALLELS = CONFIG['num_parallels'];
const EVENT_EMITTER = new events.EventEmitter();
let SPEC_FILES = [];
let SPEC_IDX = 0;
//joining path of directory
const DIR_PATH = path.join(__dirname, CONFIG.specsDir);
const username = CONFIG.user || process.env.BROWSERSTACK_USER;
const accessKey = CONFIG.accessKey || process.env.BROWSERSTACK_ACCESSKEY;
const remoteHubUrl = `https://${username}:${accessKey}@hub-cloud.browserstack.com/wd/hub`;

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

const spawnJasmineRunner = function() {
// const spawnJasmineRunner = function(numInstances) {
  // for (let n = 0; n < numInstances; n++) {
    let countOfRunning = DEVICES.length;
  for (let idx = 0; idx < DEVICES.length; idx++) {
    const device = DEVICES[idx];
    let spec_file = path.join(DIR_PATH, SPEC_FILES[SPEC_IDX]);
    // let child_process = fork('./jasmine-runner.js', [spec_file]);
    let child_process = spawn('npx',['jasmine',spec_file], {
      env: {
        ...process.env,
        OS_VERSION: device.os_version, 
        BROWSERNAME: device.browserName, 
        BROWSER_VERSON: device.browser_version, 
        OS: device.os, 
        REAL_MOBILE: device.real_mobile, 
        BUILD: "BUILD with Caps"+JSON.stringify(device)
      },
      stdio: "inherit"
    });
    console.log("!!!",child_process.pid, child_process.spawnargs);
    child_process.once("exit", function() {
      countOfRunning--;
      console.log("##",countOfRunning)
      if(countOfRunning <= 0){
        EVENT_EMITTER.emit('specCompleted');
      }
    })
    // child_process.once("close",function(){
    //   console.log("called on close");
    //   countOfRunning--;
    //   console.log("##",countOfRunning)
    //   if(countOfRunning <= 0){
    //     EVENT_EMITTER.emit('specCompleted');
    //   }
    // })
  }
    SPEC_IDX++;
    // child_process.on('close', function () {
    //   EVENT_EMITTER.emit('specCompleted', [SPEC_IDX, 1]);
    // });
  // }
}

function main() {
  SPEC_FILES = findAllSpecs(DIR_PATH);
  console.log("Total Spec files to run :: " + SPEC_FILES.length);
  console.log("Spec files to run :: " + SPEC_FILES);

  EVENT_EMITTER.on('specCompleted', () => {
    if(SPEC_IDX >= SPEC_FILES.length) {
      EVENT_EMITTER.removeAllListeners();
      return;
    }
    spawnJasmineRunner();
  });
  while ((SPEC_IDX < SPEC_FILES.length) && SPEC_IDX < NUM_PARALLELS) {
    console.log("@@",SPEC_IDX, NUM_PARALLELS);
    spawnJasmineRunner();
  }
   while(SPEC_IDX < SPEC_FILES.length){} // wait for all specs to complete
}

main()
  console.log("Completed Running : " + SPEC_FILES.length + " SPEC FILES ");
  process.exit(0);
