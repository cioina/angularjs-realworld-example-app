var gulp          = require('gulp');
var notify        = require('gulp-notify');
var source        = require('vinyl-source-stream');
var browserify    = require('browserify');
var babelify      = require('babelify');
var ngAnnotate    = require('browserify-ngannotate');
var browserSync   = require('browser-sync').create();
var rename        = require('gulp-rename');
var templateCache = require('gulp-angular-templatecache');
var uglify        = require('gulp-uglify');
var merge         = require('merge-stream');
var fs            = require("fs");
var argv          = require('yargs').argv;

const targetPath = './src/js/config/app.constants.js';

const envConfigFile = `
const AppConstants = {
    api: '${argv.API_URL}',
    jwtKey: 'jwtToken',
    appName: 'Conduit',
};
export default AppConstants;
`

var viewFiles = 'src/js/**/*.html';

var interceptErrors = function(error) {
  var args = Array.prototype.slice.call(arguments);

  // Send error to notification center with gulp-notify
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);

  // Keep gulp from hanging on this task
  this.emit('end');
};


gulp.task('browserify',  function () {
  return browserify('./src/js/app.js')
      .transform(babelify, {presets: ['@babel/preset-env']})
      .transform(ngAnnotate)
      .bundle()
      .on('error', interceptErrors)
      //Pass desired output filename to vinyl-source-stream
      .pipe(source('main.js'))
      // Start piping stream to tasks!
      .pipe(gulp.dest('./build/'));
});

gulp.task('html', function() {
    fs.writeFile(targetPath, envConfigFile, function (err) {
        if (err) {
            console.log(err);
        }

        console.log(`Output environment generated at ${targetPath}`);
    });

  return gulp.src('src/index.html')
      .on('error', interceptErrors)
      .pipe(gulp.dest('./build/'));
});

gulp.task('views', function() {
  return gulp.src(viewFiles)
      .pipe(templateCache({
		    //root:'', 
		    //https://github.com/miickel/gulp-angular-templatecache/issues/164
		    transformUrl: function(url) {
	           return url.slice(1);
        },
        standalone: true
      }))
      .on('error', interceptErrors)
      .pipe(rename('app.templates.js'))
      .pipe(gulp.dest('./src/js/config/'));
});

// This task is used for building production ready
// minified JS/CSS files into the dist/ folder
gulp.task('minimize', function () {
    var html = gulp.src('build/index.html')
                   .pipe(gulp.dest('./dist/'));

    var js = gulp.src('build/main.js')
                 .pipe(uglify())
                 .pipe(gulp.dest('./dist/'));

    return merge(html, js);
});

gulp.task('build', gulp.series('html', 'views', 'browserify'));

gulp.task('default', gulp.series('build', 'minimize'));

