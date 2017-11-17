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
                carousel = MessagesController.BuyProductCarousel(session);
                session.send(carousel);
                session.endDialog();
            }
        ]
    }
}

export default BuyProductDialog;