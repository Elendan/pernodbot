import * as builder from "botbuilder";
import BaseDialog from "./basedialog";
import ProductController from "../controllers/ProductController";
import MessagesController from "../controllers/MessagesController";
import ProductType from "../enums/ProductType";
import MessengerController from "../controllers/MessengerController"

class BrandProductsDialog extends BaseDialog {

    private static readonly _loadBrandProductsIntentName: string = "Search more brands";
    private static readonly _brandProductsIntentName: string = "research in brands";
    private static readonly _maxPageLength: number = 1000;
    private static readonly _pageLength: number = 5;
    private static _isFirstRound: boolean;

    constructor() {
        super();
        this.dialog = [
            (session, args, next) => {
                session.send("Understood, let me search that for you ⏳");
                session.userData.productType = ProductType.Brand;
                if (session.userData.brandProductPage == null || (args.intent.intent === BrandProductsDialog._brandProductsIntentName)) {
                    session.userData.availableSizes = [];
                    session.userData.brandProductPage = 0;
                    BrandProductsDialog._isFirstRound = true;
                }
                else if (args.intent.intent === BrandProductsDialog._loadBrandProductsIntentName) {
                    session.userData.brandProductPage++;
                    BrandProductsDialog._isFirstRound = false;
                }
                const parameters = builder.EntityRecognizer.findEntity(args.intent.entities, "parameters");

                session.userData.idToRetrieve = parameters.entity.brands;
                ProductController.getBrandProducts(parameters.entity.brands, BrandProductsDialog._maxPageLength, session.userData.brandProductPage, BrandProductsDialog._isFirstRound).then(productResponse => {
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
                }).then(() => ProductController.getBrandProducts(parameters.entity.brands, BrandProductsDialog._pageLength, session.userData.brandProductPage).then(productResponse => {
                    let brandProductMessage = new builder.Message(session);
                    let brandProductMessageAttachments: builder.AttachmentType[] = [];
                    let quickRepliesButtons: builder.ICardAction[] = [];
                    let quickRepliesCard = new builder.HeroCard(session);

                    brandProductMessage.attachmentLayout(builder.AttachmentLayout.carousel);
                    productResponse.hits.forEach(product => {
                        brandProductMessageAttachments.push(ProductController.buildProductCard(product, session));
                    });
                    if (productResponse.nbPages > productResponse.page + 1) {
                        // Load more brand product card
                        brandProductMessageAttachments.push(
                            new builder.HeroCard(session)
                                .title("Load more")
                                .images([builder.CardImage.create(session, "http://tools.expertime.digital/bot/load-more.png")])
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
                    switch (session.message.source) {
                        case "facebook":
                            const facebookMessage = new builder.Message(session);
                            
                            session.userData.quickReplies = MessengerController.QuickReplies();
                            if (brandProductMessageAttachments.length) {
                                facebookMessage.attachmentLayout(builder.AttachmentLayout.carousel);
                                facebookMessage.attachments(brandProductMessageAttachments);
                            }
                            else {
                                facebookMessage.text("Sorry, we don't have any products of this brand yet");
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
                                title: "Back to Brands 🔙",
                                payload: "Brands"
                            });
                            facebookMessage.sourceEvent(session.userData.quickReplies);
                            session.send(facebookMessage);
                            break;
                        default:
                            session.send(brandProductMessageAttachments.length ? brandProductMessage : "Sorry, we don't have any products of this brand yet");
                            if (productResponse.nbHits > 8) {
                                quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons, "Filter by Size");
                            }
                            quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons, null, "Brands");
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

export default BrandProductsDialog;
