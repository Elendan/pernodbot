import * as builder from "botbuilder";
import BaseDialog from "./BaseDialog";
import MessagesController from "./../controllers/MessagesController";
import ChatBase from "./../controllers/ChatbaseController";

class BuyProductDialog extends BaseDialog {
    constructor() {
        super();
        this.dialog = [
            (session, args, next) => {
                let carousel = MessagesController.BuyProductCarousel(session);
                let quickRepliesCard = new builder.HeroCard(session);
                let quickRepliesButtons: builder.ICardAction[] = [];

                quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons);
                // Defines message type depending on the chatting platform
                switch (session.message.source) {
                    case "facebook":
                        ChatBase.sendHandled(session, "facebook", session.message.text, args.intent.intent);
                        let facebookMessage = new builder.Message(session);
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
                        ChatBase.sendHandled(session, "web", session.message.text, args.intent.intent);
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