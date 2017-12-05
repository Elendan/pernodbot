import * as builder from "botbuilder";
import BaseDialog from "./basedialog";
import MessagesController from "./../controllers/MessagesController"
import MessengerController from "./../controllers/MessengerController"

class AvailableSizesDialog extends BaseDialog {

    private static readonly _filterBySizeIntentName: string = "filter.by.size";
    private static readonly _filterMoreSizeIntentName: string = "filter.more.sizes";
    private static readonly _repliesPerCard: number = 5;

    constructor() {
        super();
        this.dialog = [
            (session, args, next) => {
                const quickRepliesButtons: builder.ICardAction[] = [];
                let quickRepliesCard = new builder.HeroCard(session);

                session.userData.quickReplies = MessengerController.QuickReplies();
                session.userData.sizeProductPage = 0;
                session.userData.rest = session.userData.availableSizes.length % AvailableSizesDialog._repliesPerCard;
                if (args.intent.intent === AvailableSizesDialog._filterBySizeIntentName) {
                    session.userData.repliesAlreadyDisplayed = 0;
                    session.userData.repliesToDisplay = AvailableSizesDialog._repliesPerCard;
                }
                // Calculates the amount of quick replies to display when clicking "more sizes"
                else if (args.intent.intent === AvailableSizesDialog._filterMoreSizeIntentName) {
                    session.userData.repliesToDisplay += session.userData.rest !== 0 && session.userData.repliesToDisplay + session.userData.rest === session.userData.availableSizes.length ? session.userData.rest : AvailableSizesDialog._repliesPerCard;
                }
                // Adds quick replies for each available size
                while (session.userData.repliesAlreadyDisplayed < session.userData.repliesToDisplay) {
                    quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons, session.userData.availableSizes[session.userData.repliesAlreadyDisplayed]);
                    session.userData.quickReplies.facebook.quick_replies.push({
                        content_type: "text",
                        title: session.userData.availableSizes[session.userData.repliesAlreadyDisplayed],
                        payload: session.userData.availableSizes[session.userData.repliesAlreadyDisplayed]
                    });
                    session.userData.repliesAlreadyDisplayed++;
                }
                if (session.userData.repliesAlreadyDisplayed < session.userData.availableSizes.length) {
                    quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons, "More Sizes");
                    session.userData.quickReplies.facebook.quick_replies.push({
                        content_type: "text",
                        title: "More Sizes",
                        payload: "More Sizes"
                    });
                }
                // Defines message type depending on the chatting platform
                switch (session.message.source) {
                    case "facebook":
                        const facebookMessage = new builder.Message(session).text("Choose a size among the following.");

                        facebookMessage.sourceEvent(session.userData.quickReplies);
                        session.send(facebookMessage);
                        break;
                    default:
                        session.send("Choose a size among the following.");
                        session.send(MessagesController.sendQuickReplies(session, quickRepliesCard));
                        break;
                }
                session.endDialog();
            }
        ]
    }
}

export default AvailableSizesDialog;