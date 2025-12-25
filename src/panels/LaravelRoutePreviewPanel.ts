import { exec } from 'child_process';
import * as vscode from 'vscode';
import { Disposable, Uri, ViewColumn, Webview, WebviewPanel, window } from "vscode";
import { getNonce, getUri } from "../utilities";
/**
 * This class manages the state and behavior of Laravel Route Preview webview panels.
 *
 * It contains all the data and methods for:
 *
 * - Creating and rendering Laravel Route Preview webview panels
 * - Properly cleaning up and disposing of webview resources when the panel is closed
 * - Setting the HTML (and by proxy CSS/JavaScript) content of the webview panel
 * - Setting message listeners so data can be passed between the webview and extension
 */
export class LaravelRoutePreviewPanel {
    public static currentPanel: LaravelRoutePreviewPanel | undefined;
    private readonly _panel: WebviewPanel;
    private _disposables: Disposable[] = [];

    /**
     * The LaravelRoutePreviewPanel class private constructor (called only from the render method).
     *
     * @param panel A reference to the webview panel
     * @param extensionUri The URI of the directory containing the extension
     */
    private constructor(panel: WebviewPanel, extensionUri: Uri) {
        this._panel = panel;

        // Set an event listener to listen for when the panel is disposed (i.e. when the user closes
        // the panel or when the panel is closed programmatically)
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        // Set the HTML content for the webview panel
        this._panel.webview.html = this._getWebviewContent(this._panel.webview, extensionUri);

        // Set an event listener to listen for messages passed from the webview context
        this._setWebviewMessageListener(this._panel.webview);
    }

    /**
     * Renders the current webview panel if it exists otherwise a new webview panel
     * will be created and displayed.
     *
     * @param extensionUri The URI of the directory containing the extension.
     */
    public static render(extensionUri: Uri) {
        if (LaravelRoutePreviewPanel.currentPanel) {
            // If the webview panel already exists reveal it
            LaravelRoutePreviewPanel.currentPanel._panel.reveal(ViewColumn.One);
        } else {

            // If a webview panel does not already exist create and show a new one
            const panel = window.createWebviewPanel(
                'laravelRoutePreview',
                'Laravel Routes',
                // The editor column the panel should be displayed in
                ViewColumn.One,
                // Extra panel configurations
                {
                    // Enable JavaScript in the webview
                    enableScripts: true,
                    // Restrict the webview to only load resources from the `out` and `webview-ui/build` directories
                    localResourceRoots: [Uri.joinPath(extensionUri, "out"), Uri.joinPath(extensionUri, "webview-ui/build")],
                }
            );

            LaravelRoutePreviewPanel.currentPanel = new LaravelRoutePreviewPanel(panel, extensionUri);

        }
    }

    /**
     * Cleans up and disposes of webview resources when the webview panel is closed.
     */
    public dispose() {
        LaravelRoutePreviewPanel.currentPanel = undefined;

        // Dispose of the current webview panel
        this._panel.dispose();

        // Dispose of all disposables (i.e. commands) for the current webview panel
        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }

    /**
     * Defines and returns the HTML that should be rendered within the webview panel.
     *
     * @remarks This is also the place where references to the React webview build files
     * are created and inserted into the webview HTML.
     *
     * @param webview A reference to the extension webview
     * @param extensionUri The URI of the directory containing the extension
     * @returns A template string literal containing the HTML that should be
     * rendered within the webview panel
     */
    private _getWebviewContent(webview: Webview, extensionUri: Uri) {
        // The CSS file from the React build output
        const stylesUri = getUri(webview, extensionUri, ["webview-ui", "build", "assets", "index.css"]);
        // The JS file from the React build output
        const scriptUri = getUri(webview, extensionUri, ["webview-ui", "build", "assets", "index.js"]);

        const nonce = getNonce();

        // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
        return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
          <link rel="stylesheet" type="text/css" href="${stylesUri}">
          <title>Laravel Routes</title>
        </head>
        <body>
          <div id="root"></div>
          <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
        </body>
      </html>
    `;
    }

    /**
     * Sets up an event listener to listen for messages passed from the webview context and
     * executes code based on the message that is recieved.
     *
     * @param webview A reference to the extension webview
     * @param context A reference to the extension context
     */
    private _setWebviewMessageListener(webview: Webview) {
        webview.onDidReceiveMessage(
            (message: any) => {
                const command = message.command;

                switch (command) {
                    case "getRoutes":

                        const workspaceFolders = vscode.workspace.workspaceFolders;
                        if (!workspaceFolders) {
                            vscode.window.showErrorMessage('No workspace open');
                            return;
                        }

                        const cwd = workspaceFolders[0].uri.fsPath;

                        exec('php artisan route:list --json', { cwd }, (err, stdout, stderr) => {
                            if (err || stderr) {
                                vscode.window.showErrorMessage('Error fetching routes. Make sure Laravel is installed.');
                                return;
                            }

                            let routes;
                            try {
                                routes = JSON.parse(stdout);
                                webview.postMessage({ type: 'getRoutes', data: routes });
                            } catch (e) {
                                vscode.window.showErrorMessage('Failed to parse route:list output.');
                                return;
                            }
                        });

                        return;
                    case "openController":
                        const { action } = message;

                        if (!action || action === "Closure" || !action.includes("\\")) {
                            vscode.window.showInformationMessage("This action is not a controller.");
                            return;
                        }

                        // Parse the controller path
                        const [fullPath] = action.split("@");

                        // Convert namespace to file path
                        // Example: App\\Http\\Controllers\\UserController -> app/Http/Controllers/UserController.php
                        let relativePath = fullPath.replace(/\\/g, "/") + ".php";

                        // Handle common Laravel namespace mappings
                        if (relativePath.startsWith("App/")) {
                            relativePath = relativePath.replace("App/", "app/");
                        }

                        const workspaceFolders2 = vscode.workspace.workspaceFolders;
                        if (!workspaceFolders2) {
                            vscode.window.showErrorMessage("No workspace open");
                            return;
                        }

                        const workspaceRoot = workspaceFolders2[0].uri.fsPath;
                        const filePath = vscode.Uri.file(`${workspaceRoot}/${relativePath}`);

                        // Try to open the file
                        vscode.workspace.fs.stat(filePath).then(
                            () => {
                                // File exists, open it
                                vscode.window.showTextDocument(filePath);
                            },
                            () => {
                                // File not found, show error
                                vscode.window.showErrorMessage(
                                    `Controller file not found: ${relativePath}`
                                );
                            }
                        );

                        return;
                    // Add more switch case statements here as more webview message commands
                    // are created within the webview context (i.e. inside media/main.js)
                }
            },
            undefined,
            this._disposables
        );
    }
}