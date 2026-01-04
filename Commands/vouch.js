import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { QuickDB } from 'quick.db';
const db = new QuickDB();

export default {
    data: new SlashCommandBuilder()
        .setName('vouch')
        .setDescription('Give your opinion on the service.')
        .addUserOption(option => option.setName('member').setDescription('The member concerned').setRequired(true))
        .addStringOption(option => option.setName('service').setDescription('The service concerned').setRequired(true))
        .addIntegerOption(option => option.setName('note').setDescription('The score must be between 1 and 5').setRequired(true))
        .addStringOption(option => option.setName('reviews').setDescription('Your opinion').setRequired(true))
        .addStringOption(option => option.setName('image').setDescription('Image URL').setRequired(false)),
    async execute(interaction, config) {
        const member = interaction.options.getUser('member');
        const service = interaction.options.getString('service');
        const note = interaction.options.getInteger('note');
        const reviews = interaction.options.getString('reviews');
        const image = interaction.options.getString('image');

        if (note < 1 || note > 5) {
            const embed = new EmbedBuilder()
            .setDescription(`\`❌\`〃*The score provided must be between 1 and 5.*`)
            .setColor(config.color);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const vouchData = {
            member: member.id,
            reviewer: interaction.user.id,
            service: service,
            note: note,
            reviews: reviews,
            image: image || 'None'
        };

        await db.push('vouches', vouchData);

        const ownersList = config.owner.map(ownerId => {
            const owner = interaction.guild.members.cache.get(ownerId);
            return owner ? `${owner.user} (**\`${ownerId}\`**)` : ownerId;
        });

        const vouchEmbed = new EmbedBuilder()
              .setTitle(`\`🕷️\`〃Vouch given by ${interaction.user.tag}`)
              .setThumbnail(member.displayAvatarURL({ dynamic: true, size: 1024 }))
              .setColor(config.color)
              .setDescription(`> *Member :* ${member.toString()} (\`${member.id}\`)\n> *Service :* \`${service}\`\n> *Review :* \`${reviews}\`\n> *Note :* \`${'⭐'.repeat(note)}\``)
              .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
              .setTimestamp();

        if (image) vouchEmbed.setImage(image);

        const vouchChannel = interaction.guild.channels.cache.get(config.vouchlogs);
        if (vouchChannel) {
            await vouchChannel.send({ embeds: [vouchEmbed] });
            const embed = new EmbedBuilder()
            .setTitle("\`✅\`〃Successful rated")
            .setDescription(`> *Your review has been sent successfully.*`)
            .setColor(config.color)
            .setFooter({text: interaction.user.username, iconURL: interaction.user.displayAvatarURL()})
            .setTimestamp();
            await interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
            const embed = new EmbedBuilder()
            .setDescription(`> *The vouch logs channel was not found. Please contact an owner below.*\n${ownersList.length > 0 ? ownersList.join('\n') : "*No owner configured*"}`)
            .setColor(config.color);
            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};