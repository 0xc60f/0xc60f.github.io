---
published: 2025-03-27
title: How I set up my own private, password-protected Nitter instance with Nginx
draft: false
tags: [nitter, self-hosting, oracle]
category: Highlights
ogImage: ""
description: I recount the long, but not complicated, steps needed to fully set up Nitter, an awesome alternative Twitter frontend.
---

# Setting up Nitter with Nginx
Twitter used to be a good website, although it always had the issues that come with a social media platform. However, in recent years, Twitter has become a cesspool of ads, tracking, and censorship. 
I recently discovered [Nitter](https://github.com/zedeus/nitter), a Twitter frontend that strips away all the tracking and ads, and I wanted to set up my own instance of it.
However, setting it up quickly became a much bigger project than I anticipated. Here's how I did it.

## Table of Contents

## What is Nitter?
Nitter is a free and open-source alternative Twitter frontend that strips away all the tracking and ads. It's a great way to use Twitter without all the bloat that comes with it.
However, there were also a couple of reasons why I wanted to set up my own instance of Nitter, instead of just browsing a public instance:

1. **RSS**: I need to track the tweets of some official game accounts to post in a server, but Twitter's API is expensive and the existing bots are either unreliable or expensive. 
Nitter can generate an RSS feed for any public account, which is very useful. However, most public instances don't have this feature enabled to prevent scraping, and speaking of scraping,
2. **Scraping**: I don't want to scrape a public instance, as it's not only rude but also unreliable. I don't want to rely on a public instance for my needs, as it could go down at any time.
This is also why I set up Nginx, to prevent scraping and to have a password-protected instance that only me and people I want to give access to can use.
3. **Data Control**: This is minor, but it's nice to have control over my own data. I don't want to rely on a public instance for my needs, as it could go down at any time.
It also means that I can customize the instance to my liking, such as adding custom CSS or adding more integration with other services.

With these reasons in mind, I set out to set up my own instance of Nitter.

## Why don't you like Twitter?

<center>
<img alt="no-more-twitter.jpg" src="/setting-up-nitter-with-nginx/no-more-twitter.jpg"/>
</center>


<div style="text-align: center;"><i>I hope I don't need to explain further</i></div>

But regardless of who owns Twitter, the site has become very unfriendly when it comes to preserving privacy, 
offering good tools for developers, and providing a good user experience. Because of that, Nitter became a great alternative for me.

### What DIDN'T work
Before I go into what DID work, I'll talk briefly about what didn't work for me.

I wanted to use an all-in-one Docker container with a great [guide by sekai-soft](https://github.com/sekai-soft/guide-nitter-self-hosting).
However, I faced 2 main issues that caused me to pivot and set up Nginx myself:

1. **Frequent Crashes**: The forked instance of Nitter had somee improvements, but there were quite a few issues that were fixed in stock Nitter that caused
constant 523 errors. This would also result in times where there were no users or tweets would be found, even if they existed.
2. **No Audio on Videos**: This wasn't the biggest issue, but it was pretty annoying. From what I could reason from my testing, the proxying of the video
would cause the audio to be stripped from the video, which was a dealbreaker for me. It would also break completely if you turned off proxying video,
but even nitter.net has issues when you don't proxy videos, so that might be an issue related to how Nitter pulls videos from Twitter and sends it to the client.

## Setting up Nitter
I decided to set up Nitter using the official Docker image, and then set up Nginx to proxy requests to the Nitter instance.

### Prerequisites

To set up Nitter, you'll need:

- A Linux server (512 MB of RAM, 1 vCPU)
  - I used an Oracle Cloud Micro VM with Ubuntu 24.04, which is free and has enough resources to run Nitter (I'll explain in a future post how I got an Oracle account, it'll make sense later)
  - You can also use a Raspberry Pi, a VPS, or your own computer, but it should have enough to run Nitter
  - Storage isn't really an issue with Nitter due to how it functions, but 20 GB of storage should be more than enough
- [Docker installed on the server](https://docs.docker.com/engine/install/ubuntu/)
- Port 80 and 443 open on the server, you'll receive connections on these ports
- A burner Twitter account WITHOUT 2FA (you can use 2FA, but it makes deployment more complicated)
- Your own domain (optional, but highly recommended)

### Installing Nitter's Docker Image

First, make a new folder called `nitter` in your home directory, and navigate to it:

```bash
mkdir -p nitter && cd nitter
```

Next, use the [docker-compose.yml file](https://github.com/zedeus/nitter/blob/master/docker-compose.yml) from the Nitter repository to set up the Docker container:

```bash
nano docker-compose.yml
```

One line I do recommend changing is the healthcheck test line, which is, by default, set as:

```yaml
test: wget -nv --tries=1 --spider http://127.0.0.1:8080/Jack/status/20 || exit 1
```

This can throw errors, so I have it set up as:
```yaml
test: wget -nv --tries=1 --spider http://127.0.0.1:8080 || exit 1
```
This just tests the homepage to make sure it's alive, so it does the job fine.
Another line I'd recommend changing for now is changing the "ports" line to `8080:8080`. This is so that we can publicly access it
for testing. We'll change it back to `127.0.0.1:8080:8080` once we set up a reverse proxy with Nginx.

Next, you'll want to take your Twitter account's credentials and insert them in [the linked sh file](https://gist.github.com/0xc60f/bc59673856db0bbc97059b764a71438f.js).
You can look in the code and check them to make sure your credentials are safe, but it just logs into Twitter by making API calls and getting the authorization token.
This is how the top of the file should look like.

```python
username="yourusername"
password="yourpassword"

# Rest of code
```

Once you've done that, run ```./twitter-auth.sh``` to get the token; if everything goes right, you should see something like this:
_You may need to run `chmod +x twitter-auth.sh` in order for the file to be runnable._

```bash
{"oauth_token":"xxxxxxxxxx-xxxxxxxxx","oauth_token_secret":"xxxxxxxxxxxxxxxxxxxxx"}
```

Make a new file called `sessions.jsonl` in the current folder and paste the result in it. You can change the username and password
for multiple accounts; in fact, I recommend making 2 or 3 accounts in case one account can't fetch a tweet.

You might get a few errors when running the above script, so here are some common troubleshooting steps.

- Check if 2FA is turned on, and turn it off if it is
- Log into your burner account through a web browser and see if your account got flagged by its anti-bot system; if so, verify your email
and complete the captch
- If all else fails, make a new burner account and try again

Once you have `sessions.jsonl` set up, the last file you'll need is [nitter.conf](https://github.com/zedeus/nitter/blob/master/nitter.example.conf), which is what Nitter uses to determine settings and what ports to run on.
Make sure to edit settings like the hostname and proxying videos to configure it to your needs.
If you're using docker-compose to set up Nitter, make sure you change the Redis server to nitter-redis, or else the container won't function properly.

Once you have all the files set up, you can run the Docker container with:

```bash
docker compose up -d
```

If all goes well, you should see the container running at http://yourserverip:8080.

Go to your instance and make sure everything is working as expected. If you see any issues, check the logs with:

```bash
docker compose logs
```

Now, we'll set up Nginx to proxy requests to the Nitter instance.

### Setting up Nginx
First, install Nginx on your server:

```bash
sudo apt update && sudo apt install nginx
```

Next, navigate to the Nginx configuration folder:

```bash
cd /etc/nginx/sites-available
```

Create a new file called `nitter`:

```bash
sudo nano nitter
```
_You may need to use `sudo` to edit the file._

Linked below is my configuration file for Nginx, which sets up a password-protected instance of Nitter and proxies requests to the Nitter instance.
This also makes a custom password for RSS, which I've hardcoded for simplicity, but you should (and I should) change it to pull from the password file we'll create.

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        auth_basic "Restricted Access";
        auth_basic_user_file /etc/nginx/.htpasswd;
        proxy_pass http://127.0.0.1:8080;
    }

    location ~* /rss$ {
        if ($arg_key != YOURPASSWORD) {
            return 200 '';
        }
        proxy_pass http://127.0.0.1:8080;
    }
    location /pic/ { proxy_pass http://localhost:8080; }
    location /video/ { proxy_pass http://localhost:8080; }

    location /css/ { proxy_pass http://localhost:8080; }

    location /js/ { proxy_pass http://localhost:8080; }
    location /fonts/ { proxy_pass http://localhost:8080; }
    location = /apple-touch-icon.png { proxy_pass http://localhost:8080; }
    location = /apple-touch-icon-precomposed.png { proxy_pass http://localhost:8080; }
    location = /android-chrome-192x192.png { proxy_pass http://localhost:8080; }
    location = /favicon-32x32.png { proxy_pass http://localhost:8080; }
    location = /favicon-16x16.png { proxy_pass http://localhost:8080; }
    location = /favicon.ico { proxy_pass http://localhost:8080; }
    location = /logo.png { proxy_pass http://localhost:8080; }
    location = /site.webmanifest { proxy_pass http://localhost:8080; }
}
```
Once you've done that, test the configuration file with:

```bash
sudo nginx -t
```

If it works, great! Now, we'll need to make a password file for Nginx to use.

### Setting up a password
First, install `apache2-utils` to use the `htpasswd` command:

```bash
sudo apt install apache2-utils
```

Next, create a password file for Nginx to use:

```bash
sudo htpasswd -c /etc/nginx/.htpasswd yourusername
```
_If you already have a password file, don't use the `-c` flag._

It'll ask you to enter a password, and then confirm it. Once you've done that, you can test Nginx again with:

```bash
sudo nginx -t
```
Now, we can set up systemd to run Nginx as a service.


### Setting up a systemd service
First, check to make sure Nginx isn't already running:

```bash
sudo systemctl status nginx
```
If it is, run

```bash
sudo systemctl restart nginx
```
and you're done. If it's not running, run

```bash
sudo systemctl enable nginx
&& sudo systemctl restart nginx
```
to apply your changes!

The last thing we'll need to do is to move the nitter file to nginx's running directory

Run this command
```bash
sudo ln -s /etc/nginx/sites-available/nitter /etc/nginx/sites-enabled/
```

Now, Nitter should be running on your server, and you should be able to access it at http://yourdomain.com.
It'll ask you for a username and password, and once you enter it, you should be able to access your Nitter instance.
To access an RSS feed, go to http://yourdomain.com/user/rss?key=YOURPASSWORD, where `YOURPASSWORD` is the password you set in the Nginx configuration file.
## Conclusion
This was no easy task, as it took me countless hours, a lot of ChatGPT and Stack Overflow, and some discussion on
the Nitter Matrix instance, but I finally managed to get it working. This was certainly one of the most rewarding projects I've done,
and now I can relax like Thanos.
<iframe width="560" height="315" src="https://www.youtube.com/embed/nNozSVqbpeI?si=Uqfi90-Hhm9_3Z0p" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<div style="text-align: center;"><i>I'm exaggerating here, but I struggled quite a bit, so it was nice when all the puzzle pieces fit together.</i></div>
