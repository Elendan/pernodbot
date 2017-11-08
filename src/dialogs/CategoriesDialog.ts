import * as builder from "botbuilder";
import BaseDialog from "./basedialog";
import CategoryController from "../controllers/CategoryController";

class CategoriesDialog extends BaseDialog {

    private static readonly pageLength = 5;
    private static readonly categoriesIntentName = "categories";
    private static readonly loadCategoriesIntentName = "load.categories";

    constructor() {
        super();
        this.dialog = [
            (session, args, next) => {
                if ((session.userData.categoryPage == null) || args.intent.intent === CategoriesDialog.categoriesIntentName) {
                    session.userData.categoryPage = 0;
                }
                else if (args.intent.intent === CategoriesDialog.loadCategoriesIntentName) {
                    session.userData.categoryPage++;
                }
                //Get categories
                CategoryController.getCategories(CategoriesDialog.pageLength, session.userData.categoryPage).then(categoryResponse => {
                    session.userData.categoryPage = categoryResponse.page;
                    let categoriesMessage = new builder.Message(session);
                    let categoriesMessageAttachments: builder.AttachmentType[] = [];
                    categoriesMessage.attachmentLayout(builder.AttachmentLayout.carousel);
                    categoryResponse.hits.forEach(category => {
                        let categoriesProductQuery = category.label.replace(/ /g, '+');
                        categoriesMessageAttachments.push(CategoryController.buildCategoryCard(category, session));
                    });
                    if (categoryResponse.nbPages > categoryResponse.page) {
                        categoriesMessageAttachments.push(
                            new builder.HeroCard(session)
                            .title("Load more")
                            .images([builder.CardImage.create(session, "http://tools.expertime.digital/bot/logopr.jpg")])
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
                    session.send(categoriesMessage);
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