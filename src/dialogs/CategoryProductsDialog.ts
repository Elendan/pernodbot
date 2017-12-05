import * as builder from "botbuilder";
import BaseDialog from "./basedialog";
import ProductController from "../controllers/ProductController";
import MessagesController from "../controllers/MessagesController";
import ProductType from "../enums/ProductType";
import MessengerController from "../controllers/MessengerController";

class CategoryProductDialog extends BaseDialog {

    private static readonly _loadCategoryProductsIntentName: string = "search more categories";
    private static readonly _categoryProductIntentName: string = "research in category";
    private static readonly _maxPageLength: number = 1000;
    private static readonly _pageLength: number = 5;
    private static _isFirstRound: boolean;

    constructor() {
        super();
        this.dialog = [
            (session, args, next) => {
                session.send("Understood, let me search that for you ⏳");
                session.userData.productType = ProductType.Category;
                if (session.userData.categoryProductPage == null || (args.intent.intent === CategoryProductDialog._categoryProductIntentName)) {
                    session.userData.availableSizes = [];
                    session.userData.categoryProductPage = 0;
                    CategoryProductDialog._isFirstRound = true;
                }
                else if (args.intent.intent === CategoryProductDialog._loadCategoryProductsIntentName) {
                    session.userData.categoryProductPage++;
                    CategoryProductDialog._isFirstRound = false;
                }
                const parameters = builder.EntityRecognizer.findEntity(args.intent.entities, "parameters");
                session.userData.idToRetrieve = parameters.entity.category;
                // Get all products size
                ProductController.getCategoryProducts(parameters.entity.category, CategoryProductDialog._maxPageLength, session.userData.categoryProductPage, CategoryProductDialog._isFirstRound).then(productResponse => {
                    if (productResponse !== null) {
                        productResponse.hits.forEach(p => {
                            if (p.size && !session.userData.availableSizes.includes(`${parseFloat(p.size.id)}`)) {
                                session.userData.availableSizes.push(`${parseFloat(p.size.id)}`);
                            }
                        });
                    }
                    // sort sizes by ascending order
                    session.userData.availableSizes = session.userData.availableSizes.sort(function (a, b) { return a - b });
                }).then(() => ProductController.getCategoryProducts(parameters.entity.category, CategoryProductDialog._pageLength, session.userData.categoryProductPage).then(productResponse => {
                    const categoryProductMessage = new builder.Message(session);
                    const categoryProductMessageAttachments: builder.AttachmentType[] = [];
                    const quickRepliesButtons: builder.ICardAction[] = [];
                    let quickRepliesCard = new builder.HeroCard(session);

                    categoryProductMessage.attachmentLayout(builder.AttachmentLayout.carousel);
                    productResponse.hits.forEach(product => {
                        categoryProductMessageAttachments.push(ProductController.buildProductCard(product, session));
                    });
                    if (!categoryProductMessageAttachments.length) {
                        session.send("Sorry, we don't have any products in this category yet");
                        session.endDialog();
                        return;
                    }
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
                    switch (session.message.source) {
                        case "facebook":
                            session.userData.quickReplies = MessengerController.QuickReplies();
                            const facebookMessage = new builder.Message(session);

                            facebookMessage.attachmentLayout(builder.AttachmentLayout.carousel);
                            facebookMessage.attachments(categoryProductMessageAttachments);
                            if (productResponse.nbHits > 8) {
                                session.userData.quickReplies.facebook.quick_replies.push({
                                    content_type: "text",
                                    title: "Filter by Size",
                                    payload: "Filter by Size"
                                });
                            }
                            session.userData.quickReplies.facebook.quick_replies.push({
                                content_type: "text",
                                title: "Back to Categories 🔙",
                                payload: "Categories"
                            });
                            facebookMessage.sourceEvent(session.userData.quickReplies);
                            session.send(facebookMessage);
                            break;
                        default:
                            session.send(categoryProductMessage);
                            if (productResponse.nbHits > 8) {
                                quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons, "Filter by Size");
                            }
                            quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons, null, "Categories");
                            session.send(MessagesController.sendQuickReplies(session, quickRepliesCard));
                            break;
                    }
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