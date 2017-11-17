import * as builder from "botbuilder";
import BaseDialog from "./basedialog";
import ProductController from "../controllers/ProductController";
import ProductType from "../enums/ProductType";

class ProductsPerSizeDialog extends BaseDialog {
    constructor() {
        super();
        this.dialog = [
            (session, args, next) => {
                switch (session.userData.ProductType) {
                    case ProductType.Brand:
                        break;
                    case ProductType.Category:
                        break;
                    case ProductType.Classic:
                        break;
                }
            }
        ]
    }
}

export default ProductsPerSizeDialog;