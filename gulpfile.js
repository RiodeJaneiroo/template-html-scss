const   gulp            = require('gulp'),
        concat          = require('gulp-concat'),
        autoprefixer    = require('gulp-autoprefixer'),
        prettify 	    = require('gulp-html-beautify'),
        bourbon 	    = require('bourbon').includePaths,
        sass            = require('gulp-sass'),
        browserSync     = require('browser-sync').create(),
        gulpIf		    = require('gulp-if'),
        uglify          = require('gulp-uglify'),
        pug 		    = require('gulp-pug'),
        svgSprite       = require('gulp-svg-sprite'),
        svgmin          = require('gulp-svgmin'),
        fs              = require('fs-extra'),
        sourcemaps 	    = require('gulp-sourcemaps'),
        gcmq            = require('gulp-group-css-media-queries');
        cleanCSS        = require('gulp-clean-css');


var isDev = true; // if false then remove soursemap in css

var  cssFiles = [
    './node_modules/normalize.css/normalize.css',
    './node_modules/magnific-popup/dist/magnific-popup.css',
    './node_modules/slick-carousel/slick/slick.css',
    './app/libs/pushy/pushy.css',
];
var  jsFiles = [
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/magnific-popup/dist/jquery.magnific-popup.min.js',
    './node_modules/svgxuse/svgxuse.js',
    './node_modules/slick-carousel/slick/slick.min.js',
    './app/libs/jquery.maskedinput.min.js',
    './app/libs/pushy/pushy.min.js',
    './app/libs/lazysizes.min.js',
];


function styles(){
    return  gulp.src('./app/scss/style.scss')
            .pipe(gulpIf(isDev, sourcemaps.init({largeFile: true})))
            .pipe(concat('style.min.css'))            
            .pipe(sass({includePaths: bourbon}).on('error', sass.logError))
            .pipe(autoprefixer({
                browsers: ['> 0.1%'],
                cascade: false
            }))
            .pipe(cleanCSS({level: 2}))
            .pipe(gcmq())
            .pipe(gulpIf(isDev, sourcemaps.write('maps')))
            .pipe(gulp.dest('./app/css/'))
            .pipe(browserSync.stream());
}

function concatCss() {
    return gulp.src(cssFiles)
            .pipe(concat('libs.min.css'))
            .pipe(cleanCSS({level: 2}))
            .pipe(gulp.dest('./app/css/'));
}
function concatJs() {
    return gulp.src(jsFiles)
            .pipe(concat('libs.min.js'))
            .pipe(gulp.dest('./app/js/'));
}

function svgSpriteBuild() {
    return gulp.src('./app/img/icon/*.svg')
    // minify svg
        .pipe(svgmin())
        // build svg sprite
        .pipe(svgSprite({
            mode: {
                symbol: {
                    sprite: "../sprite.svg",
                    render: {
                        scss: {
                            dest:'../../../scss/sprite/_sprite.scss',
                        }
                    }
                }
            }
        }))
        .pipe(gulp.dest('./app/img/sprite/'));
};

function htmlPug(){
    return gulp.src('./app/pug/*.pug')
    .pipe(pug({
        pretty: true
    }))
    .pipe(prettify({
        "indent_size": 4
    }))
    .pipe(gulp.dest('./app/'))
    .pipe(browserSync.reload({stream: true}))
}

function del(cb) {
    isDev = false;
    fs.emptyDir('./build/', err => {
        if (err) return console.error(err)
        console.log('success!');
      });
      cb();
}

function watch(){
    browserSync.init({
        server: {
            baseDir: "./app/"
		},
		tunnel: true,
        notify: false
    });

    gulp.watch('./app/scss/**/*', styles);
    gulp.watch('./app/*.html').on('change', browserSync.reload);
    gulp.watch('./app/js/**/*.js').on('change', browserSync.reload);
}

function buildFile() {
    console.log(isDev);
    
    var src = [
        './app/img/**/*',
        './app/css/**/*',
        './app/fonts/**/*',
        './app/libs/**/*',
        './app/js/**/*',
        './app/media/**/*',
        './app/*.html'
    ];
    // Return your stream.
    return gulp.src(src, { base: './app/' })
        .pipe(gulp.dest('./build/'));

}
gulp.task('css', styles);
gulp.task('svgSprite', svgSpriteBuild);
gulp.task('del', del);
gulp.task('watch', watch);
gulp.task('default', gulp.series(concatCss, concatJs, watch));
gulp.task('build', gulp.series(del, gulp.parallel(styles, htmlPug, concatCss, concatJs), buildFile));