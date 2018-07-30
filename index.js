const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (message) => {
    
    if (isCommand(message, "-new")) {
        const reason = message.content.split(" ").slice(1).join(" ");
        if (!message.guild.roles.exists("name", "Support Team")) return message.channel.send(`This server doesn't have a \`Support Team\` role made, so the ticket won't be opened.\nIf you are an administrator, make one with that name exactly and give it to users that should be able to see tickets.`);
        if (message.guild.channels.exists("name", "ticket-" + message.author.id)) return message.channel.send(`لا يمكنك عمل اكثر من تكت.`);
        message.guild.createChannel(`ticket-${message.author.id}`, "text").then(c => {
            let role = message.guild.roles.find("name", "Support Team");
            let role2 = message.guild.roles.find("name", "@everyone");
            c.overwritePermissions(role, {
                SEND_MESSAGES: true,
                READ_MESSAGES: true
            });
            c.overwritePermissions(role2, {
                SEND_MESSAGES: false,
                READ_MESSAGES: false
            });
            c.overwritePermissions(message.author, {
                SEND_MESSAGES: true,
                READ_MESSAGES: true
            });
            message.channel.send(`:white_check_mark: تم صنع التكت, #${c.name}.`);
            const embed = new Discord.RichEmbed()
                .setColor(0xCF40FA)
                .addField(`${message.author.username}!`, `سيتم مساعدتك من قبل فريق الدعم في اسرع وقت الرجاء الانتظار`)
                .setTimestamp();
            c.send({
                embed: embed
            });
        }).catch(console.error); 
    }


    if (isCommand(message, "اغلاق")) {
        if (!message.channel.name.startsWith(`ticket-`)) return message.channel.send(`لا يمكنك غلق التيكت وانت خارجها`);

        message.channel.send(`هل انت متأكد انك تريد حذف التيكت؟ لتأكيد اكتب **نعم** لديك 10 ثواني`)
                message.channel.awaitMessages(response => response.content === 'نعم', {
                        max: 1,
                        time: 10000,
                        errors: ['time'],
                    })
                    .then((collected) => {
                        message.channel.delete();
                    })
                    .catch(() => {
                        m.edit('انته الوقت, لن يتم اغلاق التيكت').then(m2 => {
                            m2.delete();
                        }, 3000);
                    });
            });
    }

});
