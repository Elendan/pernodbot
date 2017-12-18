import * as builder from "botbuilder";
import * as facebook from "botbuilder-facebookextension";
import BaseDialog from "./basedialog";
import MessagesController from "../controllers/MessagesController";
import BroadcastController from "../controllers/BroadcastController";
import ChatBase from "../controllers/ChatbaseController";
import { Session } from "botbuilder";

class GreetingsDialog extends BaseDialog {

    private static _canPush: boolean = true;

    constructor() {
        super();
        this.dialog = [
            (session, args, next) => {
                let quickRepliesCard = new builder.HeroCard(session);
                const quickRepliesButtons: builder.ICardAction[] = [];
                // registers the sessions
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
