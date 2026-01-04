import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('mass-role')
        .setDescription('Add/Remove a role to all users.')
        .addStringOption(option => 
            option.setName('action')
                .setDescription('Action to perform')
                .setRequired(true)
                .addChoices(
                    { name: 'Add', value: 'add' },
                    { name: 'Remove', value: 'remove' }
                )
        )
        .addRoleOption(option => 
            option.setName('role')
                .setDescription('Role to add/remove')
                .setRequired(true)
        ),
    async execute(interaction, config) {
        const action = interaction.options.getString('action');
        const role = interaction.options.getRole('role');

        if (!role.editable) {
            const embed = new EmbedBuilder()
                .setDescription(`\`❌\`〃*Please check that the role is assignable and permissions are correct.*`)
                .setColor(config.color);
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }

        await interaction.deferReply();
        const guildMembers = await interaction.guild.members.fetch();
        let modifiedMembers = 0;

        for (const [id, member] of guildMembers) {
            if (action === 'add' && !member.roles.cache.has(role.id)) {
                await member.roles.add(role).catch(() => {});
                modifiedMembers++;
            } else if (action === 'remove' && member.roles.cache.has(role.id)) {
                await member.roles.remove(role).catch(() => {});
                modifiedMembers++;
            }
        }

        const embed = new EmbedBuilder()
            .setTitle("\`✅\`〃Mass role successfully")
            .setDescription(`> *Role ${role} was ${action === 'add' ? 'added' : 'removed'} to ${modifiedMembers} members.*`)
            .setColor(config.color);
        await interaction.editReply({ embeds: [embed] });
    },
};