import * as builder from "botbuilder";
import * as ChatBase from "@google/chatbase";

class ChatBaseController {

    /**
     * Tells to ChatBase the message sent by user is not handeled
     * @param session 
     * @param platform 
     * @param message 
     * @param intent 
     */
    public static sendNotHandled(session: builder.Session, platform: string, message: string, intent: string): any {
        const msg = ChatBase.newMessage(process.env.CHATBASE_API_KEY)
            .setAsTypeUser()
            .setPlatform('facebook')
            .setMessage('Hello')
            .setVersion('1.0')
            .setIntent('start.dialog')
            .setAsNotHandled()
            .setUserId(session.message.address.conversation.id)
            .send()
            .then(msg => console.log(msg.getCreateResponse()))
            .catch(err => console.error(err));

        return msg;
    }

    /**
     * Tells to ChatBase the message sent by user is handeled
     * @param session 
     * @param platform 
     * @param message 
     * @param intent 
     */
    public static sendHandled(session: builder.Session, platform: string, message: string, intent: string): any {
        const msg = ChatBase.newMessage(process.env.CHATBASE_API_KEY)
            .setAsTypeUser()
            .setPlatform(platform)
            .setMessage(message)
            .setVersion('1.0')
            .setIntent(intent)
            .setAsHandled()
            .setUserId(session.message.address.conversation.id)
            .send()
            .then(msg => console.log(msg.getCreateResponse()))
            .catch(err => console.error(err));

        return msg;
    }

}

export default ChatBaseController;