var globalPaths = require('module').globalPaths;

// TODO: make this module more complex than this ...
//       ... you know, people including it on the wild
var target = '/home/benja/app/node_modules';
if (globalPaths.indexOf(target) < 0) {
  try {
    fs.statSync(target);
  } catch(e) {
    globalPaths.unshift(target);
  }
}

this.require = require;