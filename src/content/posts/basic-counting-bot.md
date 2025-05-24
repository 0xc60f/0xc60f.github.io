---
published: 2023-07-29
title: Counting Bot with Discord.py
draft: false
tags: [discord.py, projects]
category: programming
image: ""
description: How to make a basic counting bot with discord.py.
---

I've seen [Discord bots](https://top.gg/bot/510016054391734273) that can create counting streaks, but I wanted to make my own just because
I wanted to challenge myself. So today, I'm going to show you how to make a basic counting bot with discord.py.

## Table Of Contents

## Prerequisites

To start off, you'll need to have a few things installed:

- [Python 3.8+](https://www.python.org/downloads/)
- [discord.py](https://discordpy.readthedocs.io/en/latest/intro.html#installing)
  - I should add that I used pycord in my example, and while the 2 libraries do have differences, they are the same for the purposes of this tutorial
- [Git](https://git-scm.com/downloads)
- [Visual Studio Code](https://code.visualstudio.com/download)
  - Any other python IDE works fine as well, I use [PyCharm](https://www.jetbrains.com/pycharm/download/)
- A Discord bot set up, you can follow [this tutorial](https://discordpy.readthedocs.io/en/latest/discord.html) to set one up
- A Discord server to test the bot in (you can make one by clicking the "+" button in the Discord app)

## Setup

Once you have all the prerequisites installed, you can start setting up your bot. First, you'll need to setup a repository for your bot. You can do this by running the following command in your terminal
(make sure you do this in your bot's folder):

```bash
git init
```

Next, you'll need to create a file called `main.py` in your bot's folder. This is where all of your bot's code will go. You can do this by running the following command in your terminal or by creating a new file in your IDE:

Now that you have your bot's folder setup, you can start coding your bot. First, you'll need to import the discord.py library. You can do this by adding the following line to the top of your `main.py` file:

```python
import discord
```

In addition, we'll need to import Discord's commands library to process reading messages and sending messages. We also need to add the datetime library (keep this in mind). You can do this by adding the following line to your `main.py` file:

```python
from discord.ext import commands
import datetime
```

You'll need to enable intents for your bot so that it can track messages. You can do this by adding the following line to your `main.py` file
(I've allowed all intents in this example, but you can change this if you don't want to allow certain intents):

YOU MUST ENABLE MESSAGE INTENTS FOR THIS BOT TO WORK (you can do this in the [Discord Developer Portal](https://discord.com/developers/applications)))

```python
intents = discord.Intents.all()
```

Once intents are enabled, you can create your bot's client. This is how your code will interact with Discord. You can do this by adding the following line to your `main.py` file:

```python
bot = discord.Bot(intents=intents)
```

## Counting Messages

Now that we've set up everything, it's time to start counting!. First, we'll need to declare variables that the bot uses. Here's how to initialize the variables:

```python
channelCount = 1
highest_streak = 1
highest_streak_breaker = None
highest_streak_break_time = None
last_user = None
```

Here is what each variable does:

- `channelCount` is the number that the bot is currently counting to
- `highest_streak` is the highest number that the bot has recorded
- `highest_streak_breaker` is the user that broke the highest streak
- `highest_streak_break_time` is the time that the highest streak was broken (this is stored as a unix timestamp)
- `last_user` is the last user that sent a number that was counted

Now that we have our variables, we can start coding the bot's commands. First, we'll need to make the command header. To do so, we'll use the `on_message` event. You can do this by adding the following line to your `main.py` file:

```python
@bot.event
async def on_message(message):
```

Now we'll need to pull all the global variables that we declared earlier.

```python
global channelCount, highest_streak, highest_streak_breaker, highest_streak_break_time, last_user
```

Now, we're getting into the core of the program. Check if the message was sent by the bot; if so, ignore it.

```python
if message.author == bot.user:
    return
```

Next, if the message came from a specific channel, continue on with the program. If not, ignore it.

```python
if message.channel.id == 1234567890: # Replace 1234567890 with the channel ID of the channel you want the bot to count in
    try: #This is here in case the message isn't a number
        # Here is where we'll put the rest of the code
else:
    return
```

First, we need to check if the user who sent the message is equal to the last_user variable. This prevents someone from chaining numbers up to infinity.
Then, if the number is the same as the channel count, we add one to `channelCount` and react with a checkmark.

```python
if message.author != last_user:
    number = int(message.content)
    if number == channelCount:
        channelCount = 1
        last_user = message.author
        await message.add_reaction('✅')
```

If the user broke the streak, we'll need to check if the streak is higher than the highest streak. If it is, we'll need to update the highest streak variables.

```python
else:
    if channelCount > highest_streak:
        highest_streak = channelCount # Update the highest streak
        highest_streak_breaker = message.author.mention # Update the highest streak breaker
        # Return the day, month, year, and time
        highest_streak_break_time = datetime.datetime.now().strftime("%B %dth, %Y, at %I:%M %p") #Saves the time that the highest streak was broken in a Unix timestamp
```

Then, we'll need to reset the channelCount variable and react with an X. We'll also let the user know they broke the streak.

```python
channelCount = 1
await message.add_reaction('❌')
await message.channel.send(f"What a bozo. {message.author.mention} broke the chain! Laugh at their failure! The chain is now at 1.")
# This is the message my bot uses. I'd recommend changing the message to be a bit more...friendly,
```

We're almost done, trust me 😄. This part runs if the number was posted by `last_user`. If so, it reacts with a warning sign and lets them now that the count didn't go up.

```python
else:
    await message.add_reaction('⚠️')
    await message.channel.send("You need friends to increase the counter, go touch grass or smth")
    # Again, if you want to be polite, I'd recommend changing the message 😅
```

This part is really simple. If the message isn't a number, it'll throw a `ValueError` since we typecast to `int` in our program. If this happens, we pass over it.

```python
except ValueError:
    pass
```

Finally, we'll need to add the following line to the bottom of the event handler to process commands:

```python
await bot.process_commands(message)
```

## Highest Streak Command

Now that we have the counting part of the bot done, we can start working on the highest streak command. First, we'll need to make the command header. To do so, we'll use the `@bot.command()` decorator. You can do this by adding the following line to your `main.py` file:

```python
@bot.command(name="higheststreak", description="Shows the highest streak and who broke it")
# You can use prefix commands if you want, but I'm using slash commands since Discord is phasing out prefix commands(it's also better practice)
```

We can now start with making the command. To start, we'll create the header and create a `discord.Embed` object (a cool message type only bots can use):

```python
async def highest_streak(ctx): #ctx is context, and allows you to access a lot of useful info
    highStreak = discord.Embed(title="Highest Streak",
                               description="Stats about the highest streak in <#1234567890>",
                               color=discord.Color.from_rgb(252, 186, 3))
    # Again, replace 1234567890 with the channel ID of the channel you want the bot to count in
```

Now, we'll add the fields to the embed. We'll add the highest streak, the user who broke it, and the time it was broken.

```python
highStreak.add_field(name="Highest Streak", value=str(highest_streak), inline=False)
highStreak.add_field(name="Highest Streak Breaker", value="<@" + highest_streak_breaker + ">", inline=False)
highStreak.add_field(name="Highest Streak Break Time", value=str(highest_streak_break_time), inline=False)
```

Finally, we'll send the embed. You should use ctx.respond(), as ctx.send() will show that the application didn't respond to the command.

```python
await ctx.respond(embed=highStreak)
```

## Final Code

Finally, we'll need to add the following line to the bottom of the file to run the bot:

```python
bot.run("YOUR_TOKEN_HERE") # Replace YOUR_TOKEN_HERE with your bot's token (you saved it right?)
```

Here is the final code:

```python
import discord
import datetime
from discord.ext import commands

intents = discord.Intents.all()
bot = discord.Bot(intents=intents)

channelCount = 1
highest_streak = 1
highest_streak_breaker = None
highest_streak_break_time = None
last_user = None


async def on_message(message):
    global channelCount, highest_streak, highest_streak_breaker, highest_streak_break_time, last_user
    if message.author == bot.user:
        # Ignore messages sent by the bot itself
        return

    if message.channel.id == 1234567890:
        print("See this!")
        try:
            number = int(message.content)
            if message.author != last_user:
                if number == channelCount:
                    channelCount = 1
                    last_user = message.author
                    await message.add_reaction('✅')
                else:
                    if channelCount > highest_streak:
                        highest_streak = channelCount
                        highest_streak_breaker = message.author.mention
                        # Return the day, month, year, and time
                        highest_streak_break_time = datetime.datetime.now().strftime("%B %dth, %Y, at %I:%M %p")

                    channelCount = 1
                    await message.add_reaction('❌')
                    await message.channel.send(f"What a bozo. {message.author.mention} broke the chain! Laugh at "
                                               f"their failure! The chain is now at 1.")
            else:
                await message.add_reaction('⚠️')
                await message.channel.send("You need friends to increase the counter, go touch grass or smth")
        except ValueError:
            pass  # Ignores if the message is not a number
    await bot.process_commands(message)
@bot.command(name="higheststreak", description="Shows the highest streak and who broke it")
async def highest_streak(ctx):
    highStreak = discord.Embed(title="Highest Streak",
                               description="Stats about the highest streak in <#1109555290292109392>",
                               color=discord.Color.from_rgb(252, 186, 3))
    highStreak.add_field(name="Highest Streak", value=str(highest_streak), inline=False)
    highStreak.add_field(name="Highest Streak Breaker", value="<@" + highest_streak_breaker + ">", inline=False)
    highStreak.add_field(name="Highest Streak Break Time", value=str(highest_streak_break_time), inline=False)
    await ctx.respond(embed=highStreak)

bot.run("YOUR_TOKEN_HERE")
```

## You're Done!

You'll just need to run the bot now. You can do this by running the following command in your terminal:

```bash
python3 main.py
```

Keep in mind that this bot will only stay online as long as your terminal is open. If you want to keep it online 24/7, you'll need to use a hosting service like [Oracle Cloud](https://www.oracle.com/cloud/free/), [Google Cloud](cloud.google.com), or [Amazon AWS](aws.amazon.com).
All these services are reliable and are free or cost very little, but I'd recommend doing your own research and finding the best server provider for you.
Please do NOT use Heroku or Replit for hosting your bot, they have MANY issues which I covered in [another post](/posts/dont-use-free-hosting-services-for-the-love-of-god).

## Conclusion

There's still a lot you could improve with this bot, but this works fine for a basic prototype. For my server, I have added these features:

- Edit/Delete detection
- Ability to change the channel the bot counts in
- Setup/Remove commands for counting
- Certain emojis at certain numbers (100, 200, 300, etc.)

Thanks for reading my article!
