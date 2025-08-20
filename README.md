# HBS Parser - Real-time Handlebars Template Preview

A developer-friendly web application for parsing and previewing Handlebars templates in real-time. Built with Next.js, Monaco Editor (VSCode-like), and Handlebars.

## ✨ Features

- **Real-time Preview**: See your Handlebars templates rendered instantly as you type
- **VSCode-like Editor**: Monaco Editor with syntax highlighting, autocomplete, and IntelliSense
- **Dual-panel Layout**: 50/50 split between template/data editing and HTML preview
- **Tabbed Interface**: Switch between template (.hbs) and data (JSON) editing
- **Auto-compilation**: Real-time template compilation with error handling
- **Custom Helpers**: Built-in Handlebars helpers (formatDate, eq, gt, lt)
- **File Import/Export**: Import template and data files, export compiled HTML
- **Auto-play Toggle**: Control when templates are compiled
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd hbs-parser-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Template Editor
- Write Handlebars templates using standard syntax
- Supports all Handlebars features: variables, helpers, partials, blocks
- Syntax highlighting and autocomplete for better development experience

### Data Editor
- Input JSON data that will be used to populate your templates
- Automatic JSON validation and formatting
- Real-time error checking

### HTML Preview
- See your compiled HTML rendered in real-time
- Error messages displayed when compilation fails
- Export functionality to download the final HTML

### Custom Helpers
The app includes several built-in Handlebars helpers:

```handlebars
{{formatDate date}}           <!-- Format dates -->
{{#if (eq value1 value2)}}   <!-- Equality check -->
{{#if (gt value1 value2)}}   <!-- Greater than -->
{{#if (lt value1 value2)}}   <!-- Less than -->
```

## 🛠️ Built With

- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[Monaco Editor](https://microsoft.github.io/monaco-editor/)** - VSCode-like code editor
- **[Handlebars](https://handlebarsjs.com/)** - Template engine
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Lucide React](https://lucide.dev/)** - Beautiful icons
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety

## 📁 Project Structure

```
hbs-parser-app/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles and Tailwind
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main application page
├── public/                 # Static assets
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

## 🔧 Configuration

### Tailwind CSS
Custom colors and fonts are configured in `tailwind.config.js` to match the VSCode-like theme.

### Monaco Editor
The editor is configured with:
- Dark theme (`vs-dark`)
- Disabled minimap for cleaner interface
- Autocomplete and IntelliSense enabled
- Word wrap and automatic layout

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) for the excellent code editing experience
- [Handlebars](https://handlebarsjs.com/) for the powerful templating engine
- [Tailwind CSS](https://tailwindcss.com/) for the beautiful utility-first CSS framework

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the maintainers.

---

**Happy templating! 🎉**
