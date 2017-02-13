const gulp = require('gulp');
const babel = require('gulp-babel');
const webpack = require('webpack-stream');

gulp.task('default', () => {
  return gulp.src('src/**')
    .pipe(webpack({
      watch: true,
      module: {
        loaders: [
          {
            test: /\.js$/,
            exclude: /(node_modules)/,
            loader: 'babel-loader',
            query: { presets: ['es2015'] }
          }
        ]
      },
      output: { filename: 'build.js' }
    }))
    .pipe(gulp.dest('dist'))
});
