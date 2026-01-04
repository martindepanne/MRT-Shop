import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import fs from 'fs';

export default {
    data: new SlashCommandBuilder()
        .setName('setup-vouch')
        .setDescription('Define the channel of vouchs.')
        .addChannelOption(option => option.setName('channel').setDescription('The channel for vouchs').setRequired(true)),
    async execute(interaction, config) {
        const vouchChannel = interaction.options.getChannel('channel');
        try {
            const embed = new EmbedBuilder()
            .setTitle('\`🕷️\`〃Vouch System')
            .setDescription(`> *Vouch system successfully implemented in this channel.*`)
            .setColor(config.color)
            .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
            .setTimestamp();
          await vouchChannel.send({ embeds: [embed] })

          const embed2 = new EmbedBuilder()
          .setTitle('\`✅\`〃Vouch system successfully')
          .setDescription(`> *Vouch system successfully implemented in channel ${vouchChannel}*`)
          .setColor(config.color)
          .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
          .setTimestamp();
          await interaction.reply({ embeds: [embed2], ephemeral: true });
          
          config.vouchlogs = vouchChannel.id;
          fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
        } catch (e) {
            const embed = new EmbedBuilder().setDescription(`\`❌\`〃*An error occurred.*`).setColor(config.color);
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};