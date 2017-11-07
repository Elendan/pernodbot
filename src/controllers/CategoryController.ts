import * as https from "https";
import CategoriesResponse from "../models/CategoryResponse";

class CategoryController {

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
                    if(body) {
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

}

export default CategoryController;