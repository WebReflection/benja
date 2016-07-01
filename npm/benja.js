/**
 * Copyright (c) 2016 Andrea Giammarchi
 * 
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom
 * the Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
 * OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var fs = require('fs');

function append(path) {
  // if path is not already present
  if (this.indexOf(path) < 0) {
    // and it actually exists
    try {
      fs.statSync(path);
      // add it to the list
      this.push(path);
    } catch(ignore) {}
  }
}

function stringValue(s) {
  return 0 < s.length;
}

this.paths = function paths() {
  [
    // should be the same as '/home/benja/app/node_modules'
    process.cwd() + '/node_modules',
    // to be sure it's available via process.cwd()
    '/home/benja/app/node_modules'
  ].concat(
    // eventually defined by BenjaOS
    (process.env.NODE_PATH || '').split(':').filter(stringValue)
  ).forEach(
    append,
    require('module').globalPaths
  );
};
