import * as builder from "botbuilder";
import BaseDialog from "./basedialog";
import CategoryController from "../controllers/CategoryController";

class CategoriesDialog extends BaseDialog {

    constructor() {
        super();
        this.dialog = [
            (session, args, next) => {
                CategoryController.getCategories(9).then(categories => {
                    let categoriesMessage = new builder.Message(session);
                    let categoriesMessageAttachments: builder.AttachmentType[] = [];
                    categoriesMessage.attachmentLayout(builder.AttachmentLayout.carousel);
                    categories.forEach(category => {
                        let categoryCard = new builder.HeroCard(session)
                            .title(category.label);
                        categoryCard.images([builder.CardImage.create(session, "http://tools.expertime.digital/bot/absinthe.png")]); // Faudra hardcoder ça, aucune image sur le pim
                        categoriesMessageAttachments.push(categoryCard);
                    });
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