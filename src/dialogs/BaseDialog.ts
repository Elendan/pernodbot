import * as builder from "botbuilder";

abstract class BaseDialog {

    public static SessionDataStorage = new Set();
    protected dialog: builder.IDialogWaterfallStep[] | builder.IDialogWaterfallStep | builder.IntentDialog;

    /**
     * Register dialog to bot
     * @param bot 
     * @param path 
     */
    public register(bot: builder.UniversalBot, path: string, action?: builder.ITriggerActionOptions): void {
        const dialog = bot.dialog(path, this.dialog);
        if (action) {
            dialog.triggerAction(action);
        }
    }

}

export default BaseDialog;