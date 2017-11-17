import * as builder from "botbuilder";
import BaseDialog from "./basedialog";
import ProductController from "../controllers/ProductController";
import Product from "../models/Product";
import ProductType from "../enums/ProductType";

class ProductsPerSizeDialog extends BaseDialog {

    private static readonly _pageLength = 1000;
    private static readonly _displayedProducts = 0;
    private static readonly _productsPerCarousel = 5;

    constructor() {
        super();
        this.dialog = [
            (session, args, next) => {
                let productList: Product[] = [];
                let ProductMessage = new builder.Message(session);
                let productMessageAttachments: builder.AttachmentType[] = [];
                let quickRepliesCard = new builder.HeroCard(session);
                let quickRepliesButtons: builder.ICardAction[] = [];
                ProductMessage.attachmentLayout(builder.AttachmentLayout.carousel);
                let parameters = builder.EntityRecognizer.findEntity(args.intent.entities, "parameters");
                console.log(JSON.stringify(<string>parameters.entity.number + "0"));
                session.userData.sizeProductPage = 0;
                session.userData.displayedProductsOfSize = 5;
                switch (session.userData.productType) {
                    case ProductType.Brand:
                        ProductController.getBrandProducts(session.userData.idToRetrieve, ProductsPerSizeDialog._pageLength, 0).then(productResponse => {
                            productResponse.hits.forEach(product => {
                                if (product.size !== null && (product.size.id === <string>parameters.entity.number || product.size.id === <string>parameters.entity.number + "0")) {
                                    productList.push(product)
                                }
                            });
                            console.log(productList[0].productName);
                            console.log(productList[1].productName);
                        }, reason => {
                            session.send(reason);
                            session.endDialog();
                        }).then(() => {
                            while (session.userData.sizeProductPage < session.userData.displayedProductsOfSize) {
                                productMessageAttachments.push(ProductController.buildProductCard(productList[session.userData.sizeProductPage], session));
                                session.userData.sizeProductPage++;
                            }
                            ProductMessage.attachments(productMessageAttachments);
                            session.send(ProductMessage);
                            session.endDialog();
                        });
                        break;
                    case ProductType.Category:
                        session.send(session.userData.idToRetrieve);
                        session.endDialog();
                        break;
                    case ProductType.Classic:
                        break;
                    default:
                        session.send("Invalid argument");
                        session.endDialog();
                        break;
                }
            }
        ]
    }
}

export default ProductsPerSizeDialog;