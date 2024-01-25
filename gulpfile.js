import gulp from 'gulp';
import fileInclude from 'gulp-file-include';
import browserSync from 'browser-sync';
import eslint from 'gulp-eslint-new';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import { deleteAsync } from 'del';
import rename from 'gulp-rename';
import mainSass from 'sass';
import gulpSass from 'gulp-sass';

const sass = gulpSass(mainSass);

const {
    src, watch, dest, parallel, series,
} = gulp;

const PATH = {
    html: {
        src: 'src/*.html',
        dist: 'dist',
    },
    js: {
        src: 'src/js/*.js',
        dist: 'dist/js',
    },
    scss: {
        src: 'src/scss/**/*.scss',
        dist: 'dist/css',
    },
};

export const htmlTask = () => src(PATH.html.src)
    .pipe(fileInclude({ prefix: '@@' }))
    .pipe(dest(PATH.html.dist));

export const jsTask = () => src(PATH.js.src)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(PATH.js.dist));

export const stylesTask = () => src(PATH.scss.src)
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(PATH.scss.dist));

export const resetTask = () => deleteAsync('./dist');

export const browserSyncServer = (cb) => {
    browserSync.init({
        server: {
            baseDir: 'dist',
        },
    });
    cb();
};

export const browserSyncReload = (cb) => {
    browserSync.reload();
    cb();
};

export const watchTask = () => {
    watch(PATH.html.src, series(htmlTask, browserSyncReload));
    watch(PATH.js.src, series(jsTask, browserSyncReload));
    watch(PATH.scss.src, series(stylesTask, browserSyncReload));
};

export default parallel(
    htmlTask,
    jsTask,
    stylesTask,
    browserSyncServer,
    watchTask,
);
