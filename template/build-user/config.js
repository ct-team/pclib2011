export default {
    appUrl: '/static/tcy365-exchangemall/h5/', // 项目路径  如   /static/mobile/test/
    requirejs: [
        {
            Entry: 'assets/js/app/', //文件入口文件夹
            Name: 'main.js' //入口
        }
    ],
    envConfig: {
        development: {
            domainUrl: '',
            indexPath: ''
        },
        stable: {
            domainUrl: '//static.tcy365.org:1505',
            indexPath: '1505-stable'
        },
        dev: {
            domainUrl: '//static.tcy365.org:1506',
            indexPath: '1506-develop'
        },
        ctest: {
            domainUrl: '//static.tcy365.org:1507',
            indexPath: '1507-test'
        },
        pre: {
            domainUrl: '//prestatic.tcy365.com',
            indexPath: '2505-pre'
        },
        production: {
            domainUrl: '//static.tcy365.com',
            indexPath: '80-static'
        }
    },
    devServer: {
        port: 1506, // 端口号
        host1: 'localhost', // 主机名1
        host2: 'a.admin.ct108.org', // 主机名2
        proxy: {
            '/api': {
                target: 'http://yapi.tcy365.org:3000/mock/', // 本地模拟数据服务器
                changeOrigin: true
            }
        }
    }
};
