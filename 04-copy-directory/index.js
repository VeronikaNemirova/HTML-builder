const fs = require('fs');


async function copyDir(dirPath) {
    await fs.promises.rmdir(dirPath + '-copy', {recursive: true});
    const dir = await fs.promises.mkdir(dirPath + '-copy', {recursive: true});
    const files = await fs.promises.readdir(dirPath);
    for (const file of files) {
    copyFile(file, dirPath, dirPath + '-copy');
    }
    }
    
    function copyFile(filePath, oldDir, newDir) {
    const inputStream = fs.createReadStream(oldDir + '/' + filePath)
    const outputStream = fs.createWriteStream(newDir + '/' + filePath)
    
    inputStream.pipe(outputStream)
    }
    
    copyDir(__dirname + '/files');