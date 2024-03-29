var baseUrl = `process.env.BASE_URL`;
// 配置文件
requirejs.config({
    // 基础路径
    baseUrl: baseUrl + 'assets/js/app/',
    urlArgs: '_v=2024032801',
    // 映射路径
    paths: {}
});

requirejs(['./a'], function (a) {
    a.init();
});
