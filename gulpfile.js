const gulp = require('gulp'),
      sass = require('gulp-sass'),
      browserSync = require('browser-sync').create(),
      cleanCSS = require('gulp-clean-css'),
      autoprefixer = require('gulp-autoprefixer'),
      concat = require('gulp-concat'),
      changed = require('gulp-changed'),
      imagemin = require('gulp-imagemin'),
      lineec = require('gulp-line-ending-corrector'),
      uglify = require('gulp-uglify');

// compile scss into css
function style() {
    // 1. where is my scss file
    return gulp.src('./scss/**/*.scss')
    // 2. pass that file through sass compiler
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    // 3. where do I save the compiled css
    .pipe(gulp.dest('./dist/css'))
    // 4. stream changes to all browsers
    .pipe(browserSync.stream());
}

// concat and minify css files
function concatCSS() {
    // 1. where are my files
    return gulp.src('./dist/css/**/*.css')
    // 2. pass those file through concatination
    .pipe(concat('all.min.css'))
    // 3. pass those files through minication
    .pipe(cleanCSS())
    // 4. pass those files through line ending corrector
    .pipe(lineec())
    // 5. where do I save those files
    .pipe(gulp.dest('./dist/css'));
}


//minify js files and concat
// function javaScript() {
//     // 1. where is my js files
//     return gulp.src('./dist/js/**/*.js')
//     // 2. pass those file through concatination
//     .pipe(concat('all.min.js'))
//     // 3. pass those files through minication
//     .pipe(uglify())
//     // 4. pass those files through line ending corrector
//     .pipe(lineec())
//     // 5. where do I save those files
//     .pipe(gulp.dest('./dist/js'));
// }

// optimaize images
function imgMin() {
    return gulp.src('./images/*')
    .pipe(changed('./dist/images'))
    .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.jpegtran({progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
            ]
        })
    ]))
    .pipe(gulp.dest('./dist/images'));
}

//watch for changes in scss and html and js
function watch() {
    browserSync.init({
        server: {
            baseDir: './dist/'
        }
    });

    gulp.watch('./scss/**/*.scss', style);
    gulp.watch('./images/**/*', imgMin);
    gulp.watch('./dist/*.html').on('change', browserSync.reload);
    gulp.watch('./js/**/*.js').on('change', browserSync.reload);
}

exports.style = style;
exports.concatCSS = concatCSS;
// exports.javaScript = javaScript;
exports.imgMin = imgMin;
exports.watch = watch;
