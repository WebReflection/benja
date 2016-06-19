var
  fs = require('fs'),
  globalPaths = require('module').globalPaths
;

// fix Electron paths once loaded in B.E.N.J.A.
(function verify(PATH) {
  // if PATH is defined and is not already considered
  if (PATH && globalPaths.indexOf(PATH) < 0) {
    // try to see if it exists
    try {
      fs.statSync(PATH);
      // and in such case add it to the list
      globalPaths.push(PATH);
    } catch(ignore) {}
  }
  // returns this IIEF for chained invokes
  return verify;
}(
  // should be the same as '/home/benja/app/node_modules'
  process.cwd() + '/node_modules'
)(
  // should be defined by Benja OS
  process.env.NODE_PATH
)(
  // to be sure it's available
  '/home/benja/app/node_modules'
));
