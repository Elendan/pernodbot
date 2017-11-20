import * as builder from "botbuilder";
import BaseDialog from "./basedialog";
import MessagesController from "./../controllers/MessagesController"

class AvailableSizesDialog extends BaseDialog {

    private static readonly _filterBySizeIntentName: string = "filter.by.size";
    private static readonly _filterMoreSizeIntentName: string = "filter.more.sizes";
    private static readonly _repliesPerCard: number = 5;

    constructor() {
        super();
        this.dialog = [
            (session, args, next) => {
                session.userData.sizeProductPage = 0;
                session.userData.rest = session.userData.availableSizes.length % AvailableSizesDialog._repliesPerCard;
                if (args.intent.intent === AvailableSizesDialog._filterBySizeIntentName) {
                    session.userData.repliesAlreadyDisplayed = 0;
                    session.userData.repliesToDisplay = AvailableSizesDialog._repliesPerCard;
                }
                else if (args.intent.intent === AvailableSizesDialog._filterMoreSizeIntentName) {
                    session.userData.repliesToDisplay += session.userData.rest !== 0 && session.userData.repliesToDisplay + session.userData.rest === session.userData.availableSizes.length ? session.userData.rest : AvailableSizesDialog._repliesPerCard;
                }
                let quickRepliesButtons: builder.ICardAction[] = [];
                let quickRepliesCard = new builder.HeroCard(session);
                while (session.userData.repliesAlreadyDisplayed < session.userData.repliesToDisplay) {
                    quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons, session.userData.availableSizes[session.userData.repliesAlreadyDisplayed]);
                    session.userData.repliesAlreadyDisplayed++;
                }
                if (session.userData.repliesAlreadyDisplayed < session.userData.availableSizes.length) {
                    quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons, "More Sizes")
                }
                session.send("Choose a size among the following.");
                session.send(MessagesController.sendQuickReplies(session, quickRepliesCard));
                session.endDialog();
            }
        ]
    }
}

export default AvailableSizesDialog;