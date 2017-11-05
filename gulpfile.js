var gulp          = require('gulp'),
    postcss       = require('gulp-postcss'),
    lost          = require('lost'),
    cssnano       = require('cssnano'),
    simplevars    = require('postcss-simple-vars'),
    nested        = require('postcss-nested'),
    atImport      = require('postcss-import'),
    uglify        = require('gulp-uglify'),
    plumber       = require('gulp-plumber'),
    autoprefixer  = require('autoprefixer'),
    imagemin      = require('gulp-imagemin'),
    concat        = require('gulp-concat'),
    browserSync   = require('browser-sync'),
    sourcemaps    = require('gulp-sourcemaps'),
    cssnext       = require('cssnext');

var paths = {
  src: {
    js: './src/js/**/*.js',
    css: './src/css/**/styles.css',
    img: './src/img/**/*'
  },

  dest: {
    js: './dist/js',
    css: './dist/css',
    img: './dist/img'
  }
}

var processors = [
  atImport,
  lost,
  nested,
  autoprefixer({browsers: ['last 10 versions']}),
  cssnano(),
  cssnext
];

gulp.task('js-min', function () {
    gulp.src(paths.src.js)
        .pipe(uglify({mangle: false}))
        .pipe(concat('scripts.min.js'))
        .pipe(gulp.dest(paths.dest.js));
});

gulp.task('css', function() {

  return gulp.src(paths.src.css)
      .pipe(sourcemaps.init())
      .pipe(postcss(processors))
      .pipe(plumber())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(paths.dest.css))

});

gulp.task('serve', function() {
    var files = [
      '*.html',
      paths.src.css,
      paths.src.js
    ];

    browserSync.init(files, {
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('imagemin', function() {
    gulp.src([paths.src.img])
        .pipe(imagemin({optimizationLevel: 7}))
        .pipe(gulp.dest(paths.dst.img));
});

gulp.task('watch', function () {
    gulp.watch(paths.src.js, ['js-min']);
    gulp.watch(paths.src.css, ['css']);
});

gulp.task('default', [
    'js-min',
    'css',
    'watch',
    'serve'
]);
