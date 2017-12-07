import * as builder from "botbuilder";
import BaseDialog from "./basedialog";
import ProductController from "../controllers/ProductController";
import ProductType from "../enums/ProductType";
import MessagesController from "../controllers/MessagesController";
import MessengerController from "../controllers/MessengerController";
import ChatBase from "../controllers/ChatbaseController";

class ManualSearchDialog extends BaseDialog {

    private static readonly _searchMoreProductIntentName: string = "search.more.products";
    private static readonly _defaultFallbackIntent: string = "Default Fallback Intent";
    private static readonly _undefinedIntentName: string = "undefined";
    private static readonly _maxPageLength: number = 1000;
    private static readonly _pageLength: number = 5;
    private static _isFirstRound: boolean;

    constructor() {
        super();
        this.dialog = [
            (session, args, next) => {
                session.userData.quickReplies = MessengerController.QuickReplies();
                session.send("Understood, let me search that for you ⏳");
                session.userData.productType = ProductType.Classic;
                if ((session.userData.productPage == null) || (args.intent.intent === ManualSearchDialog._undefinedIntentName) || (args.intent.intent === ManualSearchDialog._defaultFallbackIntent)) {
                    session.userData.productPage = 0;
                    session.userData.availableSizes = [];
                    ManualSearchDialog._isFirstRound = true;
                }
                else if (args.intent.intent === ManualSearchDialog._searchMoreProductIntentName) {
                    session.userData.productPage++;
                    ManualSearchDialog._isFirstRound = false;
                }
                session.userData.idToRetrieve = session.message.text.replace(/Search more products /, '');
                ProductController.getProductFromInput(session.userData.idToRetrieve, ManualSearchDialog._maxPageLength, 0, ManualSearchDialog._isFirstRound).then(productResponse => {
                    if (productResponse !== null) {
                        productResponse.hits.forEach(p => {
                            if (p.size && !session.userData.availableSizes.includes(`${parseFloat(p.size.id)}`)) {
                                session.userData.availableSizes.push(`${parseFloat(p.size.id)}`);
                            }
                        });
                    }
                    // sort sizes by ascending order
                    session.userData.availableSizes = session.userData.availableSizes.sort((a, b) => { return a - b });
                }).then(() => ProductController.getProductFromInput(session.userData.idToRetrieve, ManualSearchDialog._pageLength, session.userData.productPage).then(productResponse => {
                    const productMessage = new builder.Message(session);
                    const productMessageAttachments: builder.AttachmentType[] = [];
                    const quickRepliesButtons: builder.ICardAction[] = [];
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
                        ChatBase.sendNotHandled(session, "facebook", session.message.text, args.intent.intent);
                        session.send("Sorry, we could not find this product.");
                        // Defines message type depending on the chatting platform
                        switch (session.message.source) {
                            case "facebook":
                                let facebookMessage = new builder.Message(session).text("What do you want to do ?");
                                facebookMessage.sourceEvent({
                                    facebook: {
                                        quick_replies: [
                                            {
                                                content_type: "text",
                                                title: "Back to Menu 🔙",
                                                payload: "Filters"
                                            }
                                        ]
                                    }
                                });
                                session.send(facebookMessage);
                                break;
                            default:
                                quickRepliesCard.text("What do you want to do ?");
                                quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons, "Back to Menu 🔙", "Filters");
                                session.send(MessagesController.sendQuickReplies(session, quickRepliesCard));
                                break;
                        }
                        session.endDialog();
                        return;
                    }
                    // Defines message type depending on the chatting platform
                    switch (session.message.source) {
                        case "facebook":
                            ChatBase.sendHandled(session, "facebook", session.message.text, args.intent.intent);
                            const facebookMessage = new builder.Message(session).attachments(productMessageAttachments);
                            facebookMessage.attachmentLayout(builder.AttachmentLayout.carousel);
                            if (productResponse.nbHits > 8) {
                                session.userData.quickReplies.facebook.quick_replies.push({
                                    content_type: "text",
                                    title: "Filter by Size",
                                    payload: "Filter by Size"
                                });
                            }
                            session.userData.quickReplies.facebook.quick_replies.push({
                                content_type: "text",
                                title: "Back to Menu 🔙",
                                payload: "Filters"
                            });
                            facebookMessage.sourceEvent(session.userData.quickReplies);
                            session.send(facebookMessage);
                            break;
                        default:
                            ChatBase.sendHandled(session, "Web", session.message.text, args.intent.intent);
                            productMessage.attachments(productMessageAttachments);
                            session.send(productMessage);
                            if (productResponse.nbHits > 8) {
                                quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons, "Filter by size");
                            }
                            quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons);
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

export default ManualSearchDialog;