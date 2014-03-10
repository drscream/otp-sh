var crypto = require('crypto')
var redis  = require("redis")
var db     = redis.createClient()

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
	res.render('index', { title: 'otp.sh' })
};

exports.index.post = function(req, res) {
	if(process.env.SITE_SECRET == undefined) {
		res.render('error', { message: 'blub', error: 'bla'})
		return
	}
	var siteSecret = process.env.SITE_SECRET
	encrypt(req.body.plain, siteSecret, function(ctext, password) {
		url = password.slice(0, -4)
		otp = password.slice(-4)
		db.set(url, ctext, function(err, reply) {
			if(err) {
				res.render('error')
				return
			}
			db.expire(url, 1)
			res.render('index-result', { url: url, otp: otp })
		})
	})
};
