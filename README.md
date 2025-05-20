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

To enable live reloading for the webview UI during development, set the `Laravel Route Preview: Debug Webview` (or `laravelRoutePreview.debugWebview`) setting to `true` in your VS Code settings.

Navigate to the `webview-ui` directory in your terminal and run `npm run dev` to start the Vite development server.
```bash
cd webview-ui
npm run dev
```
This will allow you to see changes to the UI in real-time as you edit the files in `webview-ui/src`.

Remember to set `laravelRoutePreview.debugWebview` back to `false` when you are done with UI development to use the production build of the webview.