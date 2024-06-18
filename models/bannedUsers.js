const mongoose = require("mongoose");

const bannedUserSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true }, // Añadido userName como requerido
  guildId: { type: String, required: true },
  guildName: { type: String, required: true },
  banType: { type: String, enum: ["TEMP", "PERM"], required: true }, // Añadido banType como requerido y con valores permitidos
  unbanTime: { type: Number }, // Haciendo unbanTime opcional
});

const BannedUser = mongoose.model("BannedUser", bannedUserSchema);

module.exports = { BannedUser };
