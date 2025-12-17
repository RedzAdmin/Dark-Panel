require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const fs = require('fs-extra');
const path = require('path');
const cron = require('node-cron');
const random = require('random');

const db = require('./utils/database');
const ptero = require('./utils/pterodactyl');
const helpers = require('./utils/helpers');

const config = require('./config.json');

const bot = new Telegraf(process.env.BOT_TOKEN);

let userStates = {};
let botImage = process.env.BOT_IMAGE || "https://via.placeholder.com/400";
let botVideo = process.env.BOT_VIDEO || "https://via.placeholder.com/400";

db.initialize();

function getRandomMedia() {
    const media = [botImage, botVideo].filter(Boolean);
    return media.length > 0 ? media[Math.floor(Math.random() * media.length)] : null;
}

function formatMessage(title, content) {
    return `╭━〔 ${title} 〕━┈⊷
┃✮│➣ ${content}
╰━━━━━━━━━━━━━━━━━┈⊷`;
}

// TELEGRAM BOT COMMANDS:

// 1. /start - Start the bot
bot.start(async (ctx) => {
    const userId = ctx.from.id;
    const username = ctx.from.username || ctx.from.first_name;
    
    const message = formatMessage(
        'WELCOME',
        `Hello ${username}\nBot: ${config.bot_name}\nMade by: ${config.owner}\nGitHub: ${config.github}`
    );
    
    const keyboard = Markup.keyboard([
        ['Buy Server', 'Renew Server'],
        ['My Servers', 'Payment Methods'],
        ['Help', 'Admin Panel']
    ]).resize();
    
    const media = getRandomMedia();
    if (media && (media.includes('.jpg') || media.includes('.png'))) {
        await ctx.replyWithPhoto(media, { caption: message, ...keyboard });
    } else if (media && (media.includes('.mp4') || media.includes('.gif'))) {
        await ctx.replyWithVideo(media, { caption: message, ...keyboard });
    } else {
        await ctx.reply(message, keyboard);
    }
    
    const user = db.getUser(userId);
    if (!user) {
        db.createUser(userId, username);
    }
});

// 2. /help - Show help
bot.help(async (ctx) => {
    const message = formatMessage(
        'HELP',
        `Available Commands:\n\n` +
        `Buy Server - Purchase new server\n` +
        `Renew Server - Renew existing server\n` +
        `My Servers - View your servers\n` +
        `Payment Methods - View payment options\n` +
        `Admin Panel - Admin commands\n\n` +
        `Support: ${config.owner}`
    );
    await ctx.reply(message);
});

// 3. /confirm <txid> - Confirm payment
bot.command('confirm', async (ctx) => {
    const args = ctx.message.text.split(' ');
    if (args.length < 2) {
        await ctx.reply(formatMessage('ERROR', 'Usage: /confirm <transaction_id>'));
        return;
    }
    
    const txId = args[1];
    const message = formatMessage(
        'PAYMENT CONFIRMATION',
        `Transaction ID: ${txId}\nSubmitted for verification\nAdmin will confirm shortly`
    );
    
    await ctx.reply(message);
    db.createPayment(ctx.from.id, "Unknown", "Unknown", txId);
});

// 4. Buy Server Command
bot.hears('Buy Server', async (ctx) => {
    const plans = config.server_plans;
    let buttons = [];
    
    Object.entries(plans).forEach(([plan, details]) => {
        if (plan === 'admin') return;
        const label = plan === 'free' ? 
            `FREE - ${details.ram}MB RAM` : 
            `${plan.toUpperCase()} - ${details.ram}MB RAM - ${details.price}`;
        buttons.push([Markup.button.callback(label, `buy_${plan}`)]);
    });
    
    const message = formatMessage(
        'SERVER PLANS',
        'Select a server plan:\nFree: 24hr renewal task\nPaid: 30 days access'
    );
    
    await ctx.reply(message, Markup.inlineKeyboard(buttons));
});

// 5. Payment Methods Command
bot.hears('Payment Methods', async (ctx) => {
    const methods = config.payment_methods;
    let message = `╭━〔 PAYMENT METHODS 〕━┈⊷\n`;
    
    Object.entries(methods).forEach(([method, details]) => {
        message += `┃✮│➣ ${method.toUpperCase()}: ${details}\n`;
    });
    
    message += `╰━━━━━━━━━━━━━━━━━┈⊷\n\nAfter payment, use: /confirm <transaction_id>`;
    
    await ctx.reply(message);
});

// 6. My Servers Command
bot.hears('My Servers', async (ctx) => {
    const userId = ctx.from.id;
    const servers = db.getUserServers(userId);
    
    if (servers.length === 0) {
        await ctx.reply(formatMessage('NO SERVERS', 'You have no servers\nUse Buy Server option'));
        return;
    }
    
    let message = `╭━〔 YOUR SERVERS 〕━┈⊷\n`;
    
    servers.forEach((server, index) => {
        const timeLeft = helpers.formatTime(server.expires - Date.now());
        message += `┃✮│➣ ${index + 1}. ${server.plan.toUpperCase()}\n`;
        message += `┃✮│➣ Username: ${server.username}\n`;
        message += `┃✮│➣ Expires: ${timeLeft}\n`;
        message += `┃✮│➣ Status: ${server.active ? 'Active' : 'Inactive'}\n`;
    });
    
    message += `╰━━━━━━━━━━━━━━━━━┈⊷\n\nPanel: ${config.panel_url}`;
    
    await ctx.reply(message);
});

// 7. Renew Server Command
bot.hears('Renew Server', async (ctx) => {
    const userId = ctx.from.id;
    const servers = db.getUserServers(userId);
    
    if (servers.length === 0) {
        await ctx.reply(formatMessage('NO SERVERS', 'No servers to renew'));
        return;
    }
    
    let buttons = [];
    servers.forEach((server, index) => {
        const label = server.plan === 'free' ? 
            `Renew FREE Server` : 
            `Renew ${server.plan.toUpperCase()} - ${config.server_plans[server.plan].price}`;
        buttons.push([Markup.button.callback(label, `renew_${index}`)]);
    });
    
    await ctx.reply(formatMessage('RENEW SERVER', 'Select server to renew:'), 
        Markup.inlineKeyboard(buttons));
});

// 8. Admin Panel Command
bot.hears('Admin Panel', async (ctx) => {
    const userId = ctx.from.id;
    if (!db.isAdmin(userId)) {
        await ctx.reply(formatMessage('ACCESS DENIED', 'Admin only\nContact @darkempdev'));
        return;
    }
    
    const message = formatMessage('ADMIN PANEL', 'Welcome Admin\nChoose action below');
    
    await ctx.reply(message, Markup.inlineKeyboard([
        [Markup.button.callback('📢 Broadcast', 'admin_broadcast')],
        [Markup.button.callback('🛑 Shutdown All', 'admin_shutdown')],
        [Markup.button.callback('⏸️ Suspend All', 'admin_suspend')],
        [Markup.button.callback('🔄 Restart All', 'admin_restart')],
        [Markup.button.callback('💰 Confirm Payment', 'admin_confirm')],
        [Markup.button.callback('📊 Bot Stats', 'admin_stats')],
        [Markup.button.callback('👥 User List', 'admin_users')]
    ]));
});

// Handle server purchase callbacks
Object.keys(config.server_plans).forEach(plan => {
    if (plan === 'admin') return;
    
    bot.action(`buy_${plan}`, async (ctx) => {
        const userId = ctx.from.id;
        userStates[userId] = { action: 'buy', plan: plan };
        
        if (plan === 'free') {
            const problem = helpers.generateMathProblem();
            userStates[userId].mathProblem = problem;
            
            await ctx.reply(formatMessage(
                'FREE SERVER',
                `Complete math task:\nSolve: ${problem.problem}\nSend answer as number`
            ));
        } else {
            const planDetails = config.server_plans[plan];
            await ctx.reply(formatMessage(
                `${plan.toUpperCase()} SERVER`,
                `Price: ${planDetails.price}\nRAM: ${planDetails.ram}MB\nDisk: ${planDetails.disk}MB\nCPU: ${planDetails.cpu}\n\nSend details:\nusername|email|password`
            ));
        }
        await ctx.answerCbQuery();
    });
});

// Handle renew server callbacks
bot.action(/renew_(\d+)/, async (ctx) => {
    const userId = ctx.from.id;
    const index = parseInt(ctx.match[1]);
    const servers = db.getUserServers(userId);
    
    if (index >= 0 && index < servers.length) {
        const server = servers[index];
        if (server.plan === 'free') {
            const problem = helpers.generateMathProblem();
            userStates[userId] = { 
                action: 'renew', 
                serverIndex: index,
                mathProblem: problem 
            };
            
            await ctx.reply(formatMessage(
                'RENEW FREE SERVER',
                `Complete math task:\nSolve: ${problem.problem}\nSend answer as number`
            ));
        } else {
            const planDetails = config.server_plans[server.plan];
            await ctx.reply(formatMessage(
                'RENEW PAID SERVER',
                `Plan: ${server.plan.toUpperCase()}\nPrice: ${planDetails.price}\n\nSend transaction ID:\n/confirm <transaction_id>`
            ));
        }
    }
    await ctx.answerCbQuery();
});

// Handle text messages (credentials, math answers)
bot.on('text', async (ctx) => {
    const userId = ctx.from.id;
    const text = ctx.message.text;
    const state = userStates[userId];
    
    if (!state) return;
    
    // Handle math answers for free servers
    if (state.mathProblem && !isNaN(text)) {
        const correct = helpers.checkMathAnswer(state.mathProblem, text);
        if (correct) {
            if (state.action === 'buy') {
                userStates[userId].mathCompleted = true;
                await ctx.reply(formatMessage(
                    'TASK COMPLETED',
                    'Math correct! Now send:\nemail|password\nExample: user@email.com|mypassword123'
                ));
            } else if (state.action === 'renew') {
                const servers = db.getUserServers(userId);
                if (state.serverIndex < servers.length) {
                    const server = servers[state.serverIndex];
                    // Renew server by updating expiry
                    server.expires = Date.now() + (24 * 60 * 60 * 1000);
                    const allServers = db.getServers();
                    allServers[server.id] = server;
                    db.saveServers(allServers);
                    
                    await ctx.reply(formatMessage(
                        'SERVER RENEWED',
                        `Free server renewed for 24 hours\nExpires: ${new Date(server.expires).toLocaleString()}`
                    ));
                    delete userStates[userId];
                }
            }
        } else {
            await ctx.reply(formatMessage('WRONG ANSWER', 'Try again'));
        }
        return;
    }
    
    // Handle credentials for server creation
    if (state.action === 'buy' && (state.plan !== 'free' || state.mathCompleted)) {
        const parts = text.split('|');
        let username, email, password;
        
        if (state.plan === 'free') {
            if (parts.length < 2) {
                await ctx.reply('Format: email|password');
                return;
            }
            email = parts[0].trim();
            password = parts[1].trim();
            username = `user${userId}`;
        } else {
            if (parts.length < 3) {
                await ctx.reply('Format: username|email|password');
                return;
            }
            username = parts[0].trim();
            email = parts[1].trim();
            password = parts[2].trim();
        }
        
        const result = await ptero.createAccount(username, email, password, state.plan);
        
        if (result.success) {
            const expiry = state.plan === 'free' ? 
                Date.now() + (24 * 60 * 60 * 1000) :
                Date.now() + (30 * 24 * 60 * 60 * 1000);
            
            db.createServer(userId, {
                plan: state.plan,
                username: username,
                email: email,
                created: Date.now(),
                expires: expiry,
                active: true
            });
            
            const planDetails = config.server_plans[state.plan];
            const message = `╭━〔 ACCOUNT CREATED 〕━┈⊷
┃✮│➣ Plan: ${state.plan.toUpperCase()}
┃✮│➣ Panel: ${config.panel_url}
┃✮│➣ Username: ${username}
┃✮│➣ Email: ${email}
┃✮│➣ Password: ${password}
┃✮│➣ RAM: ${planDetails.ram}MB
┃✮│➣ Disk: ${planDetails.disk}MB
╰━━━━━━━━━━━━━━━━━┈⊷

Keep credentials safe
Thanks for Patronizing DARK EMPIRE TECH`;
            
            await ctx.reply(message);
            delete userStates[userId];
        } else {
            await ctx.reply(formatMessage(
                'CREATION FAILED',
                `Error: ${result.error}\nContact ${config.owner}`
            ));
        }
    }
});

// Load admin commands
require('./commands/admin')(bot, db, ptero);

// Start the bot
bot.launch().then(() => {
    console.log(`${config.bot_name} bot started successfully`);
    console.log(`Owner: ${config.owner}`);
    console.log(`GitHub: ${config.github}`);
    
    // Start auto-renewal check
    require('./tasks/renewal')(bot, db);
});

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));