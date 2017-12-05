import * as builder from "botbuilder";
import BaseDialog from "./basedialog";
import ProductController from "../controllers/ProductController";
import MessagesController from "../controllers/MessagesController";
import MessengerController from "../controllers/MessengerController";

class InfoDialog extends BaseDialog {
    constructor() {
        super();
        this.dialog = [
            (session, args, next) => {
                session.userData.quickReplies = MessengerController.QuickReplies();
                const parameters = builder.EntityRecognizer.findEntity(args.intent.entities, "parameters");
                ProductController.getProductById(parameters.entity.product).then(product => {
                    if (parameters.entity.product && parameters.entity.product.length) {
                        session.userData.informations = ProductController.getInformations(product, session);
                    }
                    const productMessage = new builder.Message(session);
                    const productMessageAttachments: builder.AttachmentType[] = [];
                    productMessage.attachmentLayout(builder.AttachmentLayout.list);
                    let quickRepliesCard = new builder.HeroCard(session);
                    const quickRepliesButtons: builder.ICardAction[] = [];
                    // Fill the array with the selected product informations
                    if (session.userData.informations && session.userData.informations.length) {
                        for (let i in session.userData.informations) {
                            quickRepliesButtons.push({
                                type: "postBack",
                                title: session.userData.informations[i],
                                value: session.userData.informations[i]
                            });
                            session.userData.quickReplies.facebook.quick_replies.push({
                                content_type: "text",
                                title: session.userData.informations[i],
                                payload: session.userData.informations[i]
                            });
                        }
                    }
                    quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons);
                    productMessageAttachments.push(quickRepliesCard);
                    productMessage.attachments(productMessageAttachments);
                    // Defines message type depending on the chatting platform
                    switch (session.message.source) {
                        case "facebook":
                            const facebookMessage = new builder.Message(session).text("Want to know more about");
                            facebookMessage.sourceEvent(session.userData.quickReplies);
                            session.send(facebookMessage);
                            break;
                        default:
                            productMessage.text("Want to know more about");
                            session.send(productMessage);
                            break;
                    }
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