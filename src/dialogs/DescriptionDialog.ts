import * as builder from "botbuilder";
import BaseDialog from "./basedialog";
import ProductController from "../controllers/ProductController";
import MessagesController from "../controllers/MessagesController";
import MessengerController from "../controllers/MessengerController";

class DescriptionDialog extends BaseDialog {
    constructor() {
        super();
        this.dialog = [
            (session, args, next) => {
                session.userData.quickReplies = MessengerController.QuickReplies();
                const parameters = builder.EntityRecognizer.findEntity(args.intent.entities, "parameters");
                ProductController.getProductById(parameters.entity.product).then(product => {
                    const productMessage = new builder.Message(session);
                    const productMessageAttachments: builder.AttachmentType[] = [];
                    productMessage.attachmentLayout(builder.AttachmentLayout.list);
                    let quickRepliesCard = new builder.HeroCard(session);
                    const quickRepliesButtons: builder.ICardAction[] = [];
                    if (product.mediaList && product.mediaList.length && product.mediaList[0].urls) {
                        // Defines message type depending on the chatting platform
                        switch (session.message.source) {
                            case "facebook":
                                let image = new builder.Message(session).addAttachment({
                                    contentUrl: product.mediaList[0].urls.bamArticleFull,
                                    contentType: "image/png",
                                    name: "image"
                                });
                                session.send(image);
                                break;
                            default:
                                productMessageAttachments.push(
                                    new builder.HeroCard(session)
                                        .images([builder.CardImage.create(session, product.mediaList[0].urls.bamArticleFull)])
                                        .title(product.productName)
                                );
                                productMessage.attachments(productMessageAttachments);
                                session.send(productMessage);
                                productMessageAttachments.pop();
                                break;
                        }
                    }
                    session.send(!product.description ? "No description available for this product." : product.description);
                    session.userData.informations = ProductController.getInformations(product, session);
                    if (session.userData.informations && session.userData.informations.length) {
                        quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons, "More Details", "More Details");
                        session.userData.quickReplies.facebook.quick_replies.push({
                            content_type: "text",
                            title: "More Details",
                            payload: "More Details"
                        });
                    }
                    // Defines message type depending on the chatting platform
                    switch (session.message.source) {
                        case "facebook":
                            const facebookMessage = new builder.Message(session).text("What do you want to do ?");
                            
                            session.userData.quickReplies.facebook.quick_replies.push(
                                {
                                    content_type: "text",
                                    title: "Buy this product 🛒",
                                    payload: "Buy this product 🛒"
                                },
                                {
                                    content_type: "text",
                                    title: "Back to Menu 🔙",
                                    payload: "Back to Menu 🔙"
                                }
                            );
                            facebookMessage.sourceEvent(session.userData.quickReplies);
                            session.send(facebookMessage);
                            break;
                        default:
                            quickRepliesCard.text("What do you want to do ?");
                            quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons, "Buy this product 🛒", "Buy this product");
                            quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons, "Back to Menu 🔙");
                            productMessageAttachments.push(quickRepliesCard);
                            productMessage.attachments(productMessageAttachments);
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

export default DescriptionDialog;
