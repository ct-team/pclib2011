var baseUrl = `process.env.BASE_URL`;
// 配置文件
requirejs.config({
    // 基础路径
    baseUrl: baseUrl + 'assets/js/app/',
    urlArgs: '_v=2024032801'
});

requirejs(['./a', '../../libs/utils/b'], function (a, b) {
    a.init();
    b.init();
});
