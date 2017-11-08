import * as builder from "botbuilder";
import BaseDialog from "./basedialog";
import ProductController from "../controllers/ProductController";

class BrandProductsDialog extends BaseDialog{

    private static readonly pageLength = 5;
    private static readonly brandProductsIntentName = "research in brands";
    private static readonly loadBrandProductsIntentName = "Search more brands";

    constructor() {
        super();
        this.dialog = [
            (session, args, next) => {
                if((session.userData.brandProductPage == null) || (args.intent.intent === BrandProductsDialog.brandProductsIntentName)) {
                    session.userData.brandProductPage = 0;
                }
                else if(args.intent.intent === BrandProductsDialog.loadBrandProductsIntentName) {
                    session.userData.brandProductPage++;
                }
                let parameters = builder.EntityRecognizer.findEntity(args.intent.entities, "parameters");  
                ProductController.getBrandProducts(parameters.entity.brands, BrandProductsDialog.pageLength, session.userData.brandProductPage).then(productResponse => {
                    let brandProductMessage = new builder.Message(session);
                    let brandProductMessageAttachments: builder.AttachmentType[] = [];
                    brandProductMessage.attachmentLayout(builder.AttachmentLayout.carousel);
                    productResponse.hits.forEach(product => {
                        brandProductMessageAttachments.push(ProductController.buildProductCard(product, session));
                    });
                    if(productResponse.nbPages > productResponse.page + 1) {
                        // Load more brand product card
                        brandProductMessageAttachments.push(
                            new builder.HeroCard(session)
                                .title("Load more")
                                .images([builder.CardImage.create(session, "http://tools.expertime.digital/bot/logopr.jpg")])
                                .buttons([{
                                    type: "postBack",
                                    title: "Load more",
                                    value: `search more brands ${parameters.entity.brands}`
                                }])
                        );
                    }
                    else {
                        session.userData.brandProductPage = 0;
                    }
                    brandProductMessage.attachments(brandProductMessageAttachments);
                    session.send(brandProductMessage);
                    session.endDialog();
                }, reason => {
                    session.send(reason);
                    session.endDialog();
                });
            }
        ]
    }
}

export default BrandProductsDialog;