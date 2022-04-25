const gulp = require("gulp"),
  concat = require("gulp-concat"),
  autoprefixer = require("gulp-autoprefixer"),
  sass = require("gulp-sass")(require("sass")),
  browserSync = require("browser-sync").create(),
  gulpIf = require("gulp-if"),
  sourcemaps = require("gulp-sourcemaps"),
  cleanCSS = require("gulp-clean-css");

var isDev = false;

function styles() {
  return gulp
    .src("./app/scss/style.scss")
    .pipe(gulpIf(isDev, sourcemaps.init({ largeFile: true })))
    .pipe(concat("style.min.css"))
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS({ level: 2 }))
    .pipe(gulpIf(isDev, sourcemaps.write("maps")))
    .pipe(gulp.dest("./app/css/"))
    .pipe(browserSync.stream());
}

// function concatCss() {
//   return gulp
//     .src(cssFiles)
//     .pipe(concat("libs.min.css"))
//     .pipe(cleanCSS({ level: 2 }))
//     .pipe(gulp.dest("./app/css/"));
// }
// function concatJs() {
//   return gulp
//     .src(jsFiles)
//     .pipe(concat("libs.min.js"))
//     .pipe(gulp.dest("./app/js/"));
// }

function watch() {
  browserSync.init({
    server: {
      baseDir: "./app/",
    },
    tunnel: true,
    notify: false,
  });

  gulp.watch("./app/scss/**/*", styles);
  gulp.watch("./app/*.html").on("change", browserSync.reload);
  gulp.watch("./app/js/**/*.js").on("change", browserSync.reload);
}

// function buildFile() {
//   console.log(isDev);

//   var src = [
//     "./app/img/**/*",
//     "./app/css/**/*",
//     "./app/fonts/**/*",
//     "./app/libs/**/*",
//     "./app/js/**/*",
//     "./app/media/**/*",
//     "./app/*.html",
//   ];
//   // Return your stream.
//   return gulp.src(src, { base: "./app/" }).pipe(gulp.dest("./build/"));
// }
gulp.task("css", styles);
gulp.task("watch", watch);
gulp.task("default", watch);
