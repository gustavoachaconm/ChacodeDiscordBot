const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("prueba")
    .setDescription("esto es una prueba"),
  async execute(interaction) {
    await interaction.reply("hola");
  },
};
