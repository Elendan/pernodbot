import * as builder from "botbuilder";
import BaseDialog from "./basedialog";
import BrandController from "../controllers/BrandController";
import MessagesController from "../controllers/MessagesController";

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
                    session.userData.brandPage = brandResponse.page;
                    let brandsMessage = new builder.Message(session);
                    let brandsMessageAttachments: builder.AttachmentType[] = [];
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
                    session.send(brandsMessage);
                    switch (session.message.source) {
                        case "facebook":
                            let facebookMessage = new builder.Message(session);
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
                            })
                            break;
                        default:
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