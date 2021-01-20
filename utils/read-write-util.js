const fs = require("fs");
const path = require("path");
const { COPYFILE_EXCL } = fs.constants;
// 将static文件夹内所有内容复制到copy文件夹内

// read("backend/static/", "backend/copy", (from, to) => {
//   write(from, to);
// });

// 递归读取文件内容 文件路径下的所有 文件内容
function read(from, to, callback) {
  fs.stat(from, (err, stats) => {
    if (err) {
      console.log(err.message);
    } else {
      let _from = path.resolve(from);
      if (stats.isFile()) {
        let _to = path.resolve(to);
        // write(_from, _to);
        callback(_from, _to);
      } else if (stats.isDirectory()) {
        fs.readdir(_from, (err, files) => {
          if (err) {
            throw err;
          }
          files.forEach(file => {
            let _path = path.join(_from, file);
            let _to = path.join(to, file);
            read(_path, _to, callback);
          });
        });
      } else {
        return;
      }
    }
  });
}

// 复制文件夹内所有文件
function write(from, to) {
  let tar = to.split(path.sep);
  // 移除最后一位
  tar.pop();
  let isEx = to => fs.existsSync(to);
  if (isEx(to)) {
    // 使用 fs copyfile
    fs.copyFile(
      from,
      to,
      /* 非强制拷贝 COPYFILE_EXCL, */ err => {
        if (err) {
          console.log(err.message);
        } else {
          console.log("复制成功");
        }
      }
    );
  } else {
    tar.forEach((s, i) => {
      let tp = tar.slice(0, i + 1).join(path.sep);
      isEx(tp) || fs.mkdirSync(tp);
    });
    // 使用流复制
    let rs = fs.createReadStream(from);
    let ws = fs.createWriteStream(to);
    console.log("流复制成功");
    rs.pipe(ws);
  }
}

module.exports = {
  read,
  write,
};
