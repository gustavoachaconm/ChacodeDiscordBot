const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "guildMemberRemove",
  execute(member) {
    const channelId = "1250929632384127057";
    const channel = member.guild.channels.cache.get(channelId);

    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor("#ff0000")
      .setTitle(`¡Adiós, ${member.user.tag}!`)
      .setDescription(`Lamentamos verte partir, ${member.user.username}.`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setFooter({
        text: "Esperamos verte de nuevo",
        iconURL: "https://example.com/logo.png",
      });

    channel.send({ embeds: [embed] });
  },
};
