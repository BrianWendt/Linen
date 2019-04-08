const mergeFiles = require('merge-files');
// node-minify repo https://github.com/srod/node-minify
// node-minify documentaion https://node-minify.2clics.net/
const minify = require('@node-minify/core');
const uglifyES = require('@node-minify/uglify-es');

const input = [
        './src/Linen.js',
        './src/Model.js',
        './src/Rectangle.js',
        './src/Arc.js',
        './src/Image.js',
        './src/Line.js',
        './src/Text.js'
    ];

console.log('** Merge files into Linen.js **');
mergeFiles(input, './linen.js').then(function(){});

console.log('** Minify files into linen.min.js **');
minify({
    compressor: uglifyES,
    input: input,
    output: './linen.min.js',
    options: {
        warnings: true
    },
    callback: function (err, min) {
        if (err === null) {
            console.log('minify had no errors');
        } else {
            console.log('minify Error: ', err);
        }
    }
});