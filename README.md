# HBS Parser - Real-time Handlebars Template Editor

A modern, developer-friendly web application for creating, editing, and previewing Handlebars templates in real-time. Built with Next.js, featuring a VS Code-like editor experience with live preview and export capabilities.

## ✨ Features

- **Real-time Preview**: See your Handlebars templates render instantly as you type
- **VS Code-like Editor**: Monaco Editor with syntax highlighting, autocomplete, and dark/light themes
- **Dual Panel Layout**: Edit templates and data side-by-side with live compilation
- **Smart Tabs**: Switch between template (.hbs) and data (.json) editing
- **Theme Toggle**: Seamless switching between dark and light themes
- **Copy to Clipboard**: One-click HTML copying for easy sharing
- **Auto-play Mode**: Toggle real-time compilation on/off
- **Import Support**: Load existing .hbs, .html, .json, and .txt files
- **Custom Helpers**: Built-in Handlebars helpers for common operations
- **Responsive Design**: Optimized for maximum screen real estate
- **Production Ready**: Error boundaries, loading states, and PWA support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd hbs-parser
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Run the development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
pnpm build
pnpm start
```

## 🎯 Usage

### Basic Workflow

1. **Edit Template**: Write your Handlebars template in the left panel
2. **Input Data**: Add your JSON data in the data tab
3. **Live Preview**: See the rendered HTML in real-time on the right
4. **Export**: Copy HTML to clipboard or download as needed

### Handlebars Features Supported

- **Basic Syntax**: `{{variable}}`, `{{#if}}`, `{{#each}}`
- **Custom Helpers**: 
  - `{{formatDate date}}` - Format dates
  - `{{eq a b}}` - Equality comparison
  - `{{gt a b}}` - Greater than comparison
  - `{{lt a b}}` - Less than comparison

### Keyboard Shortcuts

- **Tab Switching**: Click between template and data tabs
- **Theme Toggle**: Click the sun/moon icon
- **Auto-play**: Toggle the play/stop button
- **Copy HTML**: Use the copy button for instant clipboard access

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Editor**: Monaco Editor (VS Code's editor engine)
- **Animations**: Framer Motion
- **UI Components**: Radix UI primitives with shadcn/ui
- **Templating**: Handlebars.js
- **Build Tool**: pnpm

## 🎨 Design Features

- **Glassmorphic UI**: Modern, translucent interface elements
- **Smooth Animations**: 60fps transitions and micro-interactions
- **Dark Theme**: Professional dark theme optimized for developers
- **Responsive Layout**: Maximizes screen space for editing
- **VS Code Aesthetics**: Familiar tab design and color scheme

## 📁 Project Structure

```
hbs-parser/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles and Tailwind
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Main application page
│   ├── metadata.ts        # SEO and app metadata
│   └── manifest.ts        # PWA manifest
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── error-boundary.tsx # Error handling
│   ├── loading.tsx       # Loading states
│   └── providers.tsx     # App providers
├── lib/                  # Utility functions
│   └── utils.ts          # Common utilities
└── types/                # TypeScript declarations
```

## 🔧 Configuration

### Environment Variables

No environment variables required for basic functionality.

### Customization

- **Themes**: Modify colors in `tailwind.config.js`
- **Helpers**: Add custom Handlebars helpers in `app/page.tsx`
- **Styling**: Update `app/globals.css` for custom CSS

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Other Platforms

- **Netlify**: Compatible with Next.js
- **Railway**: Easy deployment with database support
- **Docker**: Containerized deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- **Monaco Editor** - VS Code's editor engine
- **Handlebars.js** - Powerful templating engine
- **Framer Motion** - Smooth animations
- **Tailwind CSS** - Utility-first CSS framework
- **Next.js Team** - Amazing React framework

## 📞 Support

- **Issues**: Create GitHub issues for bugs
- **Discussions**: Use GitHub discussions for questions
- **Email**: Contact maintainers directly

---

Built with ❤️ for developers who love Handlebars templates
