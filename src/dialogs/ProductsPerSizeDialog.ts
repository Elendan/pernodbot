import * as builder from "botbuilder";
import BaseDialog from "./basedialog";
import Product from "../models/Product";
import ProductType from "../enums/ProductType";
import ProductController from "../controllers/ProductController";
import MessagesController from "../controllers/MessagesController";

class ProductsPerSizeDialog extends BaseDialog {

    private static readonly _pageLength: number = 1000;

    constructor() {
        super();
        this.dialog = [
            (session, args, next) => {
                let productList: Product[] = [];
                let productMessage = new builder.Message(session);
                let productMessageAttachments: builder.AttachmentType[] = [];
                let quickRepliesCard = new builder.HeroCard(session);
                let quickRepliesButtons: builder.ICardAction[] = [];
                productMessage.attachmentLayout(builder.AttachmentLayout.carousel);
                let parameters = builder.EntityRecognizer.findEntity(args.intent.entities, "parameters");
                if (session.userData.sizeProductPage === null || session.userData.sizeProductPage === 0 || (session.userData.oldSize !== <string>parameters.entity.number && session.userData.oldSize !== <string>parameters.entity.number + "0")) {
                    session.userData.displayedProductsOfSize = 5;
                    session.userData.oldSize = parameters.entity.number;
                }
                switch (session.userData.productType) {
                    case ProductType.Brand:
                    quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons, undefined, "Brands");
                        ProductController.getBrandProducts(session.userData.idToRetrieve, ProductsPerSizeDialog._pageLength, 0).then(productResponse => {
                            productResponse.hits.forEach(product => {
                                if (product.size !== null && (product.size.id === <string>parameters.entity.number || product.size.id === <string>parameters.entity.number + "0")) {
                                    productList.push(product)
                                }
                            });
                        }, reason => {
                            session.send(reason);
                            session.endDialog();
                        }).then(() => {
                            while (session.userData.sizeProductPage < session.userData.displayedProductsOfSize && session.userData.sizeProductPage < productList.length) {
                                productMessageAttachments.push(ProductController.buildProductCard(productList[session.userData.sizeProductPage], session));
                                session.userData.sizeProductPage++;
                            }
                            if (session.userData.sizeProductPage < productList.length) {
                                productMessageAttachments.push(
                                    new builder.HeroCard(session)
                                        .title("Load more")
                                        .images([builder.CardImage.create(session, "http://tools.expertime.digital/bot/load-more.png")])
                                        .buttons([
                                            {
                                                type: "postBack",
                                                title: "Load more",
                                                value: parameters.entity.number
                                            }
                                        ])
                                );
                                session.userData.displayedProductsOfSize += 5;
                            }
                            else {
                                session.userData.sizeProductPage = 0;
                                session.userData.displayedProductsOfSize = 5;
                            }
                            productMessage.attachments(productMessageAttachments);
                            session.send(productMessage);
                            session.send(MessagesController.sendQuickReplies(session, quickRepliesCard));
                            session.endDialog();
                        });
                        break;
                    case ProductType.Category:
                        quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons, undefined, "Categories");
                        ProductController.getCategoryProducts(session.userData.idToRetrieve, ProductsPerSizeDialog._pageLength, 0).then(productResponse => {
                            productResponse.hits.forEach(product => {
                                if (product.size !== null && (product.size.id === <string>parameters.entity.number || product.size.id === <string>parameters.entity.number + "0")) {
                                    productList.push(product)
                                }
                            });
                        }, reason => {
                            session.send(reason);
                            session.endDialog();
                        }).then(() => {
                            while (session.userData.sizeProductPage < session.userData.displayedProductsOfSize && session.userData.sizeProductPage < productList.length) {
                                productMessageAttachments.push(ProductController.buildProductCard(productList[session.userData.sizeProductPage], session));
                                session.userData.sizeProductPage++;
                            }
                            if (session.userData.sizeProductPage < productList.length) {
                                productMessageAttachments.push(
                                    new builder.HeroCard(session)
                                        .title("Load more")
                                        .images([builder.CardImage.create(session, "http://tools.expertime.digital/bot/load-more.png")])
                                        .buttons([
                                            {
                                                type: "postBack",
                                                title: "Load more",
                                                value: parameters.entity.number
                                            }
                                        ])
                                );
                                session.userData.displayedProductsOfSize += 5;
                            }
                            else {
                                session.userData.sizeProductPage = 0;
                                session.userData.displayedProductsOfSize = 5;
                            }
                            productMessage.attachments(productMessageAttachments);
                            session.send(productMessage);
                            session.send(MessagesController.sendQuickReplies(session, quickRepliesCard));
                            session.endDialog();
                        });
                        break;
                    case ProductType.Classic:
                    quickRepliesCard = MessagesController.addQuickRepliesButtons(quickRepliesCard, quickRepliesButtons);
                        ProductController.getProductFromInput(session.userData.idToRetrieve, ProductsPerSizeDialog._pageLength, 0).then(productResponse => {
                            productResponse.hits.forEach(product => {
                                if (product.size !== null && (product.size.id === <string>parameters.entity.number || product.size.id === <string>parameters.entity.number + "0")) {
                                    productList.push(product)
                                }
                            });
                        }, reason => {
                            session.send(reason);
                            session.endDialog();
                        }).then(() => {
                            while (session.userData.sizeProductPage < session.userData.displayedProductsOfSize && session.userData.sizeProductPage < productList.length) {
                                productMessageAttachments.push(ProductController.buildProductCard(productList[session.userData.sizeProductPage], session));
                                session.userData.sizeProductPage++;
                            }
                            if (session.userData.sizeProductPage < productList.length) {
                                productMessageAttachments.push(
                                    new builder.HeroCard(session)
                                        .title("Load more")
                                        .images([builder.CardImage.create(session, "http://tools.expertime.digital/bot/load-more.png")])
                                        .buttons([
                                            {
                                                type: "postBack",
                                                title: "Load more",
                                                value: parameters.entity.number
                                            }
                                        ])
                                );
                                session.userData.displayedProductsOfSize += 5;
                            }
                            else {
                                session.userData.sizeProductPage = 0;
                                session.userData.displayedProductsOfSize = 5;
                            }
                            productMessage.attachments(productMessageAttachments);
                            session.send(productMessage);
                            session.send(MessagesController.sendQuickReplies(session, quickRepliesCard));
                            session.endDialog();
                        });
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