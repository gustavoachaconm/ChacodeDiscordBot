const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "guildMemberAdd",
  execute(member) {
    const channelId = "1250928688619589682"; // ID del canal donde enviar el mensaje
    const channel = member.guild.channels.cache.get(channelId);

    if (!channel) return; // Si el canal no existe, salir

    // Crear un mensaje embed para el mensaje de bienvenida
    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle(`¡Bienvenid@ al servidor, ${member.user.tag}!`)
      .setDescription(
        `¡Esperamos que disfrutes tu estancia aquí, ${member.user.username}!`
      )
      .addFields(
        {
          name: "Fecha de unión:",
          value: member.joinedAt.toLocaleDateString(),
          inline: true,
        },
        {
          name: "Miembro #:",
          value: `${member.guild.memberCount}`,
          inline: true,
        }
      )
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setFooter({
        text: "Gracias por unirte",
        iconURL: "https://example.com/logo.png",
      });

    // Enviar el mensaje embed al canal
    channel.send({ embeds: [embed] });
  },
};
