var gulp = require('gulp');
var sass = require('gulp-sass');
var auto = require('gulp-autoprefixer');
var servers = require('gulp-webserver');
var fs = require('fs');
var path = require('path');
var url = require('url');
var swiperJson = require('./mock/swiper.json');
var listJson = require('./mock/list.json');
gulp.task('devSass', function() {
    return gulp.src('./src/sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./src/css'))
});
gulp.task('watch', function() {
    return gulp.watch('./src/sass/*.scss', gulp.series('devSass'));
});
gulp.task('devServer', function() {
    return gulp.src('src')
        .pipe(servers({
            port: 8080,
            middleware: function(req, res) {
                var pathname = url.parse(req.url).pathname;
                if (pathname === '/favicon.ico') {
                    return res.end()
                }
                if (pathname === '/api/list') {
                    var index = url.parse(req.url).query;
                    var ind = index.split('=')[1];
                    res.end(JSON.stringify({ code: 0, msg: swiperJson[ind] }));
                } else if (pathname === '/api/info') {
                    res.end(JSON.stringify({ code: 0, msg: listJson.slice(0, 5) }));
                } else {
                    pathname = pathname === '/' ? 'index.html' : pathname;
                    res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)));
                }
            }
        }))
});
gulp.task('dev', gulp.series('devSass', 'devServer', 'watch'));