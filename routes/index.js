/* GET home page. */
exports.index = function(req, res){
	res.render('index', { title: 'otp.sh' })
};

exports.index.post = function(req, res) {
	console.log(req.body)
	res.render('index')
};
