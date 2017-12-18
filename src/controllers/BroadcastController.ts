import * as builder from "botbuilder";
import * as facebook from "botbuilder-facebookextension";
import MessagesController from "../controllers/MessagesController";
import ChatBase from "../controllers/ChatbaseController";

class BroadcastController {

    private static _canPush: boolean;

    public static RegisterSession(sessions: any, session: builder.Session) : void {
        if (session.message.source !== "facebook") {
            return;
        }
        sessions.forEach(s => {
            if (s.uid === session.message.address.user.id) { // If user id already exists, then we don't add the session to the set
            BroadcastController._canPush = false;
            }
        });
        if (BroadcastController._canPush) { // If it doesn't exist, we add the session and the uid to the set
            sessions.add({
                s: session,
                uid: session.message.address.user.id
            });
        }
    }

    public static SendMessage(sessions: any, message: string) : void {
        sessions.forEach(s => {
            s.send(message);
        });
    }
}

export default BroadcastController;