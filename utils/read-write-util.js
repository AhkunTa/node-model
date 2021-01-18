const fs = require("fs");
const path = require("path");
const { COPYFILE_EXCL } = fs.constants;
read("backend/static/", "backend/copy");

// 递归读取文件内容 文件路径下的所有 文件夹或文件内容
function read(from, to, callback) {
  if (!fs.existsSync(from)) {
    console.log("地址无文件");
  }

  fs.stat(from, (err, stats) => {
    if (err) {
      console.log(err.message);
    } else {
      let _from = path.resolve(from);
      if (stats.isFile()) {
        let _to = path.resolve(to);
        write(_from, _to);
      } else if (stats.isDirectory()) {
        fs.readdir(_from, (err, files) => {
          if (err) {
            throw err;
          }
          files.forEach(file => {
            let _path = path.join(_from, file);
            let _to = path.join(to, file);
            read(_path, _to);
            // console.log(_to, _from);
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
  tar.pop();
  // let state = fs.statSync(to);
  // if (!state.isDirectory()) {
  // }
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
    // 使用流的方法需要指定编码方式 当编码方式发生改变可能会错误
    let rs = fs.createReadStream(from);
    let ws = fs.createWriteStream(to);
    console.log("流复制", to);
    rs.pipe(ws);
  }
}
