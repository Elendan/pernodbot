import * as https from "https";
import Categories from "../models/Categories";

class CategoryController {

    /**
     * Get Categories
     * @param limit 
     */
    public static getCategories(limit: number): Promise<Categories[]> {
        return new Promise<any>((resolve, reject) => {
            https.get({
                host: process.env.PERNOD_API_HOST,
                path: `${process.env.PERNOD_API_PATH}/product/category?locale=en_US&pageLength=${limit}`,
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
                        resolve(JSON.parse(body).hits);
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