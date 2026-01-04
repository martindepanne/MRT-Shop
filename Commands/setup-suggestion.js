import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import fs from 'fs';

export default {
    data: new SlashCommandBuilder()
        .setName('setup-suggestion')
        .setDescription('Define the channel of suggestions.')
        .addChannelOption(option => option.setName('channel').setDescription('The channel for suggestions').setRequired(true)),
    async execute(interaction, config) {
        const suggestionChannel = interaction.options.getChannel('channel');
        try {
            const embed = new EmbedBuilder()
            .setTitle('\`🕷️\`〃Suggestion System')
            .setDescription(`> *Suggestion system successfully implemented in this channel.*`)
            .setColor(config.color)
            .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
            .setTimestamp();
          await suggestionChannel.send({ embeds: [embed] })

          const embed2 = new EmbedBuilder()
          .setTitle('\`✅\`〃Suggestion system successfully')
          .setDescription(`> *Suggestion system successfully implemented in channel ${suggestionChannel}*`)
          .setColor(config.color)
          .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
          .setTimestamp();
          await interaction.reply({ embeds: [embed2], ephemeral: true });

          config.suggestionlogs = suggestionChannel.id;
          fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
        } catch (e) {
            const embed = new EmbedBuilder()
            .setDescription(`\`❌\`〃*An error occurred. Verify the channel permissions.*`)
            .setColor(config.color)
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};