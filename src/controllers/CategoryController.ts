import * as https from "https";
import * as builder from "botbuilder";
import CategoriesResponse from "../models/CategoryResponse";
import Category from "../models/Categories"

class CategoryController {

    //#region IMAGES
    /**
     * Get images
     * @param categoryId
     */
    public static getImages(categoryId: string) : string {
        switch (categoryId) {
            case "Absinthe":
                return ("http://tools.expertime.digital/bot/absinthe.png");
            case "Accessories":
                return ("http://tools.expertime.digital/bot/accessories.png");
            case "Anise":
                return ("http://tools.expertime.digital/bot/anise.png");
            case "Aperitif":
                return ("http://tools.expertime.digital/bot/aperitif.png");
            case "Bar Mats":
                return ("http://tools.expertime.digital/bot/bar-mats.png");
            case "Bitter":
                return ("http://tools.expertime.digital/bot/bitter.png");
            case "Bourbon":
                return ("http://tools.expertime.digital/bot/bourbon.png");
            case "Branded Gift":
                return ("http://tools.expertime.digital/bot/branded-gift.png");
            case "Brandy":
                return ("http://tools.expertime.digital/bot/brandy.png");
            case "Cachaca":
                return ("http://tools.expertime.digital/bot/cachaca.png");
            case "Calvados":
                return ("http://tools.expertime.digital/bot/calvados.png");
            case "Canadian Whisky":
                return ("http://tools.expertime.digital/bot/canadian-whisky.png");
            case "Champagne":
                return ("http://tools.expertime.digital/bot/champagne.png");
            case "Cognac":
                return ("http://tools.expertime.digital/bot/cognac.png");
            case "Cups and Glasses":
                return ("http://tools.expertime.digital/bot/cups-and-glasses.png");
            case "Distilled":
                return ("http://tools.expertime.digital/bot/distilled.png");
            case "Gin":
                return ("http://tools.expertime.digital/bot/gin.png");
            case "Ice_Buckets":
                return ("http://tools.expertime.digital/bot/ice-buckets.png");
            case "Irish Whiskey":
                return ("http://tools.expertime.digital/bot/irish-whisky.png");
            case "Liqueur":
                return ("http://tools.expertime.digital/bot/liqueur.png");
            case "National Whisky":
                return ("http://tools.expertime.digital/bot/national-whisky.png");
            case "Non Alcoholic Beverage":
                return ("http://tools.expertime.digital/bot/non-alcoholic-beverage.png");
            case "Port Wine":
                return ("http://tools.expertime.digital/bot/port-wine.png");
            case "Rum":
                return ("http://tools.expertime.digital/bot/rum.png");
            case "Scotch Whisky":
                return ("http://tools.expertime.digital/bot/scotch-whisky.png");
            case "Sparkling Wine":
                return ("http://tools.expertime.digital/bot/sparkling-wine.png");
            case "Tequila":
                return ("http://tools.expertime.digital/bot/tequila.png");
            case "Vodka":
                return ("http://tools.expertime.digital/bot/vodka.png");
            case "Vodka Based Cocktail":
                return ("http://tools.expertime.digital/bot/vodka-based-cocktail.png");
            case "Whisky":
                return ("http://tools.expertime.digital/bot/whisky.png");
            case "Wine":
                return ("http://tools.expertime.digital/bot/wine.png");
            case "Wine Based Aperitif":
                return ("http://tools.expertime.digital/bot/wine-based-aperitif.png");
            case "Armagnac":
                return ("http://tools.expertime.digital/bot/armagnac.png")
            case "Spirit Drink":
                return ("http://tools.expertime.digital/bot/spirit-drink.png");
        }
        return ("http://tools.expertime.digital/bot/logopr.jpg")
    }
    //#endregion IMAGES

    /**
     * Get Categories
     * @param pageLength 
     * @param page
     */
    public static getCategories(pageLength: number, page: number): Promise<CategoriesResponse> {
        return new Promise<any>((resolve, reject) => {
            https.get({
                host: process.env.PERNOD_API_HOST,
                path: `${process.env.PERNOD_API_PATH}/product/category?locale=en_US&pageLength=${pageLength}&start=${page}`,
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
     * Build a category card
     * @param category
     * @param session 
     */
    public static buildCategoryCard(category: Category, session: builder.Session): builder.HeroCard {
        let categoryCard = new builder.HeroCard(session)
            .title(category.label)
            .buttons([{
                type: "postBack",
                title: `Choose ${category.label}`,
                value: `research in category ${category.id}`
            }]);
        categoryCard.images([builder.CardImage.create(session, this.getImages(category.label))]);
        return categoryCard;
    }

}

export default CategoryController;