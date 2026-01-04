import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { QuickDB } from 'quick.db';
const db = new QuickDB();

export default {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('Verify yourself.'),
    async execute(interaction, config) {
        const verificationChannelId = await db.get('verificationChannel');
        const verificationRoleId = await db.get('verificationRole');

        if (!verificationChannelId || !verificationRoleId) {
                    const embed = new EmbedBuilder()
                    .setTitle('\`🕷️\`〃Verify not configured')
                    .setDescription('> *The verification system is not configured on this server.*')
                    .setColor(config.color)
                    .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
                    .setTimestamp();
                await interaction.reply({ embeds: [embed], ephemeral: true });
                return;
        }

        if (interaction.channelId !== verificationChannelId) {
            const embed = new EmbedBuilder()
            .setDescription(`\`❌\`〃*Please run \`/verify\` command in <#${verificationChannelId}> channel.*`)
            .setColor(config.color)
        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
        }

        const member = interaction.member;
        const role = interaction.guild.roles.cache.get(verificationRoleId);

        if (member.roles.cache.has(verificationRoleId)) {
            const embed = new EmbedBuilder()
            .setTitle('\`🕷️\`〃Already verified')
            .setDescription('> *You are already verified.*')
            .setColor(config.color)
            .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
            .setTimestamp();
        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
        }

        await member.roles.add(role);

        const dmEmbed = new EmbedBuilder()
        .setTitle('\`✅\`〃Verification Successful')
        .setDescription('> *You have successfully passed the verification.*')
        .setColor(config.color)
        .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
        .setTimestamp();

        try {
            await interaction.reply({ embeds: [dmEmbed], ephemeral: true });
            return interaction.user.send({ embeds: [dmEmbed] }).catch(() => {});
        } catch (e) {
            console.error(e);
        }
    },
};