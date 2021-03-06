var del = require("del");
var gulp = require("gulp");
var gutil = require("gutil");
var sass = require("gulp-sass");
var concat = require("gulp-concat");
var coffee = require("gulp-coffee");
var strip = require("gulp-strip-comments");
var closureCompiler = require("gulp-closure-compiler");

gulp.task("clean", function() {
  return del(["build", "dist", "status.min.js"]);
});

gulp.task("coffeescript", function() {
  return gulp.src("./src/*.coffee")
    .pipe(coffee({ bare: true }).on("error", gutil.log))
    .pipe(gulp.dest("./build/"));
});

gulp.task("sass", function() {
  return gulp.src("./src/styles/status.scss")
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(gulp.dest("./dist/"));
});

gulp.task("compile", function() {
  return gulp.src("build/status.js")
    .pipe(closureCompiler({
      fileName: "status.min.js",
      compilerFlags: {
        closure_entry_point: "status.main",
        compilation_level: "SIMPLE_OPTIMIZATIONS",
        extra_annotation_name: "Status",
        language_in: "ECMASCRIPT6",
        language_out: "ECMASCRIPT5",
        only_closure_dependencies: true
      }
    }))
    .pipe(gulp.dest("./build/"));
});

gulp.task("vendor", function() {
  return gulp.src("./vendor/*.js")
    .pipe(strip())
    .pipe(gulp.dest("./build/"));
});

gulp.task("dist", function() {
  return gulp.src("./build/*.min.js")
    .pipe(concat("status.js"))
    .pipe(gulp.dest("./dist/"));
});

gulp.task("default", gulp.series("clean", "coffeescript", "sass", "compile", "vendor", "dist"));

gulp.task("watch", function() {
  var watcher = gulp.watch("./src/**/*", ["default"]);

  watcher.on("change", function(event) {
    console.log("File " + event.path + " was " + event.type + ", running tasks...");
  });
});
