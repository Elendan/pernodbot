import * as builder from "botbuilder";
import BaseDialog from "./BaseDialog";
import ProductController from "./../controllers/ProductController";
import MessagesController from "./../controllers/MessagesController";

class BuyProductDialog extends BaseDialog {
    constructor() {
        super();
        this.dialog = [
            (session, args, next) => {
                let carousel = new builder.Message(session);
                let quickRepliesCard = new builder.HeroCard(session);
                let quickRepliesButtons: builder.ICardAction[] = [];

                quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons);
                carousel = MessagesController.BuyProductCarousel(session);
                switch (session.message.source) {
                    case "facebook":
                        let facebookMessage = new builder.Message(session)
                        facebookMessage = carousel;
                        facebookMessage.attachmentLayout(builder.AttachmentLayout.carousel);
                        facebookMessage.sourceEvent({
                            facebook: {
                                quick_replies: [
                                    {
                                        content_type: "text",
                                        title: "Back to Menu 🔙",
                                        payload: "Filters"
                                    }
                                ]
                            }
                        });
                        session.send(facebookMessage);
                        break;
                    default:
                        session.send(carousel);
                        session.send(MessagesController.sendQuickReplies(session, quickRepliesCard, "What do you want to do ?"));
                        break;
                }
                session.endDialog();
            }
        ]
    }
}

export default BuyProductDialog;