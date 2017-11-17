import * as https from "https";
import * as builder from "botbuilder";
import CategoriesResponse from "../models/CategoryResponse";
import Category from "../models/Categories"

class CategoryController {
    
    /**
     * Get images
     * @param categoryId
     */
    public static getImages(categoryId: string): string {
        categoryId = categoryId.toLowerCase();
        categoryId = categoryId.replace(/ /g, "-");
        categoryId = categoryId.replace(/_/g, "-");
        categoryId = categoryId.replace("whiskey", "whisky");
        return (`http://tools.expertime.digital/bot/${categoryId}.png`);
    }

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