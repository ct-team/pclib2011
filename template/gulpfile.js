import gulp from 'gulp';
import uglify from 'gulp-uglify';
import minifycss from 'gulp-minify-css';
import replace from 'gulp-replace';
import useref from 'gulp-useref';
import assetRev from 'gulp-rev';
import revCollector from 'gulp-rev-collector';
import clean from 'gulp-clean';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import requirejsOptimize from 'gulp-requirejs-optimize';
import config from './build-user/config.js';
import connect from 'gulp-connect';
import { createProxyMiddleware } from 'http-proxy-middleware';
import fs from 'fs';
import spritesmith from 'gulp.spritesmith';
import preprocess from 'gulp-preprocess';
// import { deleteAsync } from 'del';
import babel from 'gulp-babel';
import glob from 'glob';
//获取环境
const NODE_ENV = process.env.NODE_ENV || 'development';
const envConfig = config.envConfig[NODE_ENV];
const BASE_URL =
    NODE_ENV === 'development' ? '' : envConfig.domainUrl + config.appUrl;

//sass 初始化
const sass = gulpSass(dartSass);

function sassCompile() {
    return gulp
        .src('src/assets/css/*.scss')
        .pipe(sass()) // 转成CSS
        .pipe(
            autoprefixer({
                overrideBrowserslist: ['ie > 6'],
                cascade: false
            })
        ) // 补全
        .pipe(gulp.dest('src/assets/css'));
}
//环境变量替换
function replaceEnv() {
    const envData = JSON.parse(fs.readFileSync('.env.json'));
    const currentEnvData = JSON.parse(fs.readFileSync(`.env.${NODE_ENV}.json`));
    const Env = Object.assign(envData, currentEnvData, { NODE_ENV, BASE_URL });
    return gulp
        .src('dest/**/*.{html,js,css}')
        .pipe(preprocess({ context: { NODE_ENV: NODE_ENV } }))
        .pipe(replace('%BASE_URL%', BASE_URL))
        .pipe(
            replace(
                /process\.env\.(\w+)/g,
                function handleReplace(match, p1, offset, string) {
                    return Env[p1];
                }
            )
        )
        .pipe(gulp.dest('dest/', { overwrite: true }));
}
function copyRequireBuild() {
    return gulp
        .src('dest/.build/assets/**', { allowEmpty: true })
        .pipe(gulp.dest('dest/assets'));
}
function requireBuild(cb) {
    if (!config.requirejs) {
        cb();
        return;
    }

    config.requirejs.forEach(function (item) {
        gulp.src('dest/' + item.Entry + item.Name)
            .pipe(requirejsOptimize({ optimize: 'none' }))
            .pipe(gulp.dest('dest/.build/' + item.Entry));

        gulp.src('dest/' + item.Entry, { read: false }).pipe(clean());
    });
    setTimeout(function () {
        cb();
    }, 2000);
}
function transformJs(cb) {
    return gulp
        .src('dest/assets/**/*.js')
        .pipe(babel())
        .pipe(uglify())
        .pipe(gulp.dest('dest/assets'));
}
function transformCss(cb) {
    return gulp
        .src('dest/assets/**/*.css')
        .pipe(
            minifycss({
                compatibility: 'ie7'
            })
        )
        .pipe(gulp.dest('dest/assets'));
}

function setHash() {
    return gulp
        .src(['dest/assets/**', '!dest/assets/**/*.js'])
        .pipe(assetRev())
        .pipe(gulp.dest('dest/assets'))
        .pipe(assetRev.manifest())
        .pipe(gulp.dest('dest/.build/rev'));
}
function replaceHash() {
    return gulp
        .src(['dest/.build/rev/rev-manifest.json', 'dest/**/*.{html,css}'])
        .pipe(revCollector())
        .pipe(gulp.dest('dest'));
}
function start(cb) {
    connect.server(
        {
            /*根路径*/
            root: './dest',
            /*开启浏览器自动刷新*/
            livereload: true,
            host: '0.0.0.0', //ip可访问
            /*端口号*/
            port: config.devServer.port,
            /*使用代理服务*/
            middleware: function (connect, opt) {
                var list = [];
                for (var key in config.devServer.proxy) {
                    list.push(
                        createProxyMiddleware(key, config.devServer.proxy[key])
                    );
                }

                return list;
            }
        },
        function () {
            console.log(
                '\x1B[32m%s\x1B[32m',
                'Server started http://localhost:' + config.devServer.port,
                '\n http://a.admin.ct108.org:' + config.devServer.port
            );
        }
    );
    cb();
}
function cleanDist() {
    return gulp.src('dist', { allowEmpty: true, read: false }).pipe(clean());
}
function cleanDest() {
    return gulp.src('dest', { allowEmpty: true, read: false }).pipe(clean());
}
function copysrc() {
    return gulp
        .src([
            'src/**',
            '!src/assets/sass/**',
            '!src/sprite/**',
            '!src/assets/**/*.scss'
        ])
        .pipe(gulp.dest('dest'));
}
function copyPublic() {
    return gulp.src('public/**').pipe(gulp.dest('dest/public'));
}
function htmlResourceMerge() {
    return gulp.src('dest/**/*.html').pipe(useref()).pipe(gulp.dest('dest'));
}

function replaceHtmlBaseUrl() {
    return gulp
        .src('dest/**/*.html')
        .pipe(replace(/(=\s*)(['"]*)(\/*)public\//g, '$1$2'))
        .pipe(
            replace(
                /(=\s*)(['"]*)(\.*)(\/*)assets\//g,
                '$1$2' + BASE_URL + 'assets/'
            )
        )
        .pipe(gulp.dest('dest/'));
}
function connectReload() {
    return gulp.src('dest/**/*.html').pipe(connect.reload());
}
function watch(cb) {
    gulp.watch(['src/assets/**/*.scss'], gulp.series(sassCompile));
    gulp.watch(
        [
            'src/**',
            '!src/assets/**/*.scss',
            '!src/assets/sass/**',
            '!src/sprite/**'
        ],
        gulp.series(copysrc, replaceEnv, connectReload)
    );
    gulp.watch(['public/**'], gulp.series(copyPublic, connectReload));
    cb();
}

// 雪碧图生成
const getMulu = function (filePath) {
    const newPath = filePath.replace(/\\/g, '/');
    const filename1 = newPath.substring(0, newPath.lastIndexOf('/'));
    const filename2 = filename1.substring(filename1.lastIndexOf('/') + 1);
    return filename2;
};
function spriteBuild(cb) {
    const fileSrc = 'src/sprite/';
    fs.readdir(fileSrc, (err, data) => {
        // 读取后的回调函数
        // data 是文件内容的 Buffer 数据流
        if (err) {
            console.log('雪碧图生成error', err);
        }
        data.forEach((fileName) => {
            if (fileName.indexOf('.') >= 0) {
                return;
            }
            const outPath = 'sprite/' + fileName;

            gulp.src(fileSrc + fileName + '/*.*')
                .pipe(
                    spritesmith({
                        imgName: outPath + '.png',
                        cssName: outPath + '.scss', //保存合并后对于css样式的地址
                        padding: 5, //合并时两个图片的间距
                        //algorithm: 'binary-tree', //形状 top-down[|]、left-right[-]、diagonal[\]、alt-diagonal[/]、binary-tree[+]
                        cssTemplate: fileSrc + 'sprite-temp.css'
                    })
                )
                .pipe(gulp.dest('src/'));
        });
    });
    cb();
    return;
}

function moveDestToDist() {
    return gulp.src(['dest/**', '!dest/.build']).pipe(gulp.dest('dist'));
}
function movePublicToDist() {
    return gulp.src('public/**').pipe(gulp.dest('dist'));
}
function moveFileToEnv() {
    const fileDir = envConfig.indexPath;
    return gulp
        .src('dist/**', { ignore: 'dist/assets/**' })
        .pipe(gulp.dest(`dist/${fileDir}/`));
}
const filterToDest = gulp.series(cleanDest, sassCompile, copysrc, replaceEnv);

const build = gulp.series(
    cleanDist,
    filterToDest,
    requireBuild,
    copyRequireBuild,
    transformJs,
    transformCss,
    setHash,
    replaceHash,
    replaceHtmlBaseUrl,
    moveDestToDist,
    movePublicToDist,
    moveFileToEnv
);

export default build;

export const serve = gulp.series(filterToDest, copyPublic, watch, start);
export const sprite = spriteBuild;
