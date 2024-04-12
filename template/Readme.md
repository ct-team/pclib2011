## node

使用 20.15.0

打包使用自定义环境

## 文件说明

```
public  //静态资源文件
src
  |-- assets    // 资源文件
      |-- css   // 样式文件 只存放直接使用文件 子模块从sass中引入 可放scss 会自动转同名css
      |-- js    // 脚本文件
      |-- img   // 图片文件
      |-- sass  // sass样式文件 只存放scss模块文件 【打包后会删除】
      |-- lib    // 第三方库文件 【打包后会删除】
  |-- sprite    // 雪碧图文件 【打包后会删除】
  |-- index.html    // 页面文件

```

## requirejs 配置

必须配置 `build-user/config.js` 文件

paths 配置 当前不支持 只能在和 gulpfile 内一致 否则打包会报错

```
//正常配置
requirejs: [
        {
            Entry: 'assets/js/app/', //入口文件夹
            Name: 'main.js' //文件名
        }
]
//没有
requirejs:[]

```

## 静态资源

```
//打包后放入页面目录
<script src="/public/a.js"></script>
//打包后放入assets目录
<script src="/public/assets/b.js"></script>
```

## 环境变量

可在 html js css 中使用

### process 用法(读取 env 文件)

env 使用`GAPP_`开头
内部包含

```
//基础
process.env.NODE_ENV    //环境
process.env.BASE_URL    //基础路径
process.env.GAPP_ENV    //环境
//自定义
process.env.GAPP_TEST

```

### NODE_ENV 用法

```
<!-- @if NODE_ENV='production'-->
//production
<!-- @endif -->
<!-- @if NODE_ENV!='production'-->
//非production
<!-- @endif -->
```

### BASE_URL

```
%BASE_URL%
```

## log

| 版本  | 说明 |
| ----- | ---- |
| 1.0.0 | 初始 |
