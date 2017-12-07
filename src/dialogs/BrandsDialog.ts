import * as builder from "botbuilder";
import BaseDialog from "./basedialog";
import BrandController from "../controllers/BrandController";
import MessagesController from "../controllers/MessagesController";
import ChatBase from "../controllers/ChatbaseController";
import { Session } from "inspector";

class BrandsDialog extends BaseDialog {

    private static readonly _pageLength: number = 5;
    private static readonly _brandsIntentName: string = "brands";
    private static readonly _loadBrandsIntentName: string = "load.brands";

    constructor() {
        super();
        this.dialog = [
            (session, args, next) => {
                let quickRepliesCard = new builder.HeroCard(session);
                let quickRepliesButtons: builder.ICardAction[] = [];

                quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons);
                if (session.userData.brandPage == null || (args.intent.intent === BrandsDialog._brandsIntentName)) {
                    session.userData.brandPage = 0;
                }
                else if (args.intent.intent === BrandsDialog._loadBrandsIntentName) {
                    session.userData.brandPage++;
                }
                // Get brands
                BrandController.getBrands(BrandsDialog._pageLength, session.userData.brandPage).then(brandResponse => {
                    let brandsMessage = new builder.Message(session);
                    let brandsMessageAttachments: builder.AttachmentType[] = [];

                    session.userData.brandPage = brandResponse.page;
                    brandsMessage.attachmentLayout(builder.AttachmentLayout.carousel);
                    brandResponse.hits.forEach(brand => {
                        // Brand card
                        brandsMessageAttachments.push(BrandController.buildBrandCard(brand, session));
                    });
                    if (brandResponse.nbPages > brandResponse.page + 1) {
                        // Load more brands card
                        brandsMessageAttachments.push(
                            new builder.HeroCard(session)
                                .title("Load more")
                                .images([builder.CardImage.create(session, "http://tools.expertime.digital/bot/load-more.png")])
                                .buttons([{
                                    type: "postBack",
                                    title: "Load more",
                                    value: "Load more brands"
                                }])
                        );
                    }
                    else {
                        session.userData.brandPage = 0;
                    }
                    brandsMessage.attachments(brandsMessageAttachments);
                    // Defines message type depending on the chatting platform
                    ChatBase.sendHandled(session, session.message.source, session.message.text, args.intent.intent);
                    switch (session.message.source) {
                        case "facebook":
                            const facebookMessage = new builder.Message(session).attachments(brandsMessageAttachments);
                            facebookMessage.attachmentLayout(builder.AttachmentLayout.carousel);
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
                            session.send(brandsMessage);
                            session.send(MessagesController.sendQuickReplies(session, quickRepliesCard));
                            break;
                    }
                    session.endDialog();
                }, reason => {
                    session.send(reason);
                    session.endDialog();
                });
            }
        ]
    }
}

export default BrandsDialog;