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

All required node modules could be installed with `npm install`. The `redis`
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

Install the node / npm requirements via `npm install`.

	cd /var/www/otp-sh
	npm install

You should run the API (the nodejs application) as user behind a ssl proxy server,
for example `nginx`. I also recommend to use two sub domains for the API and the
static content.

- api.otp.sh: the nodejs application
- www.otp.sh: static content from the `public` folder

Maybe you like to modify some settings in the static content.

	# Remove or replace the `otp.sh` url in line 34:
	public/index.html

	# Change the API URL in line 2:
	public/js/otp.js

You should create an extra user to run the API nodejs process.

	useradd -s /bin/false -b /var/www/otp-sh otp-sh

It depends on your OS how you like to start the node application. I'm using SMF
on SmartOS, you could follow this
[link](https://gist.github.com/drscream/9488029) for an example.

	wget -O otp-api.xml https://gist.githubusercontent.com/drscream/9488029/raw/7ac0c7c0944d0cd4002adca443bcd202bfe794b8/otp-api.xml
	svccfg import otp-api.xml

The following environment variables are available:

- `SITE_SECRET`: Required, should be a random secret
- `PORT`: Socket or port which the application should listen (default: 3000)
- `EXPIRE_TIME`: Redis key expire time (default: 7200 minutes)
- `SLICE_COUNT`: Slice count from the hash and otp (default: -6 chars)

Configure the `nginx` webserver to surve the API and the static content. Some
examples could be found also on [gist](https://gist.github.com/drscream/9488029).

	cd /opt/local/etc/nginx/
	
	# WARNING: this will replace your existing nginx.conf file
	wget -O nginx.conf https://gist.githubusercontent.com/drscream/9488029/raw/839e5324cabbfd5eb2af9ef9da1f091fbcf768e1/nginx.conf
	
	mkdir sites
	cd sites
	wget https://gist.githubusercontent.com/drscream/9488029/raw/644e3ce2caf86fdf007dce961f9abb31a658713f/01_www.conf
	wget https://gist.githubusercontent.com/drscream/9488029/raw/bc2a73b2a3b975280713e51d26b3b51842ba7b32/02_api.conf

Use SSL and place your certificates in `/opt/local/nginx/ssl`.

That's it :-)

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

