import * as builder from "botbuilder";
import BaseDialog from "./basedialog";
import ProductController from "../controllers/ProductController";
import MessagesController from "../controllers/MessagesController";

class DescriptionDialog extends BaseDialog {
    constructor() {
        super();
        this.dialog = [
            (session, args, next) => {
                let parameters = builder.EntityRecognizer.findEntity(args.intent.entities, "parameters");
                ProductController.getProductById(parameters.entity.product).then(product => {
                    let productMessage = new builder.Message(session);
                    let productMessageAttachments: builder.AttachmentType[] = [];
                    productMessage.attachmentLayout(builder.AttachmentLayout.list);
                    let quickRepliesCard = new builder.HeroCard(session);
                    let quickRepliesButtons: builder.ICardAction[] = [];
                    if (product.mediaList && product.mediaList.length && product.mediaList[0].urls) {
                        productMessageAttachments.push(
                            new builder.HeroCard(session)
                                .images([builder.CardImage.create(session, product.mediaList[0].urls.bamArticleFull)])
                        );
                        productMessage.attachments(productMessageAttachments);
                        session.send(productMessage);
                        productMessageAttachments.pop();
                    }
                    session.send(!product.description ? "No description available for this product." : product.description);
                    quickRepliesCard.text("What do you want to do ?");
                    session.userData.informations = ProductController.getInformations(product, session);
                    if (session.userData.informations && session.userData.informations.length) {
                        quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons, "More Details", "More Details");
                    }
                    quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons, "Buy this product 🛒", "Buy this product")
                    quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons, "Back to Menu 🔙");
                    productMessageAttachments.push(quickRepliesCard);
                    productMessage.attachments(productMessageAttachments);
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

export default DescriptionDialog;