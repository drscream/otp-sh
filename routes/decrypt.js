var crypto = require('crypto')
var redis  = require("redis")
var db     = redis.createClient(6379, 'localhost', { return_buffers: true })

db.on("error", console.log)

function decrypt(data, password, cb) {
	var decipher = crypto.createDecipher('AES-192-CBC', password)
	var plain = Buffer.concat([decipher.update(data), decipher.final()])

	return plain
}

exports.index = function(req, res) {
	console.log(req.params.hash)
	db.get(req.params.hash, function(err, reply){
		if(reply == null) {
			res.render('error', {
				message: 'Hash not found',
				error: 'asdf'
			})
			return
		}
		res.render('decrypt-index')
	})
};

exports.decrypt = function(req, res) {
	var password = req.params.hash+ req.body.otp
	
	db.get(req.params.hash, function(err, data) {
		console.log(password, data)
		try {
			plain = decrypt(data, password)
			res.render('decrypt-result', { plain: plain })
		} catch(err) {
			console.log(err)
			res.render('error', err)
		}
	})
}
