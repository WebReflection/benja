var
  fs = require('fs'),
  globalPaths = require('module').globalPaths
;

// fix Electron paths once loaded in B.E.N.J.A.
[
  // should be the same as '/home/benja/app/node_modules'
  process.cwd() + '/node_modules',

  // should be defined by Benja OS
  process.env.NODE_PATH,

  // to be sure it's available
  '/home/benja/app/node_modules'

].join(':').split(':').forEach(function (path) {
  // if path is defined and not already considered
  if (path && globalPaths.indexOf(path) < 0) {
    // verify it exists
    try {
      fs.statSync(path);
      // and add it to the list
      globalPaths.push(path);
    } catch(ignore) {}
  }
});
