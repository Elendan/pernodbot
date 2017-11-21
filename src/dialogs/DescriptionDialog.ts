import * as builder from "botbuilder";
import BaseDialog from "./basedialog";
import ProductController from "../controllers/ProductController";

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
                    if (product.mediaList.length > 0 && product.mediaList[0].urls) {
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
                    if (session.userData.informations && session.userData.informations.length > 0) {
                        quickRepliesButtons.push({
                            type: "postBack",
                            title: "Buy this product 🛒",
                            value: "Buy this product"
                        });
                        quickRepliesButtons.push({
                            type: "postBack",
                            title: "More Details",
                            value: "More Details"
                        });
                    }
                    quickRepliesButtons.push({
                        type: "postBack",
                        title: "Back to Filters 🔙",
                        value: "Back to Filters 🔙"
                    });
                    quickRepliesCard.buttons(quickRepliesButtons);
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