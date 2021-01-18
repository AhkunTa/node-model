const fs = require("fs");
const { write, openSync, readFileSync } = require("fs");

// 写文件操作 fd 为open打开的返回值 也可以写成这样
// 当不等待write回调 使用write是不安全的 需使用writestream
// 需同步打开文件获取fd
// let fd = fs.openSync("../static/testWrite.txt", "r+");
// write(fd, "111111111111111", "utf-8", (err, bytesWritten, buffer) => {
//   if (err) throw err;
//   console.log(readFileSync("../static/testWrite.txt", "utf8"));
// });
// fs.open("../static/testWrite.txt", "r+", (err, fd) => {
//   if (err) {
//     return;
//   }
//   write(fd, "123123", "utf-8", (err, bytesWritten, buffer) => {
//     if (err) throw err;
//     console.log(readFileSync("../static/testWrite.txt", "utf8"));
//   });
// });

// 使用writestream
const ws = fs.createWriteStream("../static/testWrite.txt", {
  flags: "w",
  encoding: "utf-8",
});

for (let i = 0; i < 10000; i++) {
  ws.write(
    `测试数据 很长很长的测试数据${i}\r\n`,
    "utf-8",
    (err, written, string) => {
      // console.log(err, written, string);
    }
  );
}

// 拷贝所有文件到目的地址
function copy(to) {}
