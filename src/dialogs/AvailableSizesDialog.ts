import * as builder from "botbuilder";
import BaseDialog from "./basedialog";
import MessagesController from "./../controllers/MessagesController"

class AvailableSizesDialog extends BaseDialog {
    constructor() {
        super();
        this.dialog = [
            (session, args, next) => {
                session.userData.repliesPerCard = 5;
                session.userData.repliesAlreadyDisplayed = -1;
                let quickRepliesButtons: builder.ICardAction[] = [];
                let quickRepliesCard = new builder.HeroCard(session);
                while (++session.userData.repliesAlreadyDisplayed < session.userData.repliesPerCard) {
                    quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons, session.userData.availableSizes[session.userData.repliesAlreadyDisplayed]);
                }
                quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons, "More")
                session.send("Choose a size among the following.");
                session.send(MessagesController.sendQuickReplies(session, quickRepliesCard));
                session.endDialog();
            }
        ]
    }
}

export default AvailableSizesDialog;