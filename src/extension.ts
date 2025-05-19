// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { exec } from 'child_process';
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('laravelRoutePreview.showRoutes', async () => {
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
				} catch (e) {
					vscode.window.showErrorMessage('Failed to parse route:list output.');
					return;
				}

				const panel = vscode.window.createWebviewPanel(
					'laravelRoutePreview',
					'Laravel Routes',
					vscode.ViewColumn.One,
					{ enableScripts: true }
				);

				const html = buildHtml(routes);
				panel.webview.html = html;
			});
		})
	);
}

function buildHtml(routes: any[]): string {
	const rows = routes
		.map(route => {
			return `<tr>
        <td>${route.method}</td>
        <td>${route.uri}</td>
		<td>${route.name}</td>
        <td>${route.action}</td>
        <td>${route.middleware}</td>
      </tr>`;
		})
		.join('');

	return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Laravel Routes</title>
    <style>
      body { font-family: sans-serif; padding: 1rem; }
      table { border-collapse: collapse; width: 100%; }
      th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
    //   th { background-color: #f2f2f2; }
      tr:hover { background-color: #f9f9f9; }
    </style>
  </head>
  <body>
    <h2>Laravel Route List</h2>
    <table>
      <thead>
        <tr><th>Method</th><th>URI</th><th>name</th><th>Action</th><th>Middleware</th></tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  </body>
  </html>
  `;
}

// This method is called when your extension is deactivated
export function deactivate() { }
