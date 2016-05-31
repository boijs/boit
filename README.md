# boit

tools collection for boi

### 安装
```
npm install boit -g
```

### 配置文件`boimap-config.json`
```
{
    "mapfile": "http://dj.58cdn.com.cn/test/boi-map.json",
    "targets": ["./views/index.a.html","./views/index.b.html"]
}

```

* `mapfile`是静态资源的map文件url，由boi编译输出，格式如下：
```
{
    "js": {
        "main.a.js": "http://static.daojia.com/jiazheng/js/main.a.e404f6b5.js",
        "jiazheng.asyncC.js": "http://static.daojia.com/jiazheng/js/part/jiazheng.asyncC.e404f6b5.js",
        "jiazheng.asyncE.js": "http://static.daojia.com/jiazheng/js/part/jiazheng.asyncE.e404f6b5.js",
        "main.b.js": "http://static.daojia.com/jiazheng/js/main.b.e404f6b5.js"
    },
    "style": {
        "main.a.css": "http://static.daojia.com/jiazheng/style/main.a.e404f6b5.css",
        "main.b.css": "http://static.daojia.com/jiazheng/style/main.b.e404f6b5.css"
    }
}
```

* `targets`是一个数组，元素是需处理的html模板文件。

### 使用

在配置文件`boimap-config.json`存放的目录下执行：
```
boit up html
```
或者
```
boit update html
```

### 规范

html模板中需要遵照以下规范，以便boit可替换静态资源的url：

* 需替换的`link`标签添加`boi-css`属性，属性值为完整的css文件名（不包括hash指纹），如下：
```
<link rel="stylesheet" boi-css='main.a.css' href='http://static.daojia.com/jiazheng/style/main.a.e404f6b5.css'>
```

* 需替换的`script`标签添加`boi-js`属性，属性值为完整的js文件名（不包括hash指纹），如下：
```
<script boi-js='main.a.js' src='http://static.daojia.com/jiazheng/js/main.a.e404f6b5.js'></script>
```

### 前后端协作模式

1. 前端开发人员使用boi将前端文件进行编译，html配置项增加`staticSrcmap: true`，如下：
```
boi.spec('html', {
    extType: 'html',
    srcDir: 'views',
    staticSrcmap: true
});
```
2. boi编译生成`boi-map.json`文件，此文件上传后将线上url配置到`boimap-config.json`文件的`mapfile`；
3. 后端开发人员安装`boit`；
4. 前端开发人员在文件变动时编译更新`boi-map.json`文件并上传；
5. 后端开发人员配置`boi-map.json`文件的`targets`项后，执行`boit up html`即可更新html模板中静态资源的url。
