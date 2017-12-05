import * as https from "https";
import * as builder from "botbuilder";

class MessengerController {
    public static QuickReplies(): any {
        return {
            facebook: {
                quick_replies: []
            }
        }
    }

    public static MenuReplies(session: builder.Session): builder.Message {
        const facebookMessage = new builder.Message(session).text("You can find products using the buttons below or simply typing the name of the product.");
        facebookMessage.sourceEvent({
            facebook: {
                quick_replies: [
                    {
                        content_type: "text",
                        title: "Brands 🍾",
                        payload: "Brands"
                    },
                    {
                        content_type: "text",
                        title: "Categories 🍸",
                        payload: "Categories"
                    }
                ]
            }
        });
        return facebookMessage;
    }
}

export default MessengerController;