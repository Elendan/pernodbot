import * as https from "https";
import * as builder from "botbuilder";

class MessagesController {
    /** 
     * @param session 
     * @param card 
     * @param msg
     */
    public static sendQuickReplies(session: builder.Session, card: builder.HeroCard, msg?: string): builder.Message {
        let newMessage = new builder.Message(session);
        let newMessageAttachment: builder.AttachmentType[] = [];
        if (msg) {
            newMessage.text(msg);
        }
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
    public static addQuickRepliesButtons(card: builder.HeroCard, buttons: builder.ICardAction[], msg?: string, type?: string): builder.HeroCard {
        buttons.push({
            type: "postBack",
            title: msg ? msg : `Back to ${type ? type : "Menu"} 🔙`,
            value: msg && type ? type : msg ? msg : type ? type : "Filters"
        });
        card.buttons(buttons);
        return card;
    }

    /**
     * @param session 
     */
    public static BuyProductCarousel(session: builder.Session): builder.Message {
        let card = new builder.Message(session);
        let cardAttachments: builder.AttachmentType[] = [];
        card.attachmentLayout(builder.AttachmentLayout.carousel);
        cardAttachments.push(
            new builder.HeroCard(session)
                .title("Buy on Bar Premium")
                .images([builder.CardImage.create(session, "http://levendangeur.fr/wp-content/uploads/2016/06/bar-premium.png")])
                .buttons(
                [
                    {
                        type: "openUrl",
                        title: "Access Website",
                        image: "http://levendangeur.fr/wp-content/uploads/2016/06/bar-premium.png",
                        value: "https://www.barpremium.com/barpremium/"
                    }
                ])
        );
        cardAttachments.push(
            new builder.HeroCard(session)
                .title("Buy on Auchan")
                .images([builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/0/0a/Logo_Auchan_2015.jpg")])
                .buttons(
                [
                    {
                        type: "openUrl",
                        title: "Access WebSite",
                        image: "https://upload.wikimedia.org/wikipedia/commons/0/0a/Logo_Auchan_2015.jpg",
                        value: "https://www.auchan.fr/mumm-champagne-mumm-brut-cordon-rouge/p-c395487%3bjsessionid=6CC0CE5CFCE957F5D0994D20BD13DA41-n2?utm_source=Pernod-Ricard&utm_medium=brandwebsite&utm_campaign=Pernod%20Ricard%20ClickToBuy%20Solution"
                    }
                ])
        );
        card.attachments(cardAttachments);
        return card;
    }

    /**
     * @param size 
     */
    public static CheckSize(size: string): number {
        for (let i = size.length - 1; i > 0; i--) {
            if (size[i] !== '0') {
                return i + 1;
            }
        }
        return 0;
    }
}

export default MessagesController;