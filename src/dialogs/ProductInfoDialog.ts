import * as builder from "botbuilder";
import BaseDialog from "./basedialog";
import MessagesController from "./../controllers/MessagesController";

class ProductInfoDialog extends BaseDialog {
    constructor() {
        super();
        this.dialog = [
            (session, args, next) => {
                let quickRepliesCard = new builder.HeroCard(session);
                const quickRepliesButtons: builder.ICardAction[] = [];
                let messageSent: string;
                switch (args.intent.matched[0]) {
                    case "Size":
                        if (!session.userData.productSize) {
                            session.send("None");
                            break;
                        }
                        messageSent = `The bottle's size is ${session.userData.productSize}`;
                        break;
                    case "Ingredients":
                        if (!session.userData.productIngredients) {
                            session.send("None");
                            break;
                        }
                        messageSent = session.userData.productIngredients;
                        break;
                    case "Consumption Tips":
                        if (!session.userData.consumptionTips) {
                            session.send("None");
                            break;
                        }
                        messageSent = session.userData.consumptionTips;
                        break;
                    case "Product History":
                        if (!session.userData.productHistory) {
                            session.send("None");
                            break;
                        }
                        messageSent = session.userData.productHistory;
                        break;
                    default:
                        session.send("Not found");
                        break;
                }
                switch (session.message.source) {
                    // Defines message type depending on the chatting platform
                    case "facebook":
                        const facebookMessage = new builder.Message(session).text(messageSent);
                        session.send(facebookMessage);
                        facebookMessage.text("What do you want to do ?");
                        facebookMessage.sourceEvent({
                            facebook: {
                                quick_replies: [
                                    {
                                        content_type: "text",
                                        title: "Buy this product 🛒",
                                        payload: "Buy this product 🛒"
                                    },
                                    {
                                        content_type: "text",
                                        title: "More Details",
                                        payload: "More Details"
                                    },
                                    {
                                        content_type: "text",
                                        title: "Back to Menu 🔙",
                                        payload: "filters"
                                    }
                                ]
                            }
                        });
                        session.send(facebookMessage);
                        break;
                    default:
                        session.send(messageSent)
                        quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons, "Buy this product 🛒");
                        quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons, "More Details");
                        quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons);
                        session.send(MessagesController.sendQuickReplies(session, quickRepliesCard, "What do you want to do ?"));
                        break;
                }
                session.endDialog();
            }
        ]
    }
}

export default ProductInfoDialog;