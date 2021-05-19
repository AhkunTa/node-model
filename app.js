const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const path = require("path");
const fs = require("fs");
const url = require("url");
const defaultConfig = require("./config.js");
var ejs = require("ejs");
const app = express();

global.appConfig = app.locals.config = Object.assign({}, defaultConfig);
global.appDir = __dirname;

console.log(global.appDir);
// 模板渲染
app.engine(".html", ejs.__express);
app.set("views", path.resolve(global.appDir, "./front/view"));
app.set("view engine", "html");

// 数据接口反向代理
let mockServer = "/mock";
app.use(
  "/api/**/*.json",
  createProxyMiddleware({
    target: `http://localhost:${global.appConfig.port}`,
    changeOrigin: true,
    pathRewrite: function (path, req) {
      return path.replace("/api", mockServer);
    },
    async onProxyRes(proxyRes, req, res) {},
    onError(err) {
      console.log(err);
    },
  })
);

// 静态资源
app.use(
  global.appConfig.staticPath,
  express.static(path.resolve(global.appDir, "./front/static"), {
    lastModified: false,
    etag: false,
    maxAge: 0,
  })
);
// mock数据
// app.use('/mock', express.static(path.resolve(global.appDir, './mock')))
app.use("/mock", function (req, res) {
  let reqUrl = decodeURI(
    url.parse(req.originalUrl).pathname.replace(/^\//, "")
  );
  let filePath = path.resolve(global.appDir, reqUrl);
  // 设置link 应答头部 用来表示与另外一个资源之间的类型关系
  // res.links({
  //   next: 'http://api.example.com/users?page=2',
  //   last: 'http://api.example.com/users?page=5'
  // })
  if (req.query.callback) {
    res.jsonp(require(filePath));
  } else {
    res.json(require(filePath));
  }
});

// 请求响应返回
// app.use(function(req,res){
//   res.format({
//     text: function () {
//       res.send('text')
//     },

//     html: function () {
//       res.send('<p>hey</p>')
//     },

//     json: function () {
//       res.send({ message: 'hey' })
//     }
//   })
// })

// 页面请求
app.use(["/gre+t", "hell{2}o"], function (req, res, next) {
  console.log("req: ", req.baseUrl);
  res.sendFile(global.appDir + "/front/view");
});

app.use("/**/*.html", function (req, res, next) {
  let reqPath = decodeURI(
    url.parse(req.originalUrl).pathname.replace(/^\//, "")
  );

  let filePath = path.resolve(global.appDir, reqPath);
  console.log("reqPath", reqPath);
  console.log("filePath", filePath);
  // res.append("Warning", "199 Miscellaneous warning");
  // 设置cookie
  // res.cookie("name", "tobi", { path: "/admin", secure: true });

  // 下载文件
  // res.download('static/public/scrollLoad/Scrollload.js')

  // 设置 重定向
  // res.redirect('/')

  // 模板渲染
  res.render(filePath, function (err, html) {
    if (err) {
      console.log("err", err);
      next(err);
      return;
    }

    // 设置返回响应码
    // res.status(404).send('Sorry, we cannot find that!')

    // 设置 数据格式 服务端返回
    // res.type('json')

    res.send(html);
  });
  // res.sendFile(filePath);
});

// app.use("/view", express.static(path.resolve(global.appDir, "./view")));

app.listen(global.appConfig.port, function () {
  console.log("服务已启动port ：", global.appConfig.port);
});
