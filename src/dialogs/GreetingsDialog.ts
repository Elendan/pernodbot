import * as builder from "botbuilder";
import * as facebook from "botbuilder-facebookextension";
import BaseDialog from "./basedialog";
import MessagesController from "../controllers/MessagesController";
import BroadcastController from "../controllers/BroadcastController";
import ChatBase from "../controllers/ChatbaseController";
import { Session } from "botbuilder";
import * as Request from "tedious";

let config = {
    userName: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    server: process.env.DATABASE_SERVER,
    options: {
        database: process.env.DATABASE_NAME,
        encrypt: true
    }
}

class GreetingsDialog extends BaseDialog {

    private static _canPush: boolean = true;

    constructor() {
        super();
        this.dialog = [
            (session, args, next) => {
                let quickRepliesCard = new builder.HeroCard(session);
                const quickRepliesButtons: builder.ICardAction[] = [];
                // registers the sessions
                let connection = new Request.Connection(config);
                function RegisterSession() {
                    console.log('Reading rows from the Table...');
            
                    // Read all rows from table
                    let request = new Request.Request(
                        "INSERT INTO [pernotbotdb].[dbo].[Sessions] ([Session], [Type], [UserId]) VALUES (1, 1, 1)",
                        function (err, rowCount, rows) {
                            console.log(rowCount + ' row(s) returned');
                            //process.exit();
                        }
                    );
                    connection.execSql(request);
                }
                connection.on('connect', function (err) {
                    if (err) {
                        console.log(err);
                        console.log("ERROR")
                    }
                    else {
                        RegisterSession();
                        console.log("test");
                    }
                });
                BroadcastController.RegisterSession(BaseDialog.SessionDataStorage, session);
                quickRepliesCard.text("You can find products using the buttons below or simply typing the name of the product.");
                quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons, "Brands 🍾");
                quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons, "Categories 🍸");
                // Defines message type depending on the chatting platform
                ChatBase.sendHandled(session, session.message.source, session.message.text, args.intent.intent);
                switch (session.message.source) {
                    case "facebook":
                        const facebookMessage = new builder.Message(session).text(`Hello ${session.userData.first_name}, welcome in the Pernod Ricard's catalog of products.`);
                        session.send(facebookMessage);
                        facebookMessage.text("You can find products using the buttons below or simply typing the name of the product.");
                        facebookMessage.sourceEvent({
                            facebook: {
                                quick_replies: [
                                    {
                                        content_type: "text",
                                        title: "Brands 🍾",
                                        payload: "Brands"
                                    },
                                    {
                                        content_type: "text",
                                        title: "Categories 🍸",
                                        payload: "Categories"
                                    }
                                ]
                            }
                        });
                        session.send(facebookMessage);
                        break;
                    default:
                        session.send("Hello and welcome in the Pernod Ricard's catalog of products.");
                        session.send(MessagesController.sendQuickReplies(session, quickRepliesCard));
                        break;
                }
                session.endDialog();
            }
        ]
    }
}

export default GreetingsDialog;
