import * as https from "https";
import * as builder from "botbuilder";

class MessengerController {
    public static AvailableSizes() : any {
        return {
            facebook: {
                quick_replies: []
            }
        }
    }
}

export default MessengerController;