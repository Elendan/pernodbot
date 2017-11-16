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
                    }
                    productMessage.text(product.description === null || product.description === undefined ? "" : product.description);
                    session.userData.informations = ProductController.getInformations(product, session);
                    if (session.userData.informations !== null && session.userData.informations.length > 0) {
                        for (let i = 0; i < session.userData.informations.length; i++) {
                            quickRepliesButtons.push({
                                type: "postBack",
                                title: session.userData.informations[i],
                                value: session.userData.informations[i]
                            });
                        }
                    }
                    quickRepliesButtons.push({
                        type: "postBack",
                        title: "Back to filters 🔙",
                        value: "Back to filters 🔙"
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