import * as builder from "botbuilder";
import BaseDialog from "./basedialog";
import MessagesController from "./../controllers/MessagesController";

class ProductInfoDialog extends BaseDialog {
    constructor() {
        super();
        this.dialog = [
            (session, args, next) => {
                let quickRepliesCard = new builder.HeroCard(session);
                let quickRepliesButtons: builder.ICardAction[] = [];
                switch (args.intent.matched[0]) {
                    case "Size":
                        if (session.userData.productSize === null || session.userData.productSize === undefined) {
                            session.send("None");
                        }
                        session.send(`The bottle's size is ${session.userData.productSize}`);
                        break;
                    case "Ingredients":
                        if (session.userData.productIngredients === null || session.userData.productIngredients === undefined) {
                            session.send("None");
                        }
                        session.send(session.userData.productIngredients);
                        break;
                    case "Consumption Tips":
                        if (session.userData.consumptionTips === null || session.userData.consumptionTips === undefined) {
                            session.send("None");
                        }
                        session.send(session.userData.consumptionTips);
                        break;
                    case "Product History":
                        if (session.userData.productHistory === null || session.userData.productHistory === undefined) {
                            session.send("None");
                        }
                        session.send(session.userData.productHistory);
                        break;
                    default:
                        session.send("Not found");
                        break;
                }
                quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons, "Buy this product 🛒");
                quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons, "More Details");
                quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons);
                session.send(MessagesController.sendQuickReplies(session, quickRepliesCard, "What do you want to do ?"));
                session.endDialog();
            }
        ]
    }
}

export default ProductInfoDialog;