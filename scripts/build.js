const mergeFiles = require('merge-files');
const minify = require('@node-minify/core');
const uglifyES = require('@node-minify/uglify-es');
const fs = require('fs');

const input = [
        './src/Linen.js',
        './src/Model.js',
        './src/Rectangle.js',
        './src/Arc.js',
        './src/Image.js',
        './src/Line.js',
        './src/Text.js',
        './src/Canvas.js',
        './src/Path.js'
    ];

console.log('** Merge files into Linen.js **');
mergeFiles(input, './linen.js').then(function(){
    
});

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
            fs.copyFileSync('./linen.min.js', './docs/linen.min.js');
        } else {
            console.log('minify Error: ', err);
        }
    }
});