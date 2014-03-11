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
- nginx or another webserver

All required node modules could be installed with `pip install`. The `redis`
server should be configured to disallow key storage on the disk.

## Crypto

```
          +                                                                              +
          |                                                                              |
          |                                      +---------+                             |
   user +-|-&gt; | plain | +----------------------&gt; | encrypt | +---&gt; | crypt txt | +----------&gt; db
          |                                      +---------+                             |
          |       +                                                                      |
          |       |                                    ^                     +--&gt;|url| +----&gt; email
          |       v                                    |                     |           |
          |                                            +                     |           |
          |     +---+            +------+                          +-------+ |           |
          |     | + |+---------&gt; | hash | +-------&gt; | key | +----&gt; | split |-+           |
          |     +---+            +------+                          +-------+ |           |
          |                                                                  |           |
          |       ^                                                          |           |
          |       |                                                          +--&gt;|otp| +----&gt; phone
          |       +                                                                      |
          |                                                                              |
          |   |site sec|                                                                 |
          |                                                                              |
          |                                                                              |
          +                                                                              +
```
