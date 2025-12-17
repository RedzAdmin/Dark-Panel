const { Markup } = require('telegraf');

function formatMessage(title, content) {
    return `╭━〔 ${title} 〕━┈⊷
┃✮│➣ ${content}
╰━━━━━━━━━━━━━━━━━┈⊷`;
}

module.exports = function(bot, db, ptero) {
    // 1. Broadcast to all users
    bot.action('admin_broadcast', async (ctx) => {
        const userId = ctx.from.id;
        if (!db.isAdmin(userId)) return;
        
        await ctx.reply(formatMessage(
            'BROADCAST',
            'Send message to broadcast to all users:'
        ));
        
        userStates[userId] = { action: 'broadcast' };
        await ctx.answerCbQuery();
    });
    
    // 2. Shutdown all servers
    bot.action('admin_shutdown', async (ctx) => {
        const userId = ctx.from.id;
        if (!db.isAdmin(userId)) return;
        
        await ctx.reply(formatMessage(
            'SHUTDOWN ALL',
            'Confirm shutdown ALL servers?\nThis cannot be undone!'
        ), Markup.inlineKeyboard([
            [Markup.button.callback('✅ YES - Shutdown All', 'confirm_shutdown')],
            [Markup.button.callback('❌ NO - Cancel', 'cancel_admin')]
        ]));
        await ctx.answerCbQuery();
    });
    
    bot.action('confirm_shutdown', async (ctx) => {
        const userId = ctx.from.id;
        if (!db.isAdmin(userId)) return;
        
        await ctx.editMessageText('Shutting down all servers...');
        
        const servers = await ptero.getAllServers();
        if (servers.success) {
            let count = 0;
            for (const server of servers.servers) {
                const result = await ptero.stopServer(server.attributes.id);
                if (result.success) count++;
            }
            await ctx.reply(formatMessage(
                'SHUTDOWN COMPLETE',
                `Successfully shutdown ${count} servers`
            ));
        } else {
            await ctx.reply(formatMessage(
                'SHUTDOWN FAILED',
                `Error: ${servers.error}`
            ));
        }
        await ctx.answerCbQuery();
    });
    
    // 3. Suspend all servers
    bot.action('admin_suspend', async (ctx) => {
        const userId = ctx.from.id;
        if (!db.isAdmin(userId)) return;
        
        await ctx.reply(formatMessage(
            'SUSPEND ALL',
            'Confirm suspend ALL servers?\nUsers cannot access suspended servers.'
        ), Markup.inlineKeyboard([
            [Markup.button.callback('✅ YES - Suspend All', 'confirm_suspend')],
            [Markup.button.callback('❌ NO - Cancel', 'cancel_admin')]
        ]));
        await ctx.answerCbQuery();
    });
    
    bot.action('confirm_suspend', async (ctx) => {
        const userId = ctx.from.id;
        if (!db.isAdmin(userId)) return;
        
        await ctx.editMessageText('Suspending all servers...');
        
        const servers = await ptero.getAllServers();
        if (servers.success) {
            let count = 0;
            for (const server of servers.servers) {
                const result = await ptero.suspendServer(server.attributes.id);
                if (result.success) count++;
            }
            await ctx.reply(formatMessage(
                'SUSPEND COMPLETE',
                `Successfully suspended ${count} servers`
            ));
        }
        await ctx.answerCbQuery();
    });
    
    // 4. Restart all servers
    bot.action('admin_restart', async (ctx) => {
        const userId = ctx.from.id;
        if (!db.isAdmin(userId)) return;
        
        await ctx.reply(formatMessage(
            'RESTART ALL',
            'Confirm restart ALL servers?\nThis will restart all running servers.'
        ), Markup.inlineKeyboard([
            [Markup.button.callback('✅ YES - Restart All', 'confirm_restart')],
            [Markup.button.callback('❌ NO - Cancel', 'cancel_admin')]
        ]));
        await ctx.answerCbQuery();
    });
    
    bot.action('confirm_restart', async (ctx) => {
        const userId = ctx.from.id;
        if (!db.isAdmin(userId)) return;
        
        await ctx.editMessageText('Restarting all servers...');
        
        const servers = await ptero.getAllServers();
        if (servers.success) {
            let count = 0;
            for (const server of servers.servers) {
                const result = await ptero.restartServer(server.attributes.id);
                if (result.success) count++;
            }
            await ctx.reply(formatMessage(
                'RESTART COMPLETE',
                `Successfully restarted ${count} servers`
            ));
        }
        await ctx.answerCbQuery();
    });
    
    // 5. Confirm payment
    bot.action('admin_confirm', async (ctx) => {
        const userId = ctx.from.id;
        if (!db.isAdmin(userId)) return;
        
        const payments = db.getPayments();
        const pending = Object.values(payments).filter(p => !p.confirmed);
        
        if (pending.length === 0) {
            await ctx.reply(formatMessage('NO PENDING', 'No pending payments'));
            return;
        }
        
        let message = `╭━〔 PENDING PAYMENTS 〕━┈⊷\n`;
        pending.forEach((payment, index) => {
            message += `┃✮│➣ ${index + 1}. User: ${payment.userId}\n`;
            message += `┃✮│➣ TX: ${payment.transactionId}\n`;
            message += `┃✮│➣ Amount: ${payment.amount}\n`;
            message += `┃✮│➣ Method: ${payment.method}\n`;
        });
        message += `╰━━━━━━━━━━━━━━━━━┈⊷\n\nUse: /approve <payment_number>`;
        
        await ctx.reply(message);
        await ctx.answerCbQuery();
    });
    
    // 6. Bot stats
    bot.action('admin_stats', async (ctx) => {
        const userId = ctx.from.id;
        if (!db.isAdmin(userId)) return;
        
        const users = db.getUsers();
        const servers = db.getServers();
        const payments = db.getPayments();
        
        const totalUsers = Object.keys(users).length;
        const totalServers = Object.keys(servers).length;
        const totalPayments = Object.keys(payments).length;
        const confirmedPayments = Object.values(payments).filter(p => p.confirmed).length;
        
        await ctx.reply(formatMessage(
            'BOT STATISTICS',
            `Total Users: ${totalUsers}\n` +
            `Total Servers: ${totalServers}\n` +
            `Total Payments: ${totalPayments}\n` +
            `Confirmed Payments: ${confirmedPayments}\n` +
            `Bot: ${config.bot_name}\n` +
            `Owner: ${config.owner}`
        ));
        await ctx.answerCbQuery();
    });
    
    // 7. User list
    bot.action('admin_users', async (ctx) => {
        const userId = ctx.from.id;
        if (!db.isAdmin(userId)) return;
        
        const users = db.getUsers();
        const userList = Object.values(users).slice(0, 20); // Show first 20 users
        
        let message = `╭━〔 USER LIST 〕━┈⊷\n`;
        userList.forEach((user, index) => {
            const servers = db.getUserServers(user.id);
            message += `┃✮│➣ ${index + 1}. @${user.username}\n`;
            message += `┃✮│➣ ID: ${user.id}\n`;
            message += `┃✮│➣ Servers: ${servers.length}\n`;
        });
        message += `╰━━━━━━━━━━━━━━━━━┈⊷\n\nTotal Users: ${Object.keys(users).length}`;
        
        await ctx.reply(message);
        await ctx.answerCbQuery();
    });
    
    // Cancel action
    bot.action('cancel_admin', async (ctx) => {
        await ctx.deleteMessage();
        await ctx.answerCbQuery('Action cancelled');
    });
    
    // Admin command: /approve <number>
    bot.command('approve', async (ctx) => {
        const userId = ctx.from.id;
        if (!db.isAdmin(userId)) return;
        
        const args = ctx.message.text.split(' ');
        if (args.length < 2) {
            await ctx.reply(formatMessage('ERROR', 'Usage: /approve <payment_number>'));
            return;
        }
        
        const paymentNum = parseInt(args[1]);
        const payments = db.getPayments();
        const pending = Object.values(payments).filter(p => !p.confirmed);
        
        if (paymentNum < 1 || paymentNum > pending.length) {
            await ctx.reply(formatMessage('ERROR', 'Invalid payment number'));
            return;
        }
        
        const payment = pending[paymentNum - 1];
        payment.confirmed = true;
        
        // Find payment in object and update
        for (const [key, value] of Object.entries(payments)) {
            if (value.id === payment.id) {
                payments[key] = payment;
                break;
            }
        }
        
        db.savePayments(payments);
        
        // Notify user
        try {
            await ctx.telegram.sendMessage(payment.userId, 
                formatMessage('PAYMENT APPROVED', 'Your payment has been confirmed!\nServer activated for 30 days.')
            );
        } catch (error) {
            console.log('Could not notify user:', error.message);
        }
        
        await ctx.reply(formatMessage(
            'PAYMENT APPROVED',
            `Payment ${paymentNum} confirmed\nUser: ${payment.userId}\nTX: ${payment.transactionId}`
        ));
    });
};