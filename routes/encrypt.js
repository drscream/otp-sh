var crypto = require('crypto')
var redis  = require("redis")
var db     = redis.createClient(6379, 'localhost', { return_buffers: true })

db.on("error", console.log)

function encrypt(data, siteSecret, cb) {
	var sha256 = crypto.createHash('sha256')
	sha256.update(siteSecret)
	sha256.update(data)
	
	var password = sha256.digest('hex')
	var cipher   = crypto.createCipher('AES-192-CBC', password)
	var ctext    = Buffer.concat([cipher.update(data), cipher.final()])

	cb(ctext, password)
}

exports.encrypt = function(req, res) {
	var expireTime = process.env.EXPIRE_TIME || 7200;
	var sliceCount = process.env.SLICE_COUNT || -6;

	if(process.env.SITE_SECRET == undefined) {
		res.json(500, { 'error': 'Environment variable SITE_SECRET required' })
		return
	}
	console.log(req.body)
	if(req.body.text == undefined) {
		res.json(510, { 'error': 'Missing POST parameter "text"' })
		return
	}

	var siteSecret = process.env.SITE_SECRET
	encrypt(req.body.text, siteSecret, function(ctext, password) {
		var hash = password.slice(0, sliceCount)
		var otp  = password.slice(sliceCount)
		var url  = req.protocol + '://' + req.headers.host + req.url + hash

		db.set(hash, ctext, function(err, reply) {
			if(err) {
				res.json(500, { 'error': 'Database insert error' })
				return
			}
			db.expire(hash, expireTime)
			res.json(200, { 'url': url, 'hash': hash, 'otp': otp })
		})
	})
};
