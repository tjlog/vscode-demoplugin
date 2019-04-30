var fs = require('fs');
var path = require('path');

let Utils = class {
    constructor() {

    }

    /**
     * @param {any} document
     */
    static getProjectPath(document) {

        console.log(document);
        return process.cwd();

    }

    /**
 * 文件遍历方法
 * @param filePath 需要遍历的文件路径
 */
    static fileDisplay(filePath, filenameRex, callback) {
        //根据文件路径读取文件，返回文件列表
        var findFlag = false;
        fs.readdir(filePath, function (err, files) {
            if (err) {
                console.warn(err);
                callback && callback(false, err);
            } else {
                //遍历读取到的文件列表
                files.some(function (filename) {
                    //获取当前文件的绝对路径
                    var filedir = path.join(filePath, filename);
                    if (findFlag) return true;
                    //根据文件路径获取文件信息，返回一个fs.Stats对象
                    fs.stat(filedir, function (eror, stats) {
                        if (eror) {
                            console.warn('获取文件stats失败');
                        } else {
                            var isFile = stats.isFile();//是文件
                            var isDir = stats.isDirectory();//是文件夹
                            if (isFile) {
                                // console.log(filedir);
                                var filenameA = filename.split('.')[0];
                                if (filenameRex && filenameRex.test(filenameA)) {//找到文件
                                    callback && callback(true, filedir);
                                    findFlag = true;
                                }
                            }
                            if (isDir) {
                                this.fileDisplay(filedir, filenameRex, callback);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
                            }
                        }
                    })
                    return false;
                });
            }
        });
    }

    /**
     * 文件目录操作 根据地址读取文件
     * @returns {Promise} Promise(resolve(string[filename]), reject(string:err))
     * @param {*} path 
     */
    static readPath(path) {
        return new Promise((resolve, reject) => {
            fs.readdir(path, function (err, files) {
                if (err) {
                    return reject(err);
                } else {
                    return resolve(files);
                }
            });
        });
    }

    // 读文件的方法
    static readFile(filePath) {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    return reject(err)
                }
                resolve(data)
            })
        });
    }

    // 获取文件状态
    static stat(filePath) {
        return new Promise((resolve, reject) => {
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    return reject(err)
                }
                resolve(stats)
            })
        })
    }


}


module.exports = Utils