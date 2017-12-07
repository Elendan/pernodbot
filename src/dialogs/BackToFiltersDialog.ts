import * as builder from "botbuilder";
import BaseDialog from "./basedialog";
import MessagesController from "../controllers/MessagesController";
import MessengerController from "../controllers/MessengerController";
import ChatBase from "../controllers/ChatbaseController";

class BackToFiltersDialog extends BaseDialog {
    constructor() {
        super();
        this.dialog = [
            (session, args, next) => {
                let quickRepliesCard = new builder.HeroCard(session);
                let quickRepliesButtons: builder.ICardAction[] = [];

                quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons, "Brands 🍾");
                quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons, "Categories 🍸");
                // Defines message type depending on the chatting platform
                ChatBase.sendHandled(session, session.message.source, session.message.text, args.intent.intent);
                switch (session.message.source) {
                    case "facebook":
                        session.send(MessengerController.MenuReplies(session));
                        break;
                    default:
                        session.send(MessagesController.sendQuickReplies(session, quickRepliesCard, "You can find products using the buttons below or simply typing the name of the product."));
                        break;
                }
                session.endDialog();
            }
        ]
    }
}

export default BackToFiltersDialog;