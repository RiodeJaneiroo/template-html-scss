const gulp 			= require('gulp'),
		scss 			= require('gulp-sass'),
		autoprefixer= require('gulp-autoprefixer'),
		browserSync = require('browser-sync').create(),
		cleanCss		= require('gulp-clean-css'),
		gulpIf		= require('gulp-if'),
		pug 			= require('gulp-pug'),
		prettify 	= require('gulp-html-beautify'),
		sourcemaps 	= require('gulp-sourcemaps');

const isDev = true;

gulp.task('scss', () => {
	return gulp.src('./app/scss/main.scss')
			.pipe(gulpIf(isDev, sourcemaps.init()))
			.pipe(autoprefixer())
			.pipe(scss())
			.pipe(cleanCss())
			.pipe(gulpIf(isDev, sourcemaps.write()))
			.pipe(gulp.dest('./app/css/'))
			.pipe(browserSync.stream());
});

gulp.task('pug', function () {
	return gulp.src('./app/pug/*.pug')
		.pipe(pug({
			pretty: true
		}))
		.pipe(prettify({
			"indent_size": 4
		}))
		.pipe(gulp.dest('app/'))
		.pipe(browserSync.reload({stream: true}))
});


gulp.task('serv', () => {
	browserSync.init({
		server: {
			 baseDir: './app'
		},
		notify: false
	});

		gulp.watch('./app/scss/*.scss', ['scss']);
		gulp.watch('./app/pug/**/*.pug', ['pug']);
		gulp.watch(['./app/**/*.js']).on('change', browserSync.reload);
});

gulp.task('default', ['scss', 'serv']);
