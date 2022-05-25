const fs = require('fs');
const path = require('path');

async function streamMerge(sourceFiles, targetFile) {
    const styles = await fs.promises.readdir(path.resolve(__dirname, sourceFiles));
    const fileWriteStream = fs.createWriteStream(path.resolve(__dirname, targetFile));
    
    streamMergeRecursive(styles, fileWriteStream);
    }
    
    function streamMergeRecursive(styles=[], fileWriteStream) {
    const currentFile = path.resolve(__dirname, 'styles/', styles.shift());
    if(path.extname(currentFile) === '.css') {
    const currentReadStream = fs.createReadStream(currentFile);
    
    currentReadStream.pipe(fileWriteStream, {end: false });
    currentReadStream.on('end', function() {
    streamMergeRecursive(styles, fileWriteStream);
    });
    
    currentReadStream.on('error', function(error) {
    console.error(error);
    fileWriteStream.close();
    });
    }
    }
    
    streamMerge(__dirname + '/styles',__dirname + '/project-dist/bundle.css');