/**
 * 跳转到定义
 */
const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

/**
 * 查找文件定义的provider，匹配到了就return一个location，否则不做处理
 * 最终效果是，当按住Ctrl键时，如果return了一个location，字符串就会变成一个可以点击的链接，否则无任何效果
 * @param {*} document 
 * @param {*} position 
 * @param {*} token 
 */
function provideDefinition(document, position, token) {
    const fileName    = document.fileName;
    const workDir     = path.dirname(fileName);
    const word        = document.getText(document.getWordRangeAtPosition(position));
    const line        = document.lineAt(position);

    console.log('====== 进入 provideDefinition 方法 ======');
    console.log('fileName: ' + fileName); // 当前文件完整路径
    console.log('workDir: ' + workDir); // 当前文件所在目录
    console.log('word: ' + word); // 当前光标所在单词
    console.log('line: ' + line.text); // 当前光标所在行
    // if(/^require[\s+]$/.test(line.text.replace(/"| /g, ''))){
    if(/^require\s/.test(line.text)){
        let wordFile = word.split('.')[0];
        let destPath = `${workDir}/${wordFile}.lua`;
        if(fs.existsSync(destPath)){
            return new vscode.Location(vscode.Uri.file(destPath), new vscode.Position(0, 0));
        }
    }
   
}

module.exports = function(context) {
    // 注册如何实现跳转到定义，第一个参数表示仅对lua文件生效
    context.subscriptions.push(vscode.languages.registerDefinitionProvider({scheme:'file',language:'lua'}, {
        provideDefinition
    }));
};