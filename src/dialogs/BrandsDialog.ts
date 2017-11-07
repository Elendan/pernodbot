import * as builder from "botbuilder";
import BaseDialog from "./basedialog";
import BrandController from "../controllers/BrandController";

class BrandsDialog extends BaseDialog{

    private static readonly pageLength = 5;
    private static readonly brandsIntentName = "brands";
    private static readonly loadBrandsIntentName = "load.brands";

    constructor() {
        super();
        this.dialog = [
            (session, args, next) => {
                if((session.userData.brandPage == null) || (args.intent.intent === BrandsDialog.brandsIntentName)) {
                    session.userData.brandPage = 0;
                }
                else if(args.intent.intent === BrandsDialog.loadBrandsIntentName) {
                    session.userData.brandPage++;
                }
                // Get brands
                BrandController.getBrands(BrandsDialog.pageLength, session.userData.brandPage).then(brandResponse => {
                    session.userData.brandPage = brandResponse.page;
                    let brandsMessage = new builder.Message(session);
                    let brandsMessageAttachments: builder.AttachmentType[] = [];
                    brandsMessage.attachmentLayout(builder.AttachmentLayout.carousel);
                    brandResponse.hits.forEach(brand => {
                        // Brand card
                        brandsMessageAttachments.push(BrandController.buildBrandCard(brand, session));
                    });
                    if(brandResponse.nbPages > brandResponse.page) {
                        // Load more brands card
                        brandsMessageAttachments.push(
                            new builder.HeroCard(session)
                                .title("Load more")
                                .images([builder.CardImage.create(session, "http://tools.expertime.digital/bot/logopr.jpg")])
                                .buttons([{
                                    type: "postBack",
                                    title: "Load more",
                                    diplayText: "Load more",
                                    value: "Load more brands"
                                }])
                        );
                    }
                    else {
                        session.userData.brandPage = 0;
                    }
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