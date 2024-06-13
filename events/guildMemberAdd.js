const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: EmbedBuilder.MessageEmbed,
  execute(member) {
    const channelId = "1250225470906040354"; // ID del canal donde enviar el mensaje
    const channel = member.guild.channels.cache.get(channelId);

    if (!channel) return; // Si el canal no existe, salir

    // Crear un mensaje embed para el mensaje de bienvenida
    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle(`¡Bienvenid@ al servidor, ${member.user.tag}!`)
      .setDescription(
        `¡Esperamos que disfrutes tu estancia aquí, ${member.user.username}!`
      )
      .addField("Fecha de unión:", member.joinedAt.toLocaleDateString(), true)
      .addField("Miembro #:", member.guild.memberCount, true)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setFooter("Gracias por unirte", "https://example.com/logo.png");

    // Enviar el mensaje embed al canal
    channel.send({ embeds: [embed] });
  },
};
