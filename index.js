import { Client, Collection, EmbedBuilder, ActivityType } from 'discord.js';
import { Routes } from 'discord-api-types/v10';
import { REST } from '@discordjs/rest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config.json' with { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({ intents: 3276799 });
client.commands = new Collection();

const commandFiles = fs.readdirSync('./Commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = `./Commands/${file}`;
    const { default: command } = await import(filePath);
    
    if (command && command.data && command.data.name) {
        client.commands.set(command.data.name, command);
    } else {
        console.warn(`Command (${file}) is missing the "data" or "name" property.`);
    }
}

const rest = new REST({ version: '10' }).setToken(config.token);

async function deployCommands() {
    const commands = Array.from(client.commands.values()).map(command => command.data.toJSON());

    try {
        console.log('Slash commands are being deployed...');
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands },
        );
        console.log('Slash commands successfully deployed !');
    } catch (error) {
        console.error('An error occurred when deploying the slash commands :', error);
    }
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag} (${client.user.id})`);
    
    let activity;
    if(config.activity === "streaming") activity = ActivityType.Streaming;
    else if(config.activity === "competing") activity = ActivityType.Competing;
    else if(config.activity === "playing") activity = ActivityType.Playing;
    else if(config.activity === "watching") activity = ActivityType.Watching;
    else if(config.activity === "listening") activity = ActivityType.Listening;

    client.user.setPresence({
        activities: [{
            name: config.statut,
            type: activity,
            url: "https://www.twitch.tv/martindepanne",
        }],
        status: config.status,
    });
    deployCommands();
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    const publicCommands = ['vouch','invite','help','payement','profile','suggest','verify'];

    if (!config.owner.includes(interaction.user.id) && !publicCommands.includes(interaction.commandName)) {
        const embed = new EmbedBuilder()
            .setDescription('\`Spider\` 〃*You are not authorized to use this command !*')
            .setColor(config.color);
        await interaction.reply({ embeds: [embed], ephemeral: true });
        return;
    }
    
    try {
        await command.execute(interaction, config);
    } catch (error) {
        console.error('An error occurred while executing the command:', error);
    }
});

client.on('messageCreate', async (message) => {
    if (message.channel.id === config.vouchlogs) {
        if (message.author.bot) return;

        const embed = new EmbedBuilder()
            .setDescription('\`Spider\` 〃*Please use the \`/vouch\` command to give your opinion !*')
            .setColor(config.color);
        
        const cc = await message.reply({ content: `${message.author}`, embeds: [embed]});

        setTimeout(() => {
            message.delete().catch(() => {});
            cc.delete().catch(() => {});
        }, 8000);
    }
});

client.login(config.token);

process.on('unhandledRejection', (reason) => {
    const ignoredCodes = [10008, 50013, 50035, 40060, 10003, 10014, 50001, 10015];
    if (reason && ignoredCodes.includes(reason.code)) return;
});