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

/* GET home page. */
exports.index = function(req, res){
	res.render('encrypt-index', { title: 'otp.sh' })
};

exports.encrypt = function(req, res) {
	var expireTime = process.env.EXPIRE_TIME || 7200;
	var sliceCount = process.env.SLICE_COUNT || -6;

	if(process.env.SITE_SECRET == undefined) {
		res.render('error', { message: 'blub', error: 'bla'})
		return
	}
	var siteSecret = process.env.SITE_SECRET
	encrypt(req.body.plain, siteSecret, function(ctext, password) {
		url = password.slice(0, sliceCount)
		otp = password.slice(sliceCount)
		db.set(url, ctext, function(err, reply) {
			if(err) {
				res.render('error')
				return
			}
			db.expire(url, expireTime)
			res.render('encrypt-result', { url: url, otp: otp })
		})
	})
};
