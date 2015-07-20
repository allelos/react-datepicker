var gulp = require('gulp');
var sass = require('gulp-sass');
var react = require('gulp-react');
var jshint = require('gulp-jshint');
var prefix = require('gulp-autoprefixer');

gulp.task('sass', function() {
  gulp.src('src/scss/*.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(prefix('last 2 version'))
    .pipe(gulp.dest('src/dist/css/'));
});

gulp.task('react', function() {
  gulp.src('src/js/*.js')
    .pipe(react())
    .on('error', console.log.bind('Error'))
    .pipe(gulp.dest('src/dist/js/'));
});

gulp.task('jshint', function() {
  return gulp.src('src/dist/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('watch', function(){
  gulp.watch('src/js/*.js', ['react']);
  gulp.watch('src/scss/*.scss', ['sass']);
  gulp.watch('src/js/*.js', ['jshint']);
});

gulp.task('default', ['watch']);
