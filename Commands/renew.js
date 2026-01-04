import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('renew')
        .setDescription('Renew a channel.')
        .addChannelOption(option => option.setName('channel').setDescription('Channel to renew').setRequired(false)),
    async execute(interaction, config) {
        let channelToRenew = interaction.options.getChannel('channel') || interaction.channel;
        try {
            const position = channelToRenew.position;
            const newChannel = await channelToRenew.clone();
            await channelToRenew.delete();
            await newChannel.setPosition(position);

            const embed = new EmbedBuilder()
                .setDescription(`\`✅\`〃*Renewed by* **\`${interaction.user.tag}\`** ${newChannel}`)
                .setColor(config.color);
            await newChannel.send({ embeds: [embed] });
        } catch (e) {
            const embed = new EmbedBuilder()
                .setDescription('\`❌\`〃*An error occurred while renewing.*')
                .setColor(config.color);
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};