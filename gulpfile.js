'use strict';

const { series, parallel, src, dest, watch } = require('gulp');
const less = require('gulp-less');
const postcss = require('gulp-postcss');
const mqpacker = require('css-mqpacker');
const sourcemaps = require('gulp-sourcemaps');
const notify = require('gulp-notify');
const browserSync = require('browser-sync').create();

// Path
const path = {
    www: {
        style: 'www/css/',
        html : 'www/*.html'
    },
    src: {
        style: 'src/css/*.less'
    },
    watch: {
        srcStyle   : 'src/css/**/*.less',
        buildStyle : 'www/css/*.css',
        html       : 'www/*.html'
    }
}

// Compilation less
function styles() {
    return src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(less()
            .on('error', notify.onError({
                message: '<%= error.fileName %>' +
                '\nLine <%= error.lineNumber %>:' +
                '\n<%= error.message %>',
                title  : '<%= error.plugin %>'
            }))
        )
        .pipe(postcss([
            mqpacker({
                sort: false
            })
        ]))
        .pipe(sourcemaps.write())
        .pipe(dest(path.www.style));
}
exports.styles = styles;

function serve() {
    browserSync.init({
        server: "./www"
    });

    watch([
        path.watch.srcStyle
    ], styles);

    watch([
        path.watch.html,
        path.watch.buildStyle
    ]).on('change', browserSync.reload);
}

exports.default = series(
  parallel(styles),
  serve
);