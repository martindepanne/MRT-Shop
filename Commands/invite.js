import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Create a server invite.'),
    async execute(interaction, config) {
        const channel = interaction.channel;
        const invite = await channel.createInvite({
            maxUses: 0,
            maxAge: 0,
            unique: false
        });

        const embed = new EmbedBuilder()
            .setTitle("\`✅\`〃Successful Invite Created")
            .setDescription(`> *Here is an invitation link from the server \`${interaction.guild.name}\` for the channel ${channel} :*\n ${invite.url}`)
            .setColor(config.color)
            .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    },
};