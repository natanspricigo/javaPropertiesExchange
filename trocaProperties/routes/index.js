/*
 * GET home page.
 */

exports.index = function(req, res, params) {
	res.render('index', params);
};