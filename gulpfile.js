const { src, dest, series, watch } = require("gulp");
const concat = require("gulp-concat");
const htmlMin = require("gulp-htmlmin");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const image = require("gulp-image");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify-es").default;
const notify = require("gulp-notify");
const sourcemaps = require("gulp-sourcemaps");
const del = require("del");
const sass = require("gulp-sass")(require("sass"));
const browserSync = require("browser-sync").create();

const clean = () => {
  return del(["dist"]);
};


const buildStyles = () => {
  return src("src/styles/scss/*.scss")
  .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(dest("src/styles"))
    .pipe(sourcemaps.write())
    .pipe(browserSync.stream())
};

const styles = () => {
  return src("src/styles/**/*.css")
    .pipe(sourcemaps.init())
    .pipe(concat("main.css"))
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(
      cleanCSS({
        level: 2,
      })
    )
    .pipe(sourcemaps.write())
    .pipe(dest("dist"))
    .pipe(browserSync.stream());
};

const htmlMinify = () => {
  return src("src/**/*.html")
  .pipe(sourcemaps.init())
    .pipe(
      htmlMin({
        collapseWhitespace: true,
      })
    )
    .pipe(sourcemaps.write())
    .pipe(dest("dist"))
    .pipe(browserSync.stream());
};

const scripts = () => {
  return src(["src/js/components/**/*.js", "src/js/main.js"])
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(concat("app.js"))
    .pipe(
      uglify({
        toplevel: true,
      }).on("error", notify.onError())
    )
    .pipe(sourcemaps.write())
    .pipe(dest("dist"))
    .pipe(browserSync.stream());
};

const fonts = () => {
  return src(["src/fonts/**/*.woff", "src/fonts/**/*.woff2"])
  .pipe(dest("dist/fonts"));

}

const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: "dist",
    },
  });
};

const images = () => {
  return src([
    "src/images/**/*.jpg",
    "src/images/**/*.png",
    "src/images/*.svg",
    "src/images/**/*.jpeg",
  ])
    .pipe(image())
    .pipe(dest("dist/images"));
};

watch("src/**/*.html", htmlMinify);
watch("src/styles/scss/*.scss", buildStyles);
watch("src/styles/**/*.css", styles);
watch("src/js/**/*.js", scripts);
watch("src/fonts/**", fonts);

exports.default = series(
  clean,
  htmlMinify,
  scripts,
  buildStyles,
  styles,
  images,
  fonts,
  watchFiles
);

