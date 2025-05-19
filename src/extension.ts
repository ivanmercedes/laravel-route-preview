
import { commands, ExtensionContext } from "vscode";
import { LaravelRoutePreviewPanel } from "./panels/LaravelRoutePreviewPanel";

export function activate(context: ExtensionContext) {

	context.subscriptions.push(commands.registerCommand("laravelRoutePreview.showRoutes", () => {
		LaravelRoutePreviewPanel.render(context.extensionUri);
	}));
}
