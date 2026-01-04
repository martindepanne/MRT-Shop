import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { QuickDB } from 'quick.db';
const db = new QuickDB();

export default {
    data: new SlashCommandBuilder()
        .setName('setup-verification')
        .setDescription('Setup verification system.')
        .addChannelOption(option => option.setName('channel').setDescription('Channel for verification').setRequired(true))
        .addRoleOption(option => option.setName('role').setDescription('Role assigned after verification').setRequired(true)),
    async execute(interaction, config) {
        const channel = interaction.options.getChannel('channel');
        const role = interaction.options.getRole('role');
        try {
            const embed = new EmbedBuilder()
                .setTitle('\`🕷️\`〃Verification System')
                .setDescription(`> *Run \`/verify\` to get the role* ${role}.`)
                .setColor(config.color)
                .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
                .setTimestamp();
            await channel.send({ embeds: [embed] });

            await db.set('verificationChannel', channel.id);
            await db.set('verificationRole', role.id);

            const success = new EmbedBuilder()
                .setTitle('\`✅\`〃Verification system successfully')
                .setDescription(`> *System implemented in ${channel} with role ${role}*`)
                .setColor(config.color);
            await interaction.reply({ embeds: [success], ephemeral: true });
        } catch (e) {
            const err = new EmbedBuilder().setDescription(`\`❌\`〃*An error occurred.*`).setColor(config.color);
            await interaction.reply({ embeds: [err], ephemeral: true });
        }
    },
};