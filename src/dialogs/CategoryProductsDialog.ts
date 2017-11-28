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
                let parameters = builder.EntityRecognizer.findEntity(args.intent.entities, "parameters");
                session.userData.idToRetrieve = parameters.entity.category;
                ProductController.getCategoryProducts(parameters.entity.category, CategoryProductDialog._maxPageLength, session.userData.categoryProductPage, CategoryProductDialog._isFirstRound).then(productResponse => {
                    if (productResponse !== null) {
                        productResponse.hits.forEach(p => {
                            if (p.size) {
                                session.userData.availableSizes.push(`${parseFloat(p.size.id)}`);
                            }
                        });
                    }
                    session.userData.availableSizes = new Set(session.userData.availableSizes);
                    session.userData.availableSizes = Array.from(session.userData.availableSizes);
                    session.userData.availableSizes = session.userData.availableSizes.sort(function (a, b) { return a - b });
                }).then(() => ProductController.getCategoryProducts(parameters.entity.category, CategoryProductDialog._pageLength, session.userData.categoryProductPage).then(productResponse => {
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
                    switch (session.message.source) {
                        case "facebook":
                            session.userData.quickReplies = MessengerController.QuickReplies();
                            let facebookMessage = new builder.Message(session);
                            if (categoryProductMessageAttachments.length) {
                                facebookMessage.attachmentLayout(builder.AttachmentLayout.carousel);
                                facebookMessage.attachments(categoryProductMessageAttachments);
                            }
                            else {
                                facebookMessage.text("Sorry, we don't have any products in this category yet.");
                            }
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
                            session.send(categoryProductMessageAttachments.length ? categoryProductMessage : "Sorry, we don't have any products of this brand yet");
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