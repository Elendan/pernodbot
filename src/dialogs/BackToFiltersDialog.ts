import * as builder from "botbuilder";
import BaseDialog from "./basedialog";
import MessagesController from "../controllers/MessagesController";

class BackToFiltersDialog extends BaseDialog {
    constructor() {
        super();
        this.dialog = [
            (session, args, next) => {
                let quickRepliesCard = new builder.HeroCard(session);
                let quickRepliesButtons: builder.ICardAction[] = [];
                quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons, "Brands 🍾");
                quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons, "Categories 🍸");
                switch (session.message.source) {
                    case "facebook":
                        let facebookMessage = new builder.Message(session).text("You can find products using the buttons below or simply typing the name of the product.");
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
                        session.send(MessagesController.sendQuickReplies(session, quickRepliesCard, "You can find products using the buttons below or simply typing the name of the product."));
                        break;
                }
                session.endDialog();
            }
        ]
    }
}

export default BackToFiltersDialog;