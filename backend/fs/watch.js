const fs = require("fs");
fs.watch(
  "backend/copy",
  {
    recursive: true,
  },
  // 监听兼容性非常不好
  // 可以使用chokidar库替代监听
  (eventType, filename) => {
    console.log(`事件类型是: ${eventType}`);
    if (filename) {
      console.log(`提供的文件名: ${filename}`);
    } else {
      console.log("文件名未提供");
    }
  }
);
fs.watchFile("backend/copy/test.txt", (cur, prev) => {
  console.log(cur);
  console.log(prev);
});
