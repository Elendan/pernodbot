import * as https from "https";
import * as builder from "botbuilder";
import ProductResponse from "../models/ProductResponse";
import Product from "../models/Product";

class ProductController {

    /**
     * Get brands
     * @param brandId
     * @param pageLength 
     * @param page
     */
    public static getBrandProducts(brandId: string, pageLength: number, page: number): Promise<ProductResponse> {
        return new Promise<any>((resolve, reject) => {
            https.get({
                host: process.env.PERNOD_API_HOST,
                path: `${process.env.PERNOD_API_PATH}/product?brandId=${brandId}&retailerId=en_US-walmart&pageLength=${pageLength}&start=${page}`,
                headers: {
                    "Content-Type": "application/json",
                    "api_key": process.env.PERNOD_API_KEY
                }
            }, response => {
                let body = "";
                response.on("data", data => {
                    body += data;
                });
                response.on("end", () => {
                    if (body) {
                        resolve(JSON.parse(body));
                    }
                    else {
                        resolve(null);
                    }
                });
                response.on("error", error => {
                    reject(error);
                });
            });
        });
    }

    /**
     * Get brands
     * @param categoryId
     * @param pageLength 
     * @param page
     */
    public static getCategoryProducts(categoryId: string, pageLength: number, page: number): Promise<ProductResponse> {
        return new Promise<any>((resolve, reject) => {
            https.get({
                host: process.env.PERNOD_API_HOST,
                path: `${process.env.PERNOD_API_PATH}/product?categoryId=${categoryId}&retailerId=en_US-walmart&pageLength=${pageLength}&start=${page}`,
                headers: {
                    "Content-Type": "application/json",
                    "api_key": process.env.PERNOD_API_KEY
                }
            }, response => {
                let body = "";
                response.on("data", data => {
                    body += data;
                });
                response.on("end", () => {
                    if (body) {
                        resolve(JSON.parse(body));
                    }
                    else {
                        resolve(null);
                    }
                });
                response.on("error", error => {
                    reject(error);
                });
            });
        });
    }


    /**
     *  Get Product by ID
     * @param ProductId
     */
    public static getProductById(ProductId: string): Promise<Product> {
        return new Promise<any>((resolve, reject) => {
            https.get({
                host: process.env.PERNOD_API_HOST,
                path: `${process.env.PERNOD_API_PATH}/product/${ProductId}/en_US?htmlformat=false`,
                headers: {
                    "Content-Type": "application/json",
                    "api_key": process.env.PERNOD_API_KEY
                }
            }, response => {
                let body = "";
                response.on("data", data => {
                    body += data;
                });
                response.on("end", () => {
                    if (body) {
                        resolve(JSON.parse(body));
                    }
                    else {
                        resolve(null);
                    }
                });
                response.on("error", error => {
                    reject(error);
                });
            });
        });
    }


    /**
     * Get product informations
     * @param product 
     * @param session 
     */
    public static getInformations(product: Product, session: builder.Session): string[] {
        let informations = [];
        if (product.size !== null && product.size !== undefined) {
            informations.push("Size");
            session.userData.productSize = product.size.label;
        }
        if (product.ingredientList !== null && product.ingredientList !== undefined) {
            informations.push("Ingredients");
            session.userData.productIngredients = product.ingredientList;
        }
        if (product.consumptionTips !== null && product.consumptionTips !== undefined) {
            informations.push("Consumption Tips");
            session.userData.consumptionTips = product.consumptionTips;
        }
        if (product.productHistory !== null && product.productHistory !== undefined) {
            informations.push("Product History");
            session.userData.productHistory = product.productHistory;
        }
        return informations;
    }

    /**
     * Build a product card
     * @param brand 
     * @param session 
     */
    public static buildProductCard(product: Product, session: builder.Session): builder.HeroCard {
        let productCard = new builder.HeroCard(session)
            .title(product.productName)
            .buttons([{
                type: "postBack",
                title: "Description",
                value: `send details about ${product.id}`
            },
            {
                type: "postBack",
                title: "Buy this product 🛒",
                value: "Buy this product"
            },
            {
                type: "postBack",
                title: "Other informations",
                value: `send informations about ${product.id}`
            }]);
        if ((product.mediaList.length > 0) && product.mediaList[0].urls) {
            productCard.images([builder.CardImage.create(session, product.mediaList[0].urls.bamArticleFull)]);
        }
        else {
            productCard.images([builder.CardImage.create(session, "http://tools.expertime.digital/bot/bouteille-manquante.jpg")]);
        }
        return productCard;
    }
}

export default ProductController;