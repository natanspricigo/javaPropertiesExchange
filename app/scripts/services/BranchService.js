const branch = require('git-branch');

module.exports.getBranch = function(dir) {
	try {
		return branch.sync(dir);
	} catch (e) {
		console.log(e);
	}
	return "";
}