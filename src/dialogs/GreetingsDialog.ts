import * as builder from "botbuilder";
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
                // May need to store the conversation id's in database
                BaseDialog.SessionDataStorage.forEach(s => {
                    if (s.cid === session.message.address.conversation.id) {
                        GreetingsDialog._canPush = false;
                    }
                });
                if (GreetingsDialog._canPush) {
                    BaseDialog.SessionDataStorage.add({
                        s: session,
                        cid: session.message.address.conversation.id
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
                        BaseDialog.SessionDataStorage.forEach(s => {
                            s.s.send(`${session.message.address.conversation.id}`);
                        });
                        const facebookMessage = new builder.Message(session).text("Hello and welcome in the Pernod Ricard's catalog of products.");
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
