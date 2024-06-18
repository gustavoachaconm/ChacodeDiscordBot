const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField
} = require("discord.js");
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
  .setName("tempmute")
  .setDescription("Mute a un miembro de todos los canales del servidor por un tiempo.")
  .addUserOption((option) => 
    option
      .setName("usuario")
      .setDescription("El usuario a mutear.")
      .setRequired(true)
    )
  .addStringOption((option) =>
    option 
      .setName("duración")
      .setDescription("La duración del baneo (ej. 1d, 2h, 30m).")
      .setRequired(true)
    )
  .addStringOption((option) => 
    option
      .setName("razón")
      .setDescription("La razón del baneo.")
      .setRequired(false)
    )
  .addBooleanOption((option) =>
    option
      .setName("enviar-mensaje")
      .setDescription("Enviar un mensaje privado al usuario baneado.")
      .setRequired(false)
  ),

  async execute(interaction) {
    const member = interaction.options.getMember("usuario");
    const duration = interaction.options.getString("duración");
    const reason = interaction.options.getString("razón") || "No especificada";
    const durationMs = ms(duration);
    const sendPrivateMessage = interaction.options.getBoolean("enviar-mensaje");

    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)
    ) {
      return interaction.reply({
        content: "No tienes permisos para mutear miembros.",
        ephemeral: true,
      });
    }

    if (!member) {
      return interaction.reply({
        content: "El usuario no está en el servidor.",
        ephemeral: true,
      });
    }

    const mutedRoleId = '1252736539868266619'; // ID del rol específico
    const mutedRole = interaction.guild.roles.cache.get(mutedRoleId);

    if (!mutedRole) {
      return interaction.reply({
        content: 'El rol especificado no existe en el servidor.',
        ephemeral: true,
      });
    }

    await member.roles.add(mutedRole);

    // Enviar mensaje privado al usuario baneado
    if (sendPrivateMessage) {
      try {
        const embedPrivateMessage = new EmbedBuilder()
          .setColor("#ff0000")
          .setTitle("Has sido muteado")
          .setDescription(`Has sido muteado en **${interaction.guild.name}**.`)
          .addFields(
            { name: "Razón", value: reason, inline: false },
            { name: "Duración", value: duration || "Permanente", inline: false }
          )
          .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
          .setTimestamp();

        await member.send({ embeds: [embedPrivateMessage] });
      } catch (err) {
        console.error(
          "Error al enviar mensaje privado al usuario muteado:",
          err
        );
      }
    }

    // Mensaje de confirmación al moderador
    await interaction.reply({
      content: `El usuario ${member.user.tag} ha sido muteado temporalmente.`,
      ephemeral: true,
    });

    setTimeout(async () => {
      try {
        await member.roles.remove(mutedRole);
        console.log(`Usuario ${member.user.tag} desmuteado automáticamente.`);

        // Enviar mensaje privado al usuario desmuteado
        if (sendPrivateMessage) {
          try {
            const embedUnbanMessage = new EmbedBuilder()
              .setColor('#00ff00')
              .setTitle('Has sido desmuteado')
              .setDescription(`Has sido desmuteado en **${interaction.guild.name}**.`)
              .addFields({ name: 'Razón', value: reason })
              .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
              .setTimestamp();

            const user = await interaction.client.users.fetch(member.id);
            await user.send({ embeds: [embedUnbanMessage] });
          } catch (err) {
            if (err.code === 50007) {
              console.error(`El bot no puede enviar mensajes privados al usuario ${member.user.tag} debido a la configuración de privacidad.`);
            } else {
              console.error('Error al enviar mensaje privado al usuario desmuteado:', err);
            }
          }
        }

        // Mensaje de log en el canal de logs
        const logChannelId = '1251180769716469812'; // ID del canal de logs
        const channel = interaction.guild.channels.cache.get(logChannelId);
        if (channel) {
          const embedLog = new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle('Usuario Desmuteado')
            .addFields(
              { name: 'Usuario', value: `${member.user.tag} (${member.id})`, inline: true },
              { name: 'Moderador', value: `${interaction.user.tag} (${interaction.user.id})`, inline: true },
              { name: 'Razón', value: reason, inline: false },
              { name: 'Fecha', value: new Date().toLocaleString(), inline: false }
            )
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

          await channel.send({ embeds: [embedLog] });
        }
      } catch (err) {
        console.error('Error al desmutear automáticamente:', err);
      }
    }, durationMs);
  }
}