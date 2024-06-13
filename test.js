const { Client, Guild, GuildMember, MessageEmbed } = require("discord.js");
const { DISCORD_TOKEN } = process.env;

const client = new Client();

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);

  // Llamar a la función para simular el evento después de que el cliente esté listo
  simulateGuildMemberAdd();
});

// Función para simular el evento guildMemberAdd
async function simulateGuildMemberAdd() {
  const guild = new Guild(client, {
    id: "123456789012345678", // ID de ejemplo de servidor
  });
  const member = new GuildMember(guild, {
    user: {
      id: "987654321098765432", // ID de ejemplo de usuario
      tag: "UsuarioEjemplo#1234", // Nombre de usuario y discriminador
      username: "UsuarioEjemplo", // Nombre de usuario
      displayAvatarURL: () => "https://example.com/avatar.png", // URL del avatar de ejemplo
    },
    joinedAt: new Date(), // Fecha de unión al servidor (ahora)
    guild: guild, // Referencia al servidor
  });

  const channelId = "1250225470906040354"; // ID del canal donde enviar el mensaje (debería existir en tu servidor)
  const channel = guild.channels.cache.get(channelId);

  if (!channel) {
    console.error("El canal no existe o no se encontró.");
    return;
  }

  // Crear un mensaje embed para el mensaje de bienvenida
  const embed = new MessageEmbed()
    .setColor("#0099ff")
    .setTitle(`¡Bienvenid@ al servidor, ${member.user.tag}!`)
    .setDescription(
      `¡Esperamos que disfrutes tu estancia aquí, ${member.user.username}!`
    )
    .addField("Fecha de unión:", member.joinedAt.toLocaleDateString(), true)
    .addField("Miembro #:", guild.memberCount, true)
    .setThumbnail(member.user.displayAvatarURL())
    .setTimestamp()
    .setFooter("Gracias por unirte", "https://example.com/logo.png");

  // Enviar el mensaje embed al canal
  try {
    await channel.send({ embeds: [embed] });
    console.log("Mensaje de bienvenida enviado correctamente.");
  } catch (error) {
    console.error("Error al enviar el mensaje de bienvenida:", error);
  }
}

// Autenticar el cliente con el token
client.login(DISCORD_TOKEN);
