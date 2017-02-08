'use strict'

const gulp = require('gulp'),
    babelify = require('babelify'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    vBuffer = require('vinyl-buffer'),
    watchify = require('watchify'),
    rename = require('gulp-rename'),
    gutil = require('gulp-util'),
    gls = require('gulp-live-server'),
    scssify = require('scssify'),
    embedTemplates = require('gulp-angular-embed-templates');

let bundler,
    server;

const config = {
    src: './app/app.module.js',
    dest: './dist/'
};

let bundle = (bundler, file) => {

    gulp.src('./app/index.html')
        .pipe(gulp.dest(config.dest));

    bundler
        .bundle()
        .pipe(source('bundled-app.js'))
        .pipe(vBuffer())
        .pipe(rename('bundle.js'))
        .pipe(embedTemplates())
        .pipe(gulp.dest(config.dest))
        .on('end', () => {
            gutil.log(gutil.colors.green('Bundled...'));
            server.notify.apply(server, [file]);
        })
}

gulp.task('build', () => {
    bundler = browserify(config.src, { debug: true })
        .plugin(watchify)
        .transform(babelify, { presets: ['es2015'] })
        .transform(scssify, {autoInject: true})
        .transform({ global: true }, 'uglifyify');

    bundle(bundler);

});

gulp.task('serve', () => {
    server = gls.static('dist', 8888);
    server.start();

    gulp.watch(['app/**/*.js', 'app/**/*.html', 'app/**/*.scss'], 
        {cwd: './'}, (file) => {
        bundle(bundler, file);   
    });
});

gulp.task('default', ['build', 'serve']);