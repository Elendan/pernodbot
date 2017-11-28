import * as https from "https";
import * as builder from "botbuilder";

class MessengerController {
    public static QuickReplies() : any {
        return {
            facebook: {
                quick_replies: []
            }
        }
    }
}

export default MessengerController;