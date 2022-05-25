const fs = require("fs");
const path = require("path");

async function copyDir(dirPath, newDirPath) {
    const dir = await fs.promises.mkdir(newDirPath, {
        recursive: true
    });
    const files = await fs.promises.readdir(dirPath);
    for (const file of files) {
        fs.stat(dirPath + "/" + file, (err, stats) => {
            if (stats.isDirectory()) {
                copyDir(dirPath + "/" + file, newDirPath + "/" + file);
            } else {
                copyFile(file, dirPath, newDirPath);
            }
        });
    }
}

async function copyFile(filePath, oldDir, newDir) {
    const inputStream = fs.createReadStream(oldDir + "/" + filePath);
    const outputStream = fs.createWriteStream(newDir + "/" + filePath);

    await inputStream.pipe(outputStream);
    createHtml();
    streamMerge(__dirname + "/styles", __dirname + "/project-dist/style.css");
}

copyDir(__dirname + "/assets", __dirname + "/project-dist/assets");

async function streamMerge(sourceFiles, targetFile) {
    const styles = await fs.promises.readdir(path.resolve(__dirname, sourceFiles));
    const fileWriteStream = fs.createWriteStream(
        path.resolve(__dirname, targetFile)
    );

    streamMergeRecursive(styles, fileWriteStream);
}

function streamMergeRecursive(styles = [], fileWriteStream) {
    const currentFile = __dirname + "/styles/" + styles.shift();
    if (path.extname(currentFile) === ".css") {
        const currentReadStream = fs.createReadStream(currentFile);

        currentReadStream.pipe(fileWriteStream, {
            end: false
        });
        currentReadStream.on("end", function () {
            streamMergeRecursive(styles, fileWriteStream);
        });

        currentReadStream.on("error", function (error) {
            console.error(error);
            fileWriteStream.close();
        });
    }
}



function componentsMergeRecursive(files = [], chunk, writableStream) {
    const currentFile = __dirname + "/components/" + files.shift();
    if (path.extname(currentFile) === ".html") {
        const currentReadStream = fs.createReadStream(currentFile, "utf8");

        currentReadStream.on("data", function (data) {
            chunk = chunk.replace(
                `{{${path.parse(currentFile).base.split(".")[0]}}}`,
                data
            );
        });
        currentReadStream.on("end", function () {
            if (files.length) {
                componentsMergeRecursive(files, chunk, writableStream);
            } else {
                writableStream.write(chunk);
            }
        });

        currentReadStream.on("error", function (error) {
            console.error(error);
            writableStream.close();
        });
    }
}

async function createHtml() {
    const writableStream = fs.createWriteStream(
        __dirname + "/project-dist/index.html"
    );
    const inputStream = fs.createReadStream(__dirname + "/template.html", "utf8");
    inputStream.on("data", async (chunk) => {
        const files = await fs.promises.readdir(__dirname + "/components");
        componentsMergeRecursive(files, chunk, writableStream);
    });
}

