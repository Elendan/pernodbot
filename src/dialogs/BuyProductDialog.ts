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
                let quickRepliesButtons: builder.ICardAction[] =  [];
                quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons, "Back to Brands 🔙", "Brands");
                quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons);
                carousel = MessagesController.BuyProductCarousel(session);
                session.send(carousel);
                session.send(MessagesController.sendQuickReplies(session, quickRepliesCard, "What do you want to do ?"));
                session.endDialog();
            }
        ]
    }
}

export default BuyProductDialog;