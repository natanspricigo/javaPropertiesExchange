fs = require('fs');

module.exports.fileService = function () {

    return {
        encoding: 'utf8',
        isFile: function (path, onExist, onNotFound) {
            fs.stat(path, function (err, fileStat) {
                if (err) {
                    console.log('ERR: ');
                    if (err.code == 'ENOENT') {
                        console.log('File %s Does not exist.', path);
                    }
                    onNotFound(err, path);
                } else {
                    onExist(fileStat, path);
                }
            });
        },
        read: function (path, onRead) {
            fs.readFile(path, this.encoding, function (err, fileContents) {
                if (err) throw err;
                if (typeof onRead == 'function') {
                    onRead(fileContents, err);
                } else {
                    console.log(fileContents);
                }
            });
        },
        readFiles: function (dirname, onFileContent, onError) {
            fs.readdir(dirname, function (err, filenames) {
                if (err) {
                    onError(err);
                    return;
                }
                filenames.forEach(function (filename) {
                    fs.readFile(dirname + filename, this.encoding, function (err, content) {
                        if (err) {
                            onError(err);
                            return;
                        }
                        onFileContent(filename, content);
                    });
                });
            });
        },
        write: function (path, data, onComplete) {
            fs.writeFile(path, data, {
                encoding: this.encoding
            }, function (err) {
                onComplete(err);
            });
        },
        clear: function (path, onComplete) {
            this.write(path, "", onComplete);
        }
    }
}();
