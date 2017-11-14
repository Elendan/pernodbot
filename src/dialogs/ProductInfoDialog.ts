import * as builder from "botbuilder";
import BaseDialog from "./basedialog";

class ProductInfoDialog extends BaseDialog {
    constructor() {
        super();
        this.dialog = [
            (session, args, next) => {
                console.log(`args : ${JSON.stringify(args.intent.matched)}`);
                switch (args.intent.matched[0]) {
                    case "Size":
                        if (session.userData.productSize === null || session.userData.productSize === undefined) {
                            session.send("None");
                        }
                        session.send(`The bottle's size is ${session.userData.productSize}`);
                        break;
                    case "Ingredients":
                        if (session.userData.productIngredients === null || session.userData.productIngredients === undefined) {
                            session.send("None");
                        }
                        session.send(session.userData.productIngredients);
                        break;
                    case "Consumption Tips":
                        if (session.userData.consumptionTips === null || session.userData.consumptionTips === undefined) {
                            session.send("None");
                        }
                        session.send(session.userData.consumptionTips);
                        break;
                    case "Product History":
                        if (session.userData.productHistory === null || session.userData.productHistory === undefined) {
                            session.send("None");
                        }
                        session.send(session.userData.productHistory);
                        break;
                    default:
                        session.send("Not found");
                        break;
                }
                session.endDialog();
            }
        ]
    }
}

export default ProductInfoDialog;