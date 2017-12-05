import "dotenv/config";
import * as restify from "restify";
import PernodBot from "./PernodBot";

const bot = new PernodBot();

// Setup Restify Server
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log('%s listening to %s', server.name, server.url);
});

// Listen for messages from users 
server.post('/api/messages', bot.connector.listen());