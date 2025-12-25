# Laravel Route Preview

Easily preview your Laravel routes directly from Visual Studio Code in a beautiful, modern interface with advanced features.

![Laravel Route Preview Screenshot](/assets/preview.png) 

---

## ✨ Features

### Modern UI & Design
- 🎨 **Beautiful Card-Based Layout** - Clean, responsive design with glassmorphism effects
- 🌓 **Dark Mode Optimized** - Seamlessly integrates with VSCode themes
- ♿ **Fully Accessible** - Complete keyboard navigation and ARIA labels
- 📱 **Responsive Design** - Adapts to any panel size

### Route Organization
- 📊 **Route Statistics** - View total routes and method distribution at a glance
- 🗂️ **Smart Grouping** - Group routes by prefix or controller
- 📦 **Collapsible Groups** - Organize large route lists efficiently
- 🎯 **Persistent Preferences** - Your grouping and filter choices are saved

### Search & Filtering
- 🔍 **Advanced Search** - Search routes by name, URI, or action with instant results
- 🎯 **Method Filtering** - Filter by HTTP methods (GET, POST, PUT, PATCH, DELETE, OPTIONS)
- 🎨 **Color-Coded Methods** - Instantly identify route types with vibrant badges
  - GET: Emerald green
  - POST: Blue
  - PUT/PATCH: Amber
  - DELETE: Red
  - OPTIONS: Gray
  - ANY: Purple

### Productivity Features
- 📋 **Copy to Clipboard** - One-click copy for URIs and actions
- 🚀 **Controller Navigation** - Click on controller/action to open the file in VSCode
- 📤 **Export Routes** - Export to JSON or CSV formats
- 🔄 **Quick Refresh** - Reload routes without closing the panel
- 📦 **Expandable Middleware** - Collapsible middleware sections to keep things clean

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
5. Click method badges in stats to filter
6. Use grouping controls to organize routes by prefix or controller
7. Click on controller/action names to open the file
8. Click copy icons to copy URIs or actions to clipboard
9. Click export button to download routes as JSON or CSV
10. Click middleware count to expand/collapse middleware details

---

## 🎯 What's New in v1.0.0

### Major Features
- ✨ **Route Grouping** - Group routes by prefix or controller with collapsible headers
- 📤 **Export Functionality** - Export routes to JSON or CSV formats
- 🚀 **Controller Navigation** - Click to open controller files directly in VSCode
- 🎨 **Enhanced UI** - Improved visual hierarchy and interactions
- ⚡ **Performance Optimizations** - Memoized filtering and efficient rendering

### Previous Features (v0.0.3)
- ✨ Complete UI redesign with modern card-based layout
- 📊 Statistics dashboard showing route counts and method distribution
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

No specific settings required. The extension automatically:
- Detects your Laravel project
- Runs `php artisan route:list --json` in the background
- Saves your filter and grouping preferences to localStorage

---

## 🎨 UI Overview

The extension features a modern, professional interface with:

- **Sticky Header** - Search, filters, and grouping controls always accessible
- **Statistics Dashboard** - Quick overview with interactive method badges
- **Grouping Controls** - Toggle between no grouping, group by prefix, or group by controller
- **Route Cards** - Clean, organized display with all route information
- **Export Modal** - Choose between JSON or CSV format
- **Smooth Animations** - Delightful micro-interactions throughout
- **Empty States** - Helpful messages when no routes match filters

---

## 🚀 Controller Navigation

Click on any controller/action to open the file in VSCode:
- Automatically resolves Laravel namespace to file path
- Handles common Laravel directory structures
- Shows helpful error if file not found
- Works with nested controllers

---

## 📤 Export Routes

Export your routes for documentation or analysis:
- **JSON Format** - Structured data with full route information
- **CSV Format** - Spreadsheet-compatible with headers
- **Filtered Export** - Only exports currently visible routes
- **Timestamped Files** - Automatic filename with date

---

## 🐛 Troubleshooting

**Routes not loading?**
- Ensure you have a Laravel project open in your workspace
- Verify PHP is installed and in your PATH
- Check that `php artisan route:list --json` works in your terminal

**Controller navigation not working?**
- Verify the controller file exists in your project
- Check that the namespace matches your directory structure
- Ensure you're clicking on a controller action (not a Closure)

**Extension not appearing?**
- Make sure you're in a workspace (not just an open folder)
- Try reloading VSCode window

---

## 📄 License

MIT License © Ivan Mercedes

---

## 🙌 Contributions

Pull requests and feature suggestions are welcome! 🎉

### Future Enhancements

- [ ] Virtual scrolling for very large route lists (1000+ routes)
- [ ] Route search history
- [ ] Custom color themes
- [ ] Route documentation integration

---

## 💖 Support

If you find this extension helpful, please consider:
- ⭐ Starring the [repository](https://github.com/ivanmercedes/laravel-route-preview)
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 📢 Sharing with others
- ☕ [Buy me a coffee](https://buymeacoffee.com/ivanmercedes)

---

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed list of changes.
