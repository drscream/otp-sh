var crypto = require('crypto')
var redis  = require("redis")
var db     = redis.createClient(6379, 'localhost', { return_buffers: true })

db.on("error", console.log)

function decrypt(data, password, cb) {
	var decipher = crypto.createDecipher('AES-192-CBC', password)
	var plain = Buffer.concat([decipher.update(data), decipher.final()])
	return plain
}

exports.exists = function(req, res) {
	db.get(req.params.hash, function(err, reply){
		if(reply == null) {
			res.json(404, { 'error': 'Hash not found' })
			return
		}
		res.json(200, { 'message': 'Hash found' })
	})
};

exports.decrypt = function(req, res) {
	var password = req.params.hash + req.body.otp

	db.get(req.params.hash, function(err, data) {
		try {
			plain = decrypt(data, password)
			db.del(req.params.hash)
			res.json(200, { 'text': plain.toString('utf-8') })
		} catch(err) {
			res.json(403, { 'error': 'Decrypt not possible' })
		}
	})
}
