import fs from 'fs';
import request from 'request';

// 创建文件夹
export function mkdir(pos, dirArray, _callback) {
  const len = dirArray.length;
  console.log(len);
  if (pos >= len || pos > 10) {
    _callback();
    return;
  }
  let currentDir = '';
  for (let i = 0; i <= pos; i++) {
    if (i != 0)currentDir += '/';
    currentDir += dirArray[i];
  }
  fs.exists(currentDir, (exists) => {
    if (!exists) {
      fs.mkdir(currentDir, (err) => {
        if (err) {
          console.log('创建文件夹出错！');
        } else {
          console.log(`${currentDir}文件夹-创建成功！`);
          mkdir(pos + 1, dirArray, _callback);
        }
      });
    } else {
      console.log(`${currentDir}文件夹-已存在！`);
      mkdir(pos + 1, dirArray, _callback);
    }
  });
}

// 创建目录结构
export function mkdirs(dirpath, _callback) {
  const dirArray = dirpath.split('/');
  fs.exists(dirpath, (exists) => {
    if (!exists) {
      mkdir(0, dirArray, () => {
        console.log(`已创建路径：${dirpath}`);
        _callback();
      });
    } else {
    //   console.log('文件夹已经存在!准备写入文件!');
      _callback();
    }
  });
}

export const checkPath = dirpath => new Promise((resolve, reject) => {
  mkdirs(dirpath, resolve);
});


export const readFile = (path, type = 'utf8') => new Promise((resolve, reject) => {
  fs.readFile(path, type, (err, data) => {
    if (err) reject(err);
    resolve(data);
  });
});


/**
 * [saveFileWithStream description]
 * @param {String} filePath [文件路径]
 * @param {Buffer} readData [Buffer 数据]
 */

export function saveFile(filePath, fileData) {
  return new Promise((resolve, reject) => {
    // 块方式写入文件
    const wstream = fs.createWriteStream(filePath);

    wstream.on('open', () => {
      const blockSize = 128;
      const nbBlocks = Math.ceil(fileData.length / (blockSize));
      for (let i = 0; i < nbBlocks; i += 1) {
        const currentBlock = fileData.slice(
          blockSize * i,
          Math.min(blockSize * (i + 1), fileData.length),
        );
        wstream.write(currentBlock);
      }

      wstream.end();
    });
    wstream.on('error', (err) => { reject(err); });
    wstream.on('finish', () => { resolve(true); });
  });
}


export function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    // 块方式写入文件
    const ws = fs.createWriteStream(filepath);
    ws.on('open', () => {
      console.log('下载：', url, filepath);
    });
    ws.on('error', (err) => {
      console.log('出错：', url, filepath);
      reject(err);
    });
    ws.on('finish', () => {
      console.log('完成：', url, filepath);
      resolve(true);
    });
    request(url).pipe(ws);
  });
}
