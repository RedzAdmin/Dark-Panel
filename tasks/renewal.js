const cron = require('node-cron');
const helpers = require('../utils/helpers');

module.exports = function(bot, db) {
    // Check for expired servers every hour
    cron.schedule('0 * * * *', async () => {
        console.log('Checking for expired servers...');
        
        const servers = db.getAllServers();
        const now = Date.now();
        
        for (const server of servers) {
            if (server.expires <= now && server.active) {
                // Mark server as inactive
                server.active = false;
                const allServers = db.getServers();
                allServers[server.id] = server;
                db.saveServers(allServers);
                
                // Notify user
                try {
                    await bot.telegram.sendMessage(server.userId,
                        `╭━〔 SERVER EXPIRED 〕━┈⊷
┃✮│➣ Server: ${server.plan.toUpperCase()}
┃✮│➣ Status: Expired
┃✮│➣ Action: Use Renew Server
╰━━━━━━━━━━━━━━━━━┈⊷`
                    );
                } catch (error) {
                    console.log('Could not notify user:', error.message);
                }
            }
        }
    });
    
    console.log('Auto-renewal task started');
};