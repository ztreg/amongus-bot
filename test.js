require("dotenv").config();

const Discord = require("discord.js");
const client = new Discord.Client();
let time = "19:00";
let test = 0;

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});


client.on("message", async msg => {
  if (msg.content === "!ping") {
    msg.reply("pong");
  }

  let originalMessage
  if (msg.content === "!poll") {
    originalMessage = await msg.channel.send(`@everyone Among Us at ${time}, Join channel "Amöng Us" 10 minutes before or you are not my friend`, {files: ['./dims.jpg']});
    let embedPoll = new Discord.MessageEmbed()
    .setTitle('👍 for 19:00        OR      👎 for 20:00      OR        😜 for later')
    .setColor('YELLOW')

    let msgEmbed = await msg.channel.send(embedPoll)
    await msgEmbed.react('👍')  
    await msgEmbed.react('👎')
    await msgEmbed.react('😜')

    
    const filter = (reaction, user) => {
      return (
        ["👍", "👎"].includes(reaction.emoji.name) &&user.id === msg.author.id
      );
    };

    msgEmbed.awaitReactions(filter, {max : 1, time: 6000000, errors: ["time"] })
      .then((collected) => {
        const reaction = collected.first();
        console.log(reaction.emoji.name);
        if (reaction.emoji.name === "👍") {
          console.log('oh its now 20:00');
          test = test + 1
        } else if (reaction.emoji.name === "👎") {
          test = test - 1
          console.log('oh its now 19:00');
        }
        if(test > 0) {
          time = '20:00'
        } else {
          time = '19:00'
        }
        originalMessage.edit(`@everyone Among Us at ${time}, Join channel "Amöng Us" 10 minutes before or you are not my friend`)
      })
      .catch((collected) => {
        msg.reply(`After a 1 hour, only ${collected.size} out of ${msg.channel.guild.memberCount} reacted.`)
      });
 
  }

});


client.login(process.env.DISCORD_TOKEN);