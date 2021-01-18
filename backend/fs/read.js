const fs = require("fs");
const { write, openSync, readFileSync } = require("fs");
const path = require("path");

// 递归读取文件内容 文件路径下的所有 文件夹或文件内容
function read(url) {
  if (!fs.existsSync(url)) {
    console.log("地址无文件");
  }
  let readPath = path.resolve(url);
  let states = fs.statSync(readPath);
  if (states.isFile()) {
    fs.readFile(
      readPath,
      {
        encoding: "utf8",
        flag: "r",
      },
      (err, data) => {
        if (err) throw err;
        console.log(data);
      }
    );
  } else if (states.isDirectory()) {
    fs.readdir(readPath, (err, files) => {
      if (err) {
        throw err;
      }
      files.forEach(file => {
        let _path = path.join(readPath, file);
        read(_path);
      });
    });
  } else {
    return;
  }
}

// read("../static/");

const rs = fs.createReadStream("backend/static/testRead.txt", {
  encoding: "utf-8",
  // flags: "r", // 文件的操作方式，同readFile中的配置一样，这里默认是可读的是 r
  highWaterMark: 32, // 每次读取的个数 设定此项时 后续监听触发data事件
});
rs.on("open", () => {
  console.log("开始读取文件");
});
// 当文件很大时 使用readStream 会将文件分多次存入缓存中
// 读取数据也会分多次进行
rs.on("data", data => {
  console.log("读取到的数据");
  console.log(data.toString());
});
rs.on("end", () => {
  console.log("文件全部读取完毕");
});

rs.on("close", () => {
  console.log("文件被关闭");
});

rs.on("error", err => {
  console.log(err);
});

rs.on("readable", () => {
  console.log("开始 readable");
  // rs.read 后会触发 data事件
  console.log(rs.read());
});
