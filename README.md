# ClipStack 📋

A modern, sleek clipboard manager Chrome extension built with React, TypeScript, and Tailwind CSS. Keep track of everything you copy with a beautiful, intuitive interface.

## ✨ Features

- **📋 Automatic Clipboard History** - Automatically captures everything you copy
- **📌 Pin Important Items** - Pin frequently used clips to keep them at the top
- **🔍 Smart Search** - Quickly find any copied text with instant search
- **🌓 Dark/Light Themes** - Toggle between beautiful dark and light modes
- **💾 Persistent Storage** - All your clipboard history is saved locally
- **🎨 Sleek UI** - Modern, Vercel-inspired design with smooth animations
- **⚡ Fast & Lightweight** - Built with Vite for optimal performance
- **🔒 Privacy First** - All data stored locally, no external servers

## 🚀 Installation

### From Source

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/clipstack.git
   cd clipstack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the extension**
   ```bash
   npm run build
   ```

4. **Load in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `dist` folder from the project

## 🛠️ Development

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

### Project Structure

```
clipstack/
├── src/
│   ├── App.tsx          # Main React component
│   ├── background.ts    # Background service worker
│   ├── content.ts       # Content script for clipboard capture
│   ├── storage.ts       # Chrome storage utilities
│   ├── types.ts         # TypeScript type definitions
│   ├── main.tsx         # React entry point
│   └── index.css        # Global styles
├── public/
│   └── manifest.json    # Chrome extension manifest
├── dist/                # Built extension (generated)
└── vite.config.ts       # Vite configuration
```

## 🎯 Usage

### Basic Operations

- **Copy Text**: Simply copy any text anywhere - it's automatically saved
- **View History**: Click the ClipStack icon in your Chrome toolbar
- **Search**: Type in the search bar to filter your clipboard history
- **Pin Items**: Click the pin icon to keep important items at the top
- **Copy from History**: Click the copy icon to copy an item back to clipboard
- **Delete Items**: Click the delete icon to remove unwanted entries
- **Toggle Theme**: Click the sun/moon icon to switch between themes

### Keyboard Shortcuts

Currently, the extension uses mouse interactions. Keyboard shortcuts coming soon!

## 🎨 Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite 7** - Build tool
- **Tailwind CSS 4** - Styling
- **React Icons** - Icon library
- **Chrome Extension APIs** - Browser integration

## 📝 Configuration

The extension stores up to **200 clipboard entries** by default. To change this, modify `STORAGE_LIMIT` in `src/storage.ts`:

```typescript
await setEntries(entries.slice(0, 200)); // Change 200 to your desired limit
```

## 🔧 Building for Production

```bash
# Build the extension
npm run build

# The built extension will be in the dist/ folder
# You can now:
# 1. Load it as an unpacked extension in Chrome
# 2. Zip the dist folder for distribution
# 3. Submit to Chrome Web Store
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Known Issues

- Content script only captures text from `clipboardData` events (some specialized copy operations may not be captured)
- Background service worker may need reactivation after Chrome suspends it (automatic)

## 🗺️ Roadmap

- [ ] Keyboard shortcuts for quick access
- [ ] Export/Import clipboard history
- [ ] Categories/Tags for organizing clips
- [ ] Rich text and image support
- [ ] Sync across devices (optional cloud sync)
- [ ] Custom themes
- [ ] Clip editing capabilities

## 💡 Inspiration

Inspired by modern clipboard managers and Vercel's design philosophy - clean, fast, and beautiful.

## 🙏 Acknowledgments

- Icons from [React Icons](https://react-icons.github.io/react-icons/)
- UI inspiration from [Vercel](https://vercel.com)
- Built with [Vite](https://vitejs.dev/)

## 📧 Contact

If you have any questions or suggestions, feel free to open an issue!

---

Made with ❤️ using React + TypeScript + Vite
