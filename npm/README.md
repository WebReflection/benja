# Benja OS Helper
Used mostly to fix a well-known Electron limitation with `NODE_PATH` env variable,
this module is needed to fix firther `require(module)` down your app.

It can be used in both backend and frontend files.
Install it locally via `npm install benja` and after that:

```js
// on top of index.js or index.html
// to have access to both local and global modules
require(process.cwd() + '/node_modules/benja').paths();
```

Visit [Benja OS](https://benja.io/) site to know more.