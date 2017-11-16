import * as builder from "botbuilder";
import BaseDialog from "./basedialog";
import ProductController from "../controllers/ProductController";
import MessagesController from "../controllers/MessagesController";

class CategoryProductDialog extends BaseDialog {

    private static readonly pageLength = 5;
    private static readonly categoryProductIntentName = "research in category";
    private static readonly loadCategoryProductsIntentName = "search more categories";

    constructor() {
        super();
        this.dialog = [
            (session, args, next) => {
                session.userData.availableSizes = [];
                if ((session.userData.categoryProductPage == null) || (args.intent.intent === CategoryProductDialog.categoryProductIntentName)) {
                    session.userData.categoryProductPage = 0;
                }
                else if (args.intent.intent === CategoryProductDialog.loadCategoryProductsIntentName) {
                    session.userData.categoryProductPage++;
                }
                let parameters = builder.EntityRecognizer.findEntity(args.intent.entities, "parameters");
                ProductController.getCategoryProducts(parameters.entity.category, 1000, session.userData.categoryProductPage).then(productResponse => {
                    productResponse.hits.forEach(p => {
                        if (p.size !== null) {
                            session.userData.availableSizes.push(p.size.id);
                        }
                    });
                    session.userData.availableSizes = new Set(session.userData.availableSizes);
                    session.userData.availableSizes = Array.from(session.userData.availableSizes);
                    session.userData.availableSizes = session.userData.availableSizes.sort(function(a, b) {return a - b});
                }).then(() => ProductController.getCategoryProducts(parameters.entity.category, CategoryProductDialog.pageLength, session.userData.categoryProductPage).then(productResponse => {
                    let categoryProductMessage = new builder.Message(session);
                    let categoryProductMessageAttachments: builder.AttachmentType[] = [];
                    let quickRepliesButtons: builder.ICardAction[] = [];
                    let quickRepliesCard = new builder.HeroCard(session);
                    categoryProductMessage.attachmentLayout(builder.AttachmentLayout.carousel);
                    productResponse.hits.forEach(product => {
                        categoryProductMessageAttachments.push(ProductController.buildProductCard(product, session));
                    });
                    if (productResponse.nbPages > productResponse.page + 1) {
                        // Load more category product card
                        categoryProductMessageAttachments.push(
                            new builder.HeroCard(session)
                                .title("Load more")
                                .images([builder.CardImage.create(session, "http://tools.expertime.digital/bot/load-more.png")])
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
                    if (productResponse.nbHits > 8) {
                        quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons, "Filter by size");
                    }
                    quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons, undefined, "Categories");
                    session.send(MessagesController.sendQuickReplies(session, quickRepliesCard));
                    session.endDialog();
                }, reason => {
                    session.send(reason);
                    session.endDialog();
                }));
            }
        ]
    }
}

export default CategoryProductDialog;