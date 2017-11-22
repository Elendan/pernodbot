import * as builder from "botbuilder";
import BaseDialog from "./basedialog";
import ProductController from "../controllers/ProductController";
import MessagesController from "../controllers/MessagesController";

class InfoDialog extends BaseDialog {
    constructor() {
        super();
        this.dialog = [
            (session, args, next) => {
                let parameters = builder.EntityRecognizer.findEntity(args.intent.entities, "parameters");
                ProductController.getProductById(parameters.entity.product).then(product => {
                    if (parameters.entity.product && parameters.entity.product.length) {
                        session.userData.informations = ProductController.getInformations(product, session);
                    }
                    let productMessage = new builder.Message(session);
                    let productMessageAttachments: builder.AttachmentType[] = [];
                    productMessage.attachmentLayout(builder.AttachmentLayout.list);
                    let quickRepliesCard = new builder.HeroCard(session);
                    let quickRepliesButtons: builder.ICardAction[] = [];
                    if (session.userData.informations && session.userData.informations.length) {
                        for (let i in session.userData.informations) {
                            quickRepliesButtons.push({
                                type: "postBack",
                                title: session.userData.informations[i],
                                value: session.userData.informations[i]
                            });
                        }
                    }
                    quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons);
                    productMessageAttachments.push(quickRepliesCard);
                    productMessage.attachments(productMessageAttachments);
                    productMessage.text("Want to know more about");
                    session.send(productMessage);
                    session.endDialog();
                }, reason => {
                    session.send(reason);
                    session.endDialog();
                });
            }
        ]
    }
}

export default InfoDialog;