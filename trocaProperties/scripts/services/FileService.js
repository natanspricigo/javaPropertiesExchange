fs = require('fs');

module.exports.fileService = function() {
	return {
		isFile: function(path, onExist, onNotFound) {
			fs.stat(path, function(err, fileStat) {
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
		read: function(path, onRead) {
			fs.readFile(path, 'utf8', function(err, fileContents) {
				if (err) throw err;
				console.log(fileContents);
				if (typeof onRead == 'function') {
					onRead(fileContents, err);
				} else {
					console.log(fileContents);
				}
			});

		},
		readFiles: function(dirname, onFileContent, onError) {
			fs.readdir(dirname, function(err, filenames) {
				if (err) {
					onError(err);
					return;
				}
				filenames.forEach(function(filename) {
					fs.readFile(dirname + filename, 'utf-8', function(err, content) {
						if (err) {
							onError(err);
							return;
						}
						onFileContent(filename, content);
					});
				});
			});
		},
		createIfNotExists: function(path, data, onComplete){
			fs.writeFile(path, data, { flag: 'wx' }, function (err) {
			    if (err) throw err;
			    onComplete(err);
			});
		}
	}
}();