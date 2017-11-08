import * as builder from "botbuilder";
import BaseDialog from "./basedialog";
import ProductController from "../controllers/ProductController";

class CategoryProductDialog extends BaseDialog{

    private static readonly pageLength = 5;
    private static readonly categoryProductIntentName = "research in category";
    private static readonly loadCategoryProductsIntentName = "Search more categories";

    constructor() {
        super();
        this.dialog = [
            (session, args, next) => {
                if((session.userData.categoryProductPage == null) || (args.intent.intent === CategoryProductDialog.categoryProductIntentName)) {
                    session.userData.categoryProductPage = 0;
                }
                else if(args.intent.intent === CategoryProductDialog.loadCategoryProductsIntentName) {
                    session.userData.categoryProductPage++;
                }
                let parameters = builder.EntityRecognizer.findEntity(args.intent.entities, "parameters");
                console.log("step 1");
                console.log(`cat : ${JSON.stringify(parameters.entity)}\nintent : ${JSON.stringify(args.intent.entities)}`);  
                ProductController.getCategoryProducts(parameters.entity.category, CategoryProductDialog.pageLength, session.userData.categoryProductPage).then(productResponse => {
                    console.log("step 2");
                    let categoryProductMessage = new builder.Message(session);
                    let categoryProductMessageAttachments: builder.AttachmentType[] = [];
                    categoryProductMessage.attachmentLayout(builder.AttachmentLayout.carousel);
                    productResponse.hits.forEach(product => {
                        console.log("step 3");
                        categoryProductMessageAttachments.push(ProductController.buildProductCard(product, session));
                    });
                    if(productResponse.nbPages > productResponse.page + 1) {
                        // Load more category product card
                        categoryProductMessageAttachments.push(
                            new builder.HeroCard(session)
                                .title("Load more")
                                .images([builder.CardImage.create(session, "http://tools.expertime.digital/bot/logopr.jpg")])
                                .buttons([{
                                    type: "postBack",
                                    title: "Load more",
                                    value: `search more categories ${parameters.entity.category}`
                                }])
                        );
                    }
                    else {
                        session.userData.categoryProductPage = 0;
                    }
                    categoryProductMessage.attachments(categoryProductMessageAttachments);
                    session.send(categoryProductMessage);
                    session.endDialog();
                }, reason => {
                    session.send(reason);
                    session.endDialog();
                });
            }
        ]
    }
}

export default CategoryProductDialog;