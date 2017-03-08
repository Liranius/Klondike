/**
 * Created by Liranius on 2017/3/7.
 */
//导入工具包 require("node_modules里对应模块")
var gulp = require("gulp");

/** copy task */
gulp.task("moveHtmls", function () {
    gulp.src("./src/**/*.html", { base: "./src" })
        .pipe(gulp.dest("./docs"))
        .pipe(gulp.dest("../../liranius.github.io/Klondike"));
});

gulp.task("moveJsLibs", function () {
    gulp.src("./src/public/js/*.js", { base: "./src" })
        .pipe(gulp.dest("./docs"))
        .pipe(gulp.dest("../../liranius.github.io/Klondike"));
});

gulp.task("moveImgs", function () {
    gulp.src("./src/*.jpg", { base: "./src" })
        .pipe(gulp.dest("./docs"))
        .pipe(gulp.dest("../../liranius.github.io/Klondike"));
});

/** Sass tasks */
var sass = require("gulp-ruby-sass"),
    sourcemaps = require("gulp-sourcemaps"),
    postcss = require("gulp-postcss"),
    autoprefixer = require("autoprefixer"),
    cssnano = require("cssnano");

gulp.task("compSass", function () {
    sass("./src/**/*.scss", { sourcemap: true, base: "./src" })
        .pipe(sourcemaps.init())
        .on("error", sass.logError)
        .pipe(postcss([
            autoprefixer({
                browsers: ["last 2 versions"],
                cascade: false
            }),
            cssnano()
        ]))
        .pipe(sourcemaps.write("./", {
            includeContent: false,
            sourceRoot: "source"
        }))
        .pipe(gulp.dest("./docs"))
        .pipe(gulp.dest("../../liranius.github.io/Klondike"));
});

/** TS tasks */
var ts = require("gulp-typescript"),
    uglify = require('gulp-uglify');

var config = {
    "module": "System",
    "target": "es5",
    "sourceMap": true,
    "removeComments": true,
    "traceResolution": true/*,
     "outDir": "../docs/"*/
};

gulp.task("compTS", function () {
    gulp.src("./src/**/*.ts", { base: "./src" })
        .pipe(sourcemaps.init())
        .pipe(ts(config))
        .pipe(uglify())
        .pipe(sourcemaps.write("./", {
            includeContent: false,
            sourceRoot: 'source'
        }))
        .pipe(gulp.dest("./docs"))
        .pipe(gulp.dest("../../liranius.github.io/Klondike"));
});

gulp.task("default", [
    "moveHtmls", "moveJsLibs", "moveImgs", "compSass", "compTS"
]);

//gulp.task(name[, deps], fn) 定义任务  name：任务名称 deps：依赖任务名称 fn：回调函数
//gulp.src(globs[, options]) 执行任务处理的文件  globs：处理的文件路径(字符串或者字符串数组)
//gulp.dest(path[, options]) 处理完后文件生成路径