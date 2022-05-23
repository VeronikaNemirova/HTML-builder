const fs = require('fs');
const path = require('path');

const readSecretDir = async (filePath) => {
    try {
        const files = await fs.promises.readdir(filePath, {
            withFileTypes: true
        });

        for (const file of files) {
            fs.stat(filePath + '/' + file.name, (err, stats) => {
                if (stats.isDirectory()) {
                    readSecretDir(filePath + '/' + file.name)
                } else {
                    const fileName = file.name.split('.')[0] ? file.name.split('.')[0] : file.name;
                    console.log(fileName + ' ' + path.extname(file.name) + ' ' + stats.size + 'b')
                }
            });
            
        }
    } catch (err) {
        console.error(err);
    }
}

readSecretDir(__dirname + '/secret-folder');

// fs.readdir(__dirname, 'secret-folder', {withFileTypes: true}, (err, files) => {
//     if (err) throw err;

//     files.forEach(file => {
//         console.log(file.isDirectory());
//     });
// })
// try {
// const files = fs.promises.readdir(path.join( __dirname, 'secret-folder', {withFileTypes: true}))

// for (const file of files)
// console.log(file);
// } catch (err) {
// console.error(err);
// }