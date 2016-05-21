var gulp = require('gulp');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var csslint = require('gulp-csslint');
var cleanCSS = require('gulp-clean-css');

var jsFiles = "./src/*.js";
var cssFiles = "./src/*.css";

gulp.task('lint', function() {

	gulp.src(jsFiles)
		.pipe(jshint())
		.pipe(jshint.reporter('default'));

	gulp.src(cssFiles)
		.pipe(csslint())
		.pipe(csslint.reporter());
});

gulp.task('dist', function() {

	gulp.src(jsFiles)
		.pipe(concat('./dist'))
		.pipe(rename('image-input.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./dist'));

	gulp.src(cssFiles)
		.pipe(concat('./dist'))
		.pipe(rename('image-input.min.css'))
		.pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe(gulp.dest('./dist'));
});

gulp.task('default', function() {

	gulp.run('lint', 'dist');
	gulp.watch(jsFiles, function(evt) {
		gulp.run('lint', 'dist');
	});

});