# Laravel Route Preview

Easily preview your Laravel routes directly from Visual Studio Code in a beautiful, modern interface.

![Laravel Route Preview Screenshot](/assets/preview.png) 

---

## ✨ Features

- 🎨 **Modern Card-Based UI** - Beautiful, responsive card layout with glassmorphism effects
- 📊 **Route Statistics** - View total routes and method distribution at a glance
- 🔍 **Advanced Search** - Search routes by name, URI, or action with instant results
- 🎯 **Smart Filtering** - Filter routes by HTTP methods with visual feedback
- 📋 **Copy to Clipboard** - One-click copy for URIs and actions
- 📦 **Expandable Middleware** - Collapsible middleware sections to keep things clean
- 🎨 **Color-Coded Methods** - Instantly identify route types with vibrant badges
  - GET: Emerald green
  - POST: Blue
  - PUT/PATCH: Amber
  - DELETE: Red
  - OPTIONS: Gray
- 🔄 **Refresh Button** - Reload routes without closing the panel
- 🌓 **Dark Mode Optimized** - Seamlessly integrates with VSCode themes
- ♿ **Accessible** - Full keyboard navigation and ARIA labels
- 📱 **Responsive Design** - Adapts to any panel size

---

## 🔧 Requirements

- A Laravel project open in your workspace
- PHP installed and available in your PATH
- Laravel >= 8.x (required for `route:list --json`)

---

## ▶️ Usage

1. Open a Laravel project in VSCode
2. Press `Ctrl+Shift+P` or `Cmd+Shift+P` on macOS
3. Run the command: **Laravel: Preview Routes**
4. Use the search bar to find specific routes
5. Click method badges to filter by HTTP method
6. Click copy icons to copy URIs or actions to clipboard
7. Click middleware count to expand/collapse middleware details
8. Click refresh icon to reload routes

---

## 🎯 What's New in v0.0.3

- ✨ Complete UI redesign with modern card-based layout
- 📊 New statistics dashboard showing route counts and method distribution
- 🎨 Color-coded method badges with improved styling
- 📋 Copy-to-clipboard functionality for URIs and actions
- 📦 Expandable middleware sections
- 🔍 Enhanced search with clear button
- 🎯 Improved method filtering with Select All/Clear All options
- 🔄 Refresh button to reload routes
- ♿ Better accessibility with ARIA labels
- 🌓 Optimized dark mode support
- 📱 Fully responsive design

---

## 📦 Extension Settings

No specific settings required. The extension automatically detects your Laravel project and runs `php artisan route:list --json` in the background.

---

## 🎨 UI Preview

The extension features a modern, professional interface with:

- **Sticky Header** - Search and filters always accessible
- **Statistics Cards** - Quick overview of your routes
- **Route Cards** - Clean, organized display with all route information
- **Smooth Animations** - Delightful micro-interactions
- **Empty States** - Helpful messages when no routes match filters

---

## 🐛 Troubleshooting

**Routes not loading?**
- Ensure you have a Laravel project open in your workspace
- Verify PHP is installed and in your PATH
- Check that `php artisan route:list --json` works in your terminal

**Extension not appearing?**
- Make sure you're in a workspace (not just an open folder)
- Try reloading VSCode window

---

## 📄 License

MIT License © Ivan Mercedes

---

## 🙌 Contributions

Pull requests and feature suggestions are welcome! 🎉

### Roadmap

- [ ] Route grouping by prefix/controller
- [ ] Export routes to JSON/CSV
- [ ] Virtual scrolling for large route lists
- [ ] Keyboard shortcuts
- [ ] Click to jump to controller/action

---

## 💖 Support

If you find this extension helpful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 📢 Sharing with others
