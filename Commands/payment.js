import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('payment')
        .setDescription('Show payment options.'),
    async execute(interaction, config) {
        const embed = new EmbedBuilder()
            .setTitle('\`🕷️\`〃Payment Options')
            .setDescription('> *PayPal :* [PayPal Link](https://www.paypal.com/ncp/payment/TT78E84WPYRTA)\n> *Ltc :* \`ltc.........\`')
            .setColor(config.color)
            .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    },
};