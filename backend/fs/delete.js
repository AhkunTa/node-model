const fs = require("fs");
const path = require("path");
function del(from, callback) {
  let _from = path.resolve(from);
  if (fs.existsSync(_from)) {
    if (fs.statSync(_from).isDirectory()) {
      let files = fs.readdirSync(_from);
      files.forEach(file => {
        let _path = path.join(_from, file);
        console.log(_path);
        if (fs.statSync(_path).isDirectory()) {
          del(_path);
        } else {
          fs.unlinkSync(_path);
        }
      });
      fs.rmdirSync(_from);
    } else {
      fs.unlinkSync(_from);
    }
  } else {
    console.log("文件夹不存在");
  }
}

// 删除copy路径下的所有文件
del("backend/copy");
