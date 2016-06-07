var globalPaths = require('module').globalPaths;

// TODO: make this module more complex than this ...
//       ... you know, people including it on the wild
var target = '/home/benja/app/node_modules';
if (globalPaths.indexOf(target) < 0) {
  try {
    if (fs.statSync(target)) {
      globalPaths.unshift(target);
    }
  } catch(meh) {
    // not a B.E.N.J.A. ¯\_(ツ)_/¯
  }
}

this.require = global.require;