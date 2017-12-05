import * as builder from "botbuilder";
import * as apiai from "apiai";
import DialogflowRecognizer from "./dialogs/DialogflowRecognizer";
import DialogflowDialog from "./dialogs/DialogflowDialog";
import BrandsDialog from "./dialogs/BrandsDialog";
import BrandProductDialog from "./dialogs/BrandProductsDialog";
import CategoriesDialog from "./dialogs/CategoriesDialog";
import CategoryProductDialog from "./dialogs/CategoryProductsDialog";
import InfoDialog from "./dialogs/InfoDialog";
import ProductInfoDialog from "./dialogs/ProductInfoDialog";
import DescriptionDialog from "./dialogs/DescriptionDialog";
import AvailableSizesDialog from "./dialogs/AvailableSizesDialog";
import ProductsPerSizeDialog from "./dialogs/ProductsPerSizeDialog";
import BuyProductDialog from "./dialogs/BuyProductDialog";
import ManualSearchDialog from "./dialogs/ManualSearchDialog";
import GreetingsDialog from "./dialogs/GreetingsDialog";
import BackToFiltersDialog from "./dialogs/BackToFiltersDialog";

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
        new GreetingsDialog().register(this.bot, "start", {
            onFindAction: (context: builder.IFindActionRouteContext, callback: (err: Error, score: number, routeData?: builder.IActionRouteData) => void) => {
                if (context.intent && /^start.dialog/.test(context.intent.intent)) {
                    callback(null, context.intent.score, {
                        intent: context.intent
                    });
                }
                else {
                    callback(null, 0);
                }
            }
        });
        new BrandsDialog().register(this.bot, "Brands", {
            onFindAction: (context: builder.IFindActionRouteContext, callback: (err: Error, score: number, routeData?: builder.IActionRouteData) => void) => {
                if (context.intent && /^brands|load.brands$/.test(context.intent.intent)) {
                    callback(null, context.intent.score, {
                        intent: context.intent
                    });
                }
                else {
                    callback(null, 0);
                }
            }
        });
        new BrandProductDialog().register(this.bot, "BrandProducts", {
            onFindAction: (context: builder.IFindActionRouteContext, callback: (err: Error, score: number, routeData?: builder.IActionRouteData) => void) => {
                if (context.intent && /^research in brands|Search more brands$/.test(context.intent.intent)) {
                    callback(null, context.intent.score, {
                        intent: context.intent
                    });
                }
                else {
                    callback(null, 0);
                }
            }
        });
        new CategoriesDialog().register(this.bot, "Categories", {
            onFindAction: (context: builder.IFindActionRouteContext, callback: (err: Error, score: number, routeData?: builder.IActionRouteData) => void) => {
                if (context.intent && /^categories|load.categories$/.test(context.intent.intent)) {
                    callback(null, context.intent.score, {
                        intent: context.intent
                    });
                }
                else {
                    callback(null, 0);
                }
            }
        });
        new CategoryProductDialog().register(this.bot, "CategoryProducts", {
            onFindAction: (context: builder.IFindActionRouteContext, callback: (err: Error, score: number, routeData?: builder.IActionRouteData) => void) => {
                if (context.intent && /^research in category|search more categories$/.test(context.intent.intent)) {
                    callback(null, context.intent.score, {
                        intent: context.intent
                    });
                }
                else {
                    callback(null, 0);
                }
            }
        });
        new InfoDialog().register(this.bot, "InfoDialog", {
            onFindAction: (context: builder.IFindActionRouteContext, callback: (err: Error, score: number, routeData?: builder.IActionRouteData) => void) => {

                if (context.intent && /^get.infos|^product.detail.payload/.test(context.intent.intent)) {
                    callback(null, context.intent.score, {
                        intent: context.intent
                    });
                }
                else {
                    callback(null, 0);
                }
            }
        });
        new ProductInfoDialog().register(this.bot, "ProductInfo", {
            matches: /^Size|^Ingredients|^Consumption Tips|^Product History/
        });
        new DescriptionDialog().register(this.bot, "ProductDescription", {
            onFindAction: (context: builder.IFindActionRouteContext, callback: (err: Error, score: number, routeData?: builder.IActionRouteData) => void) => {

                if (context.intent && /^product.details/.test(context.intent.intent)) {
                    callback(null, context.intent.score, {
                        intent: context.intent
                    });
                }
                else {
                    callback(null, 0);
                }
            }
        });
        new AvailableSizesDialog().register(this.bot, "AvailableSizes", {
            onFindAction: (context: builder.IFindActionRouteContext, callback: (err: Error, score: number, routeData?: builder.IActionRouteData) => void) => {

                if (context.intent && /^filter.by.size|^filter.more.sizes/.test(context.intent.intent)) {
                    callback(null, context.intent.score, {
                        intent: context.intent
                    });
                }
                else {
                    callback(null, 0);
                }
            }
        });
        new ProductsPerSizeDialog().register(this.bot, "ProductsPerSize", {
            onFindAction: (context: builder.IFindActionRouteContext, callback: (err: Error, score: number, routeData?: builder.IActionRouteData) => void) => {
                if (context.intent && /^product.size/.test(context.intent.intent)) {
                    callback(null, context.intent.score, {
                        intent: context.intent
                    });
                }
                else {
                    callback(null, 0);
                }
            }
        });
        new BuyProductDialog().register(this.bot, "BuyProductButton", {
            onFindAction: (context: builder.IFindActionRouteContext, callback: (err: Error, score: number, routeData?: builder.IActionRouteData) => void) => {
                if (context.intent && /^buy product/.test(context.intent.intent)) {
                    callback(null, context.intent.score, {
                        intent: context.intent
                    });
                }
                else {
                    callback(null, 0);
                }
            }
        });
        new ManualSearchDialog().register(this.bot, "unknownInput", {
            onFindAction: (context: builder.IFindActionRouteContext, callback: (err: Error, score: number, routeData?: builder.IActionRouteData) => void) => {
                if (context.intent && /^undefined|^search.more.products|^Default Fallback Intent/.test(context.intent.intent)) {
                    callback(null, context.intent.score, {
                        intent: context.intent
                    });
                }
                else {
                    callback(null, 0);
                }
            }
        });
        new BackToFiltersDialog().register(this.bot, "BackToFilters", {
            onFindAction: (context: builder.IFindActionRouteContext, callback: (err: Error, score: number, routeData?: builder.IActionRouteData) => void) => {

                if (context.intent && /^back.to.filters/.test(context.intent.intent)) {
                    callback(null, context.intent.score, {
                        intent: context.intent
                    });
                }
                else {
                    callback(null, 0);
                }
            }
        });
        new DialogflowDialog().register(this.bot, "Dialogflow", {
            onFindAction: (context: builder.IFindActionRouteContext, callback: (err: Error, score: number, routeData?: builder.IActionRouteData) => void) => {
                if (context.intent) {
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