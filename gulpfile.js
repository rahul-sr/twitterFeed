// Import task modules
var gulp = require('gulp'),
    hb = require('gulp-hb'),
    clean = require('gulp-clean'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    rename = require('gulp-rename'),
    minifyCSS = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    bless = require('gulp-bless'),
    package = require('./package.json');
    //modernizr = require("modernizr");
// Set base directories
var bases = {
 src: 'src/',
 dist: 'dist/',
};

// set paths
var paths = {
 json: ['src/assets/js/data/*.json','src/js/data/**/*.json'],
 libs: {
   js:[
     'src/assets/js/lib/jquery.min.js', 
   ],
   css: [
     'src/assets/sass/lib/font-awesome.css'
   ]
 },
 modules:['src/assets/js/config.js',       
          'src/assets/js/component/*.js',
          'src/assets/js/data/map.js'          
        ],
 imgs: ['src/assets/img/**/**.*','src/assets/img/**.*'],
 fonts: ['src/assets/fonts/**/**.*','src/assets/fonts/**.*']
};


// CSS tasks
gulp.task('css', function () {
    gulp.src(paths.libs.css)
    .pipe(concat('libs.css'))
    .pipe(gulp.dest(bases.dist+'assets/css'))
     gulp.src(bases.src+'assets/sass/style.scss')
    .pipe(sass({errLogToConsole: true}))
    .pipe(autoprefixer('last 4 versions'))
    .pipe(bless())
    .pipe(minifyCSS({ keepSpecialComments: 1, processImport: false }))
    .pipe(gulp.dest(bases.dist+'assets/css'))
    .pipe(browserSync.reload({stream:true}));
});


//JS Tasks
gulp.task('js',function(){
    gulp.src(paths.libs.js)
    // .pipe(jshint('.jshintrc'))
    // .pipe(jshint.reporter('default'))
    .pipe(concat('libs.js'))
    .pipe(uglify())
    .pipe(gulp.dest(bases.dist+'assets/js/libs'))
    .pipe(browserSync.reload({stream:true, once: true}));
     gulp.src(paths.modules)
    // .pipe(concat('modernizr.js'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest(bases.dist+'assets/js'))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(bases.dist+'assets/js'))
    .pipe(browserSync.reload({stream:true, once: true}));


});

// HTML Tasks
gulp.task('markup',function(){
  gulp.src([bases.src+'templates/pages/**/*.hbs'], {
    })
    .pipe(hb({
      partials: bases.src+'templates/partials/**/*.hbs',
      data: bases.src+'asstes/js/data/**/*.{js,json}'
    }))
    .pipe(rename({
      extname: ".html"
    }))
    .pipe(gulp.dest(bases.dist))
    .on('end', function() {
      browserSync.reload()
    });
});

// clean up
gulp.task('clean', function () {
	return gulp.src(bases.dist, {read: false})
		.pipe(clean({force: true}));
});


// Copy JSON
gulp.task('copy:json', function() {

  // js
   gulp.src(paths.json)
   .pipe(gulp.dest(bases.dist+'assets/js/data'));

});

// Copy images
gulp.task('copy:imgs', function() {

  // images
   gulp.src(paths.imgs)
   .pipe(gulp.dest(bases.dist+'assets/img'));

});

// Copy fonts
gulp.task('copy:fonts', function() {

  // fonts
   gulp.src(paths.fonts)
   .pipe(gulp.dest(bases.dist+'assets/fonts'));

});


// Copy all
gulp.task('copy:all', ['copy:imgs', 'copy:fonts', 'copy:json']);


// Server support
gulp.task('browser-sync', function() {
    browserSync.init(null, {
        server: {
            baseDir: "dist"
        }
    });
});

// Reload
gulp.task('bs-reload', function () {
    browserSync.reload();
});

// ============================================

gulp.task('default', ['copy:all', 'css', 'js', 'markup', 'browser-sync'], function () {
    gulp.watch(bases.src+'assets/sass/**/*.scss', ['css']);
    gulp.watch(bases.src+'assets/js/**/*.js', ['js']);
    gulp.watch(bases.src+'assets/js/data/**/*.json', ['json']);
    gulp.watch(bases.src+'**/*.hbs', ['markup', 'bs-reload']);
});
