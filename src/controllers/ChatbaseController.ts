import * as https from "https";
import * as builder from "botbuilder";
import * as ChatBase from "@google/chatbase";

class ChatBaseController {

    public static sendNotHandled(session: builder.Session, platform: string, message: string, intent: string) : any {
        const newMsg = ChatBase.newMessage(process.env.CHATBASE_API_KEY)
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

        return newMsg;
    }

    public static sendHandled(session: builder.Session, platform: string, message: string, intent: string) : any {
        const newMsg = ChatBase.newMessage(process.env.CHATBASE_API_KEY)
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

        return newMsg;
    }

}

export default ChatBaseController;