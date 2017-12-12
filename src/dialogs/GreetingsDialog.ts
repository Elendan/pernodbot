import * as builder from "botbuilder";
import * as facebook from "botbuilder-facebookextension";
import BaseDialog from "./basedialog";
import MessagesController from "../controllers/MessagesController";
import ChatBase from "../controllers/ChatbaseController";
import { Session } from "botbuilder";

class GreetingsDialog extends BaseDialog {

    private static _canPush: boolean = true;

    constructor() {
        super();
        this.dialog = [
            (session, args, next) => {
                if (session.userData. )
                // May need to store the conversation id's in database
                BaseDialog.SessionDataStorage.forEach(s => {
                    if (s.uid === session.message.address.user.id) { // If user id already exists, then we don't add the session to the set
                        GreetingsDialog._canPush = false;
                    }
                });
                if (GreetingsDialog._canPush) { // If it doesn't exist, we add the session and the uid to the set
                    BaseDialog.SessionDataStorage.add({
                        s: session,
                        uid: session.message.address.user.id
                    });
                }
                let quickRepliesCard = new builder.HeroCard(session);
                const quickRepliesButtons: builder.ICardAction[] = [];
                quickRepliesCard.text("You can find products using the buttons below or simply typing the name of the product.");
                quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons, "Brands 🍾");
                quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons, "Categories 🍸");
                // Defines message type depending on the chatting platform
                ChatBase.sendHandled(session, session.message.source, session.message.text, args.intent.intent);
                switch (session.message.source) {
                    case "facebook":
                        /*BaseDialog.SessionDataStorage.forEach(s => { // This is just an example for sending a message to all the registered sessions.
                            s.s.send(`uid : ${session.message.address.user.id}`);
                        });*/
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
                        BaseDialog.SessionDataStorage.forEach(s => {
                            s.s.send("This message has been sent to every registered session.");
                        });
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
