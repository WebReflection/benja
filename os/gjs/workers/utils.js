// listen to any message such
// {name: 'ipv4'} or
// {name: 'utility', arguments: [1, 2, 3]}
// postMessage the result as soon as it's available
onmessage = (e) => {
  const name = e.data ? (e.data.name || '') : '';
  if (utils.hasOwnProperty(name)) {
    // even if synchronous, use Promises
    // so no matter if the utility is sync or async
    // since the onmessage => postMessage operation
    // is always asynchronous anyway
    Promise.resolve(
      utils[name].apply(null, e.data.arguments || [])
    ).then(postMessage);
  } else {
    postMessage('Unknown utility: ' + name);
  }
};

const broadcast = require('broadcast');
const five = require('johnny-five');
const Raspi = require('raspi-io');
let board;

// exposed utilities (just one for demo purpose)
const utils = {
  five() {
    if (!board) {
      board = new five.Board({
        io: new Raspi()
      });
      board.on('ready', () => {
        broadcast.that('five-is-ready', {
          type: 'five',
          result: 'Ready to Rock!'
        });
      });      
    }
    return broadcast.when('five-is-ready');
  },
  ipv4() {
    const ni = require('os').networkInterfaces();
    const result = Object.keys(ni).reduce((out, key) => {
      return ni[key].reduce((out, iface) => {
        if (
          iface.family === 'IPv4' &&
          iface.address !== '127.0.0.1'
        ) {
          out.push(iface.address);
        }
        return out;
      }, out);
    }, []);
    return {type: 'ipv4', result: result};
  }
};
