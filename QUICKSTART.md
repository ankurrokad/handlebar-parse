# 🚀 Quick Start Guide

Get up and running with HBS Parser in under 5 minutes!

## 1. Install Dependencies

```bash
npm install
```

## 2. Start Development Server

```bash
npm run dev
```

## 3. Open Your Browser

Navigate to [http://localhost:3000](http://localhost:3000)

## 4. Start Templating! 🎉

### Try the Sample Template

1. **Switch to Data tab** and paste the sample JSON from `samples/sample-data.json`
2. **Switch to Template tab** and paste the sample template from `samples/sample-template.hbs`
3. **Watch the magic happen** in the HTML preview panel!

### Quick Examples

#### Basic Variables
```handlebars
<h1>{{title}}</h1>
<p>{{description}}</p>
```

#### Conditional Rendering
```handlebars
{{#if showContent}}
  <div>{{content}}</div>
{{else}}
  <p>No content available</p>
{{/if}}
```

#### Loops
```handlebars
<ul>
  {{#each items}}
    <li>{{name}} - {{price}}</li>
  {{/each}}
</ul>
```

#### Custom Helpers
```handlebars
<p>Generated on {{formatDate date}}</p>
{{#if (eq status "active")}}
  <span class="active">Active</span>
{{/if}}
```

## 5. Features to Explore

- **Auto-play Toggle**: Control when templates compile
- **File Import**: Import your existing `.hbs` and `.json` files
- **Export HTML**: Download the compiled result
- **Error Handling**: See compilation errors in real-time
- **Responsive Design**: Works on all devices

## 6. Need Help?

- Check the [README.md](README.md) for detailed documentation
- Look at the sample files in the `samples/` folder
- Open an issue on GitHub if you find bugs

---

**Happy templating! 🎨✨**
