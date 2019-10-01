var
  MODULE = '../npm/node_modules/',
  fs = require('fs'),
  marked = require(MODULE + 'marked'),
  hl = require(MODULE + 'highlight.js'),
  HTML = require(MODULE + 'html-escaper'),
  render = new marked.Renderer(),
  indent = function (s, m) {
    return Array(m.length + 1).join('<i> </i>');
  },
  line = function (row) {
    return '<span class=\"line\">' + row.replace(/^(\s+)/, indent) + '</span>';
  },
  html
;
render.code = function (code, language) {
  return language ?
    ''.concat(
      '<pre>',
        '<code class=\"lang-', language, ' hljs ', language, '\">',
            hl.highlight(language, code.trim(), true).value.split('\n').map(line).join('\n'),
        '</code>',
      '</pre>'
    ) :
    ''.concat(
      '<pre>',
        '<code class=\"hljs\">',
          html.escape(code.trim()),
        '</code>',
      '</pre>'
    );
};
marked.setOptions({
  renderer: render,
  gfm: true,
  smartLists: true,
  smartypants: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false
});
html = marked(fs.readFileSync('README.md').toString())
  .replace(/<h1.*?>.+<\/h1>/g, '')
  .replace(/---/g, '-')
  .replace(/-benja-/g, '-b-e-n-j-a-');
fs.writeFileSync(
  'index.html',
  fs.readFileSync('index.template').toString()
    .replace('<main></main>', '<main><section>' + html + '</section></main>')
);