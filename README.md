# Laravel Route Preview

Easily preview your Laravel routes directly from Visual Studio Code in a beautiful table.



![Laravel Route Preview Screenshot](/assets/preview.png) 

---

## ✨ Features

- 📋 List all Laravel routes with method, name,  URI, controller, action, and middleware.

- ⚡ Runs `php artisan route:list --json` in the background.
- 🧠 WebView interface – clean, responsive and fast.

---

## 🔧 Requirements

- A Laravel project open in your workspace.
- PHP installed and available in your PATH.
- Laravel >= 8.x (required for `route:list --json`).

---

## ▶️ Usage

1. Open a Laravel project in VSCode.
2. Press `Ctrl+Shift+P` or `Cmd+Shift+P` on macOS.
3. Run the command: **Laravel: Preview Routes**
4. Filter routes or click on any URI to jump to the controller.

---

## 📦 Extension Settings

No specific settings required.

---

## 📄 License

MIT License © Ivan Mercedes

---

## 🙌 Contributions

Pull requests and feature suggestions are welcome! 🎉

---

## Developing the Webview UI

To enable live reloading for the webview UI during development:

1.  **Enable Debug Mode**: Set the `Laravel Route Preview: Debug Webview` (or `laravelRoutePreview.debugWebview`) setting to `true` in your VS Code settings.
2.  **Configure the Port (Optional but Recommended)**:
    *   You can specify the port for the Vite development server using the `Laravel Route Preview: Webview Dev Port` (or `laravelRoutePreview.webviewDevPort`) setting in VS Code. This defaults to `5173`.
    *   **It is crucial that the port configured in VS Code settings matches the actual port the Vite development server is running on.**
3.  **Start the Vite Dev Server**: Navigate to the `webview-ui` directory in your terminal and run `npm run dev`.
    ```bash
    cd webview-ui
    npm run dev
    ```
    *   When you run this command, Vite will log the port it's using to the console (e.g., `  ➜  Local:   http://localhost:5173/`).
    *   Vite typically uses port 5173 by default. If this port is busy, it will automatically pick the next available port (e.g., 5174).
    *   You can also set the `PORT` environment variable when running the dev server (e.g., `PORT=5174 npm run dev`) to specify a port. Ensure this matches your `laravelRoutePreview.webviewDevPort` setting in VS Code.

This setup will allow you to see changes to the UI in real-time as you edit the files in `webview-ui/src`, as the webview in VS Code will connect to this development server.

**Important**: Remember to set `laravelRoutePreview.debugWebview` back to `false` when you are done with UI development to use the production build of the webview.