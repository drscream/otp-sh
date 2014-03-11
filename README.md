# otp-sh

`otp-sh` is a small web application that provide you with the possibility to
share secrets with an hash and one time password. It's only build as
a workaround for users that are not able to use `pgp` or other crypto methods.

I created this application because sometimes I had to share a username and
password with persons that didn't use `pgp` or `smime` for an email
communication. So I mail an `otp-sh` link and tell them the one time password
on the phone.

Please note this isn't 100% secure! The administrator of the web server is able
to jump into the connection from client to the server.

## Requirement

- nodejs
- redis
- nginx or another webserver with ssl support
- hiredis (optional)

All required node modules could be installed with `pip install`. The `redis`
server should be configured to disallow key storage on the disk.

## Installation and usage

I'm using SmartOS do deploy this service, but this should also work on different
operating systems as well.

Install the requirements first with your lovely package manager. The installation
of `hiredis` improve the performance for the nodejs redis module.

	pkgin install nodejs redis nginx

Configure `redis` to save the data only in memory.

	# Remove or comment the `save` options
	vim /opt/local/etc/redis.conf
	
	# Use `sed` instead of `vim``
	sed -i 's:^save:#save:g' /opt/local/etc/redis.conf

Clone the repository for example into `/var/www`.

	cd /var/www
	git clone https://github.com/drscream/otp-sh.git

You should run the API (the nodejs application) as user behind a ssl proxy server,
for example `nginx`. I also recommend to use two sub domains for the API and the
static content.

- api.otp.sh: the nodejs application
- www.otp.sh: static content from the `public` folder



## Crypto

<pre>
       +                                                                       +
       |                                                                       |
       |                                +---------+                            |
user +-|-&gt; | plain | +----------------&gt; | encrypt | +----&gt; | crypt txt | +--------&gt; db
       |                                +---------+                            |
       |       +                                                               |
       |       |                              ^                    +--&gt;|url| +----&gt; email
       |       v                              |                    |           |
       |                                      +                    |           |
       |     +---+        +------+                       +-------+ |           |
       |     | + |+-----&gt; | hash | +-----&gt; | key | +---&gt; | split |-+           |
       |     +---+        +------+                       +-------+ |           |
       |                                                           |           |
       |       ^                                                   |           |
       |       |                                                   +--&gt;|otp| +----&gt; phone
       |       +                                                               |
       |                                                                       |
       |   |site sec|                                                          |
       |                                                                       |
       |                                                                       |
       +                                                                       +</pre>

