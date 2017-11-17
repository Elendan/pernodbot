import * as https from "https";
import * as builder from "botbuilder";
import BrandResponse from "../models/BrandResponse";
import Brand from "../models/Brand";

class BrandController {

    /**
     * Get brands
     * @param pageLength 
     * @param page
     */
    public static getBrands(pageLength: number, page: number): Promise<BrandResponse> {
        return new Promise<any>((resolve, reject) => {
            https.get({
                host: process.env.PERNOD_API_HOST,
                path: `${process.env.PERNOD_API_PATH}/product/brand?locale=en_US&pageLength=${pageLength}&start=${page}`,
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
     * Build a brand card
     * @param brand 
     * @param session 
     */
    public static buildBrandCard(brand: Brand, session: builder.Session): builder.HeroCard {
        let brandCard = new builder.HeroCard(session)
            .title(brand.label)
            .buttons([{
                type: "postBack",
                title: `Choose ${brand.label}`,
                value: `research in brands ${brand.id}`
            }]);
        if (brand.medias.logoPrincipal.urls) {
            brandCard.images([builder.CardImage.create(session, brand.medias.logoPrincipal.urls.original)]);
        }
        else {
            brandCard.images([builder.CardImage.create(session, "http://tools.expertime.digital/bot/logopr.jpg")]);
        }
        return brandCard;
    }

}

export default BrandController;