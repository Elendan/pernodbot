import * as builder from "botbuilder";
import * as apiai from "apiai";
import BaseDialog from "./basedialog";
import MessageTypes from "../enums/MessageTypes";
import MessengerController from "../controllers/MessengerController";

class DialogflowDialog extends BaseDialog {

  private messengerResponse(session: builder.Session, messages: any[]): void {
    let quickReplies = MessengerController.QuickReplies();
    let facebookReply = new builder.Message(session);
    messages.forEach(message => {
      switch (message.type) {
        case MessageTypes.Text:
          facebookReply.text(message.speech);
          session.send(facebookReply);
          break;
        case MessageTypes.Card:
          break;
        case MessageTypes.QuickReplies:
          quickReplies.facebook.quick_replies.push(JSON.stringify(message.speech));
          break;
        case MessageTypes.Image:
          break;
      }
    });
    if (quickReplies.facebook.quick_replies.length) {
      facebookReply.sourceEvent(quickReplies);
      session.send(facebookReply);
    }
  }


  private defaultResponse(session: builder.Session, messages: any[]): void {
    let responseMessage = new builder.Message(session);
    let responseMessageAttachments: builder.AttachmentType[] = [];
    messages.forEach(message => {
      switch (message.type) {
        case MessageTypes.Text:
          responseMessage.text(message.speech);
          session.send(responseMessage);
          responseMessage = new builder.Message(session);
          break;
        case MessageTypes.Card:
          responseMessage.attachmentLayout(builder.AttachmentLayout.carousel);
          let card = new builder.HeroCard(session)
            .title(message.title)
            .subtitle(message.subtitle)
            .text("")
            .images([builder.CardImage.create(session, message.imageUrl)]);
          let buttons: builder.ICardAction[] = [];
          message.buttons.forEach(button => {
            buttons.push({
              type: button.postback ? "openUrl" : "postBack",
              title: button.text,
              value: button.postback || button.text
            });
          });
          card.buttons(buttons)
          responseMessageAttachments.push(card);
          responseMessage.attachments(responseMessageAttachments);
          break;
        case MessageTypes.QuickReplies:
          responseMessage.text(message.title);
          responseMessage.attachmentLayout(builder.AttachmentLayout.list);
          let quickRepliesCard = new builder.HeroCard(session);
          let quickRepliesButtons: builder.ICardAction[] = [];
          message.replies.forEach(replie => {
            quickRepliesButtons.push({
              type: "postBack",
              title: replie,
              value: replie
            });
          });
          quickRepliesCard.buttons(quickRepliesButtons);
          responseMessageAttachments.push(quickRepliesCard);
          responseMessage.attachments(responseMessageAttachments);
          break;
        case MessageTypes.Image:
          responseMessage.attachmentLayout(builder.AttachmentLayout.carousel);
          responseMessageAttachments.push(new builder.HeroCard(session)
            .images([builder.CardImage.create(session, message.imageUrl)]));
          responseMessage.attachments(responseMessageAttachments);
          break;
        default:
          break;
      }
    });
    if (responseMessageAttachments.length > 0) {
      session.send(responseMessage);
    }
  }

  constructor() {
    super();
    this.dialog = [
      (session, args, next) => {
        let fulfillment = builder.EntityRecognizer.findEntity(args.intent.entities, "fulfillment");
        if (fulfillment && (fulfillment.entity.messages.length)) {
          let messages = fulfillment.entity.messages.filter(message => {
            return message.platform === "facebook";
          });
          if (!messages.length) {
            messages = fulfillment.entity.messages;
          }
          switch (session.message.source) {
            case "facebook":
              this.messengerResponse(session, messages);
              break;
            default:
              this.defaultResponse(session, messages);
              break;
          }
        }
        session.endDialog();
      }
    ]
  }
}

export default DialogflowDialog;
