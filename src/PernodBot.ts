import * as builder from "botbuilder";
import * as apiai from "apiai";
import DialogflowRecognizer from "./dialogs/DialogflowRecognizer";
import DialogflowDialog from "./dialogs/DialogflowDialog";
import BrandsDialog from "./dialogs/BrandsDialog";
import CategoriesDialog from "./dialogs/CategoriesDialog"

class PernodBot {

    public connector: builder.ChatConnector;
    private bot: builder.UniversalBot;

    public constructor() {
        this.connector = new builder.ChatConnector({
            appId: process.env.MICROSOFT_APP_ID,
            appPassword: process.env.MICROSOFT_APP_PASSWORD
        });
        this.bot = new builder.UniversalBot(this.connector);

        // Middleware
        this.bot.use({
            botbuilder: (session: builder.Session, next: Function) => {
                session.sendTyping();
                next();
            }
        });

        // Recognizer
        this.bot.recognizer(new DialogflowRecognizer(process.env.DIALOGFLOW_TOKEN));
        
        // Dialogs
        new BrandsDialog().register(this.bot, "Brands", {
            matches: "brands"
        });
        new CategoriesDialog().register(this.bot, "Categories", {
            matches: "categories"
        });
        new DialogflowDialog().register(this.bot, "Dialogflow", {
            onFindAction: (context: builder.IFindActionRouteContext, callback: (err: Error, score: number, routeData?: builder.IActionRouteData) => void) => {
                if(context.intent) {
                    callback(null, context.intent.score, {
                        intent: context.intent
                    });
                }
                else {
                    callback(null, 0);
                }
            }
        });
    }
}

export default PernodBot;