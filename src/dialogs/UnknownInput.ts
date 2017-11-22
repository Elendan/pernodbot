import * as builder from "botbuilder";
import BaseDialog from "./basedialog";
import ProductController from "../controllers/ProductController";
import ProductType from "../enums/ProductType";
import MessagesController from "../controllers/MessagesController";

class UnknownInput extends BaseDialog {

    private static readonly _searchMoreProductIntentName: string = "search.more.products";
    private static readonly _defaultFallbackIntent: string = "Default Fallback Intent";
    private static readonly _undefinedIntentName: string = "undefined";
    private static readonly _pageLength: number = 5;

    constructor() {
        super();
        this.dialog = [
            (session, args, next) => {
                session.send("Understood, let me search that for you ⏳");
                session.userData.availableSizes = [];
                session.userData.productType = ProductType.Classic;
                if ((session.userData.productPage == null) || (args.intent.intent === UnknownInput._undefinedIntentName) || (args.intent.intent === UnknownInput._defaultFallbackIntent)) {
                    session.userData.productPage = 0;
                }
                else if (args.intent.intent === UnknownInput._searchMoreProductIntentName) {
                    session.userData.productPage++;
                }
                session.userData.idToRetrieve = session.message.text.replace(/Search more products /, '');
                ProductController.getProductFromInput(session.userData.idToRetrieve, 1000, 0).then(productResponse => {
                    productResponse.hits.forEach(p => {
                        if (p.size !== null) {
                            session.userData.availableSizes.push(String(parseFloat(p.size.id)));
                        }
                    });
                    session.userData.availableSizes = new Set(session.userData.availableSizes);
                    session.userData.availableSizes = Array.from(session.userData.availableSizes);
                    session.userData.availableSizes = session.userData.availableSizes.sort(function (a, b) { return a - b });
                }).then(() => ProductController.getProductFromInput(session.userData.idToRetrieve, UnknownInput._pageLength, session.userData.productPage).then(productResponse => {
                    let productMessage = new builder.Message(session);
                    let productMessageAttachments: builder.AttachmentType[] = [];
                    let quickRepliesButtons: builder.ICardAction[] = [];
                    let quickRepliesCard = new builder.HeroCard(session);
                    productMessage.attachmentLayout(builder.AttachmentLayout.carousel);
                    productResponse.hits.forEach(product => {
                        productMessageAttachments.push(ProductController.buildProductCard(product, session));
                    });
                    if (productResponse.nbPages > productResponse.page + 1) {
                        productMessageAttachments.push(
                            new builder.HeroCard(session)
                                .title("Load more")
                                .images([builder.CardImage.create(session, "http://tools.expertime.digital/bot/load-more.png")])
                                .buttons([{
                                    type: "postBack",
                                    title: "Load more",
                                    value: `Search more products ${session.userData.idToRetrieve}`
                                }])
                        );
                    }
                    else {
                        session.userData.productPage = 0;
                    }
                    if (productResponse.nbHits === 0) {
                        session.send("Sorry, we could not find this product.");
                        quickRepliesCard.text("What do you want to do ?")
                        quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons, "Back to Menu 🔙", "Filters");
                        session.send(MessagesController.sendQuickReplies(session, quickRepliesCard));
                        session.endDialog();
                        return;
                    }
                    productMessage.attachments(productMessageAttachments);
                    session.send(productMessage);
                    if (productResponse.nbHits > 8) {
                        quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons, "Filter by size");
                    }
                    quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons);
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

export default UnknownInput;