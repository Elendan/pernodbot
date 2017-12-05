import * as builder from "botbuilder";
import BaseDialog from "./basedialog";
import CategoryController from "../controllers/CategoryController";
import MessagesController from "../controllers/MessagesController";

class CategoriesDialog extends BaseDialog {

    private static readonly _pageLength: number = 5;
    private static readonly _categoriesIntentName: string = "categories";
    private static readonly _loadCategoriesIntentName: string = "load.categories";

    constructor() {
        super();
        this.dialog = [
            (session, args, next) => {
                let quickRepliesCard = new builder.HeroCard(session);
                const quickRepliesButtons: builder.ICardAction[] = [];

                quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons);
                if (session.userData.categoryPage == null || args.intent.intent === CategoriesDialog._categoriesIntentName) {
                    session.userData.categoryPage = 0;
                }
                else if (args.intent.intent === CategoriesDialog._loadCategoriesIntentName) {
                    session.userData.categoryPage++;
                }
                //Get categories
                CategoryController.getCategories(CategoriesDialog._pageLength, session.userData.categoryPage).then(categoryResponse => {
                    session.userData.categoryPage = categoryResponse.page;
                    let categoriesMessage = new builder.Message(session);
                    let categoriesMessageAttachments: builder.AttachmentType[] = [];
                    categoriesMessage.attachmentLayout(builder.AttachmentLayout.carousel);
                    categoryResponse.hits.forEach(category => {
                        categoriesMessageAttachments.push(CategoryController.buildCategoryCard(category, session));
                    });
                    if (categoryResponse.nbPages > categoryResponse.page + 1) {
                        categoriesMessageAttachments.push(
                            // Load more card
                            new builder.HeroCard(session)
                                .title("Load more")
                                .images([builder.CardImage.create(session, "http://tools.expertime.digital/bot/load-more.png")])
                                .buttons([{
                                    type: "postBack",
                                    title: "Load more",
                                    text: "Load more",
                                    diplayText: "Load more",
                                    value: "Load more categories"
                                }])
                        );
                    }
                    else {
                        session.userData.categoryPage = 0;
                    }
                    categoriesMessage.attachments(categoriesMessageAttachments);
                    // Defines message type depending on the chatting platform
                    switch (session.message.source) {
                        case "facebook":
                            const facebookMessage = new builder.Message(session).attachments(categoriesMessageAttachments);

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
                            session.send(MessagesController.sendQuickReplies(session, quickRepliesCard));
                            session.send(categoriesMessage);
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

export default CategoriesDialog;