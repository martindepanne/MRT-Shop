import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } from 'discord.js';
import { QuickDB } from 'quick.db';
const db = new QuickDB();

export default {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Shows profile member.')
        .addUserOption(option => option.setName('member').setDescription('The member to display.').setRequired(true)),
    async execute(interaction, config) {
        const member = interaction.options.getUser('member');
        const vouches = await db.get('vouches') || [];
        const memberVouches = vouches.filter(vouch => vouch.member === member.id);

        if (memberVouches.length === 0) {
            const embed = new EmbedBuilder()
            .setTitle("\`🕷️\`〃No vouch found")
            .setDescription(`> *No vouch found for the member ${member}*`)
            .setColor(config.color)
            .setFooter({text: interaction.user.username})
            .setTimestamp();
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }

        let currentPage = 1;
        const maxPages = memberVouches.length;

        const generateEmbed = (page) => {
            const v = memberVouches[page - 1];
            return new EmbedBuilder()
            .setTitle(`\`🕷️\`〃Vouch profile of ${member.tag}`)
            .setDescription(`> *Voucher :* <@${v.reviewer}>\n> *Service :* **\`${v.service}\`**\n> *Review :* **\`${v.reviews}\`**\n> *Note :* **\`${'⭐'.repeat(v.note)}\`**\n> *Image :* \`${v.image}\``)
            .setColor(config.color)
            .setFooter({text: `${page}/${maxPages}`})
            .setTimestamp();
        };

        const getButtons = (page) => {
            return new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('prev').setLabel('◀').setStyle(ButtonStyle.Primary).setDisabled(page === 1),
                new ButtonBuilder().setCustomId('next').setLabel('▶').setStyle(ButtonStyle.Primary).setDisabled(page === maxPages),
                new ButtonBuilder().setCustomId('home').setLabel('🏠').setStyle(ButtonStyle.Secondary).setDisabled(page === 1)
            );
        };

        const message = await interaction.reply({ 
            embeds: [generateEmbed(currentPage)], 
            components: [getButtons(currentPage)], 
            fetchReply: true 
        });

        const collector = message.createMessageComponentCollector({ time: 60000 });

        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) return i.reply({ content: "Pas pour toi !", ephemeral: true });
            
            if (i.customId === 'prev') currentPage--;
            else if (i.customId === 'next') currentPage++;
            else if (i.customId === 'home') currentPage = 1;

            await i.update({ embeds: [generateEmbed(currentPage)], components: [getButtons(currentPage)] });
        });
    },
};