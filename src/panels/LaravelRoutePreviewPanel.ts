import { exec } from 'child_process';
import * as vscode from 'vscode';
import { Disposable, Uri, ViewColumn, Webview, WebviewPanel, window } from "vscode";
import { getNonce, getUri } from "../utilities";

const VITE_DEV_SERVER_URL = "http://localhost:5173";

/**
 * This class manages the state and behavior of HelloWorld webview panels.
 *
 * It contains all the data and methods for:
 *
 * - Creating and rendering HelloWorld webview panels
 * - Properly cleaning up and disposing of webview resources when the panel is closed
 * - Setting the HTML (and by proxy CSS/JavaScript) content of the webview panel
 * - Setting message listeners so data can be passed between the webview and extension
 */
export class LaravelRoutePreviewPanel {
    public static currentPanel: LaravelRoutePreviewPanel | undefined;
    private readonly _panel: WebviewPanel;
    private _disposables: Disposable[] = [];

    private _isDevMode(): boolean {
        return vscode.workspace.getConfiguration('laravelRoutePreview').get('debugWebview', false);
    }

    /**
     * The LaravelRoutePreviewPanel class private constructor (called only from the render method).
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
            const isDev = vscode.workspace.getConfiguration('laravelRoutePreview').get('debugWebview', false);
            let localResourceRoots = [Uri.joinPath(extensionUri, "out"), Uri.joinPath(extensionUri, "webview-ui/build")];
            if (isDev) {
                localResourceRoots.push(Uri.parse(VITE_DEV_SERVER_URL));
            }

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
                    localResourceRoots: localResourceRoots,
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
        const isDev = this._isDevMode();
        const nonce = getNonce();

        let scriptUri;
        let stylesUri;
        let cspSourceOverrides = '';

        if (isDev) {
            scriptUri = `${VITE_DEV_SERVER_URL}/src/main.tsx`;
            // In dev mode with Vite, styles are often injected by JS, or linked dynamically.
            // We also need to allow Vite's server for styles and scripts in CSP.
            cspSourceOverrides = `${VITE_DEV_SERVER_URL}`;
        } else {
            stylesUri = getUri(webview, extensionUri, ["webview-ui", "build", "assets", "index.css"]);
            scriptUri = getUri(webview, extensionUri, ["webview-ui", "build", "assets", "index.js"]);
        }

        // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
        let csp = `default-src 'none'; script-src 'nonce-${nonce}'`;
        if (isDev) {
            csp += ` ${VITE_DEV_SERVER_URL}; style-src ${webview.cspSource} ${VITE_DEV_SERVER_URL} 'unsafe-inline';`;
        } else {
            csp += `; style-src ${webview.cspSource};`;
        }

        return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="Content-Security-Policy" content="${csp}">
          ${isDev ? '' : `<link rel="stylesheet" type="text/css" href="${stylesUri}">`}
          <title>Hello World</title>
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
                                webview.postMessage({ type: 'getRoutes', data: stdout });
                            } catch (e) {
                                vscode.window.showErrorMessage('Failed to parse route:list output.');
                                return;
                            }
                        });

                        // Code that should run in response to the hello message command
                        // window.showInformationMessage(text);
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