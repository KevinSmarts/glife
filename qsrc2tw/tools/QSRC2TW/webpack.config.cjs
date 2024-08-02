const path = require('path');

module.exports = {
  entry: './src/webshell.js',
  output: {
    path: path.resolve(__dirname, 'resources'),
    filename: 'QSPPARSER.js'
  },
};
