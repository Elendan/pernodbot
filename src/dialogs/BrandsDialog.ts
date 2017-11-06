import * as builder from "botbuilder";
import BaseDialog from "./basedialog";
import BrandController from "../controllers/BrandController";

class BrandsDialog extends BaseDialog{

    constructor() {
        super();
        this.dialog = [
            (session, args, next) => {
                BrandController.getBrands(9).then(brands => {
                    let brandsMessage = new builder.Message(session);
                    let brandsMessageAttachments: builder.AttachmentType[] = [];
                    brandsMessage.attachmentLayout(builder.AttachmentLayout.carousel);
                    brands.forEach(brand => {
                        let brandCard = new builder.HeroCard(session)
                            .title(brand.label);
                        if(brand.medias.logoPrincipal.urls) {
                            brandCard.images([builder.CardImage.create(session, brand.medias.logoPrincipal.urls.original)]);
                        }
                        brandsMessageAttachments.push(brandCard);
                    });
                    brandsMessage.attachments(brandsMessageAttachments);
                    session.send(brandsMessage);
                    session.endDialog();
                }, reason => {
                    session.send(reason);
                    session.endDialog();
                });
            }
        ]
    }
}

export default BrandsDialog;