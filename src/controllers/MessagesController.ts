import * as https from "https";
import * as builder from "botbuilder";

class MessagesController {
    /** 
     * @param session 
     * @param card 
     */
    public static sendQuickReplies(session: builder.Session, card: builder.HeroCard) : builder.Message {
        let newMessage = new builder.Message(session);
        let newMessageAttachment: builder.AttachmentType[] = [];
        newMessageAttachment.push(card);
        newMessage.attachments(newMessageAttachment);
        return newMessage;
    }

    /**
     * @param card 
     * @param buttons 
     * @param msg 
     * @param type 
     */
    public static addQuickRepliesButtons(card: builder.HeroCard, buttons: builder.ICardAction[], msg?: string, type?: string) : builder.HeroCard {
        buttons.push({
            type: "postBack",
            title: msg ? msg : `Back to ${type ? type : "Filters"} 🔙`,
            value: msg ? msg : `Back to ${type ? type : "Filters"} 🔙`
        });
        card.buttons(buttons);
        return card;
    }
}

export default MessagesController;