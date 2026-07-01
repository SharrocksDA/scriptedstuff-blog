# ScriptedStuff Blog

A modern technical blog built with Next.js and TypeScript. Features static site generation, markdown-based content management, and deployment on Cloudflare Pages.

🔗 **Live Site:** [https://scriptedstuff.dev](https://scriptedstuff.dev)

## 🚀 Tech Stack

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Content:** Markdown with MDX support
- **Deployment:** Cloudflare Pages

## ✨ Features

- 📝 Markdown-based content management
- 🎨 Custom dark theme matching brand colors
- 🔍 Syntax highlighting for code blocks
- 📱 Fully responsive design
- ⚡ Static site generation for optimal performance
- 🔒 SSL and CDN handled by Cloudflare
- 🚢 Git-based deployment via Cloudflare Pages

## 📁 Project Structure

```
app/                       # Next.js App Router
├── layout.tsx             # Root layout with header/footer
├── page.tsx               # Homepage
├── posts/                 # Blog post routes
└── globals.css            # Global styles
content/                   # Blog posts (Markdown)
└── posts/
lib/                       # Utilities
└── posts.ts               # Post loading logic
public/                    # Static assets
└── images/
```

## 🛠️ Development

### Prerequisites

- Node.js 20+
- npm or yarn

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your blog.

### Adding a New Post

1. Create a new directory in `content/posts/`:
   ```bash
   mkdir -p content/posts/my-new-post
   ```

2. Create `index.md` with frontmatter:
   ```markdown
   ---
   title: "My Post Title"
   date: 2025-11-28
   tags: ["nextjs", "typescript"]
   description: "Brief description"
   ---

   Your content here...
   ```

3. Add images to the same directory or `public/images/`

4. Preview locally with `npm run dev`

## 🚢 Deployment

The site is deployed with Cloudflare Pages from the Git repository.

Recommended Cloudflare Pages settings:
- **Framework preset:** Next.js
- **Build command:** `npm run build`
- **Install command:** `npm ci`

## 🎯 Key Design Decisions

- **Static Site Generation:** Optimal performance and SEO
- **Markdown-first:** Simple content management, version controlled
- **Cloudflare Pages:** CDN-backed hosting with Git-based builds

## 📝 License

MIT

## 👤 Author

David Sharrocks
- Website: [scriptedstuff.dev](https://scriptedstuff.dev)
- GitHub: [@SharrocksDA](https://github.com/SharrocksDA)
- LinkedIn: [Your LinkedIn](https://uk.linkedin.com/in/davidasharrocks)

---

**Note:** This is a personal project showcasing modern web development practices, TypeScript proficiency, and DevOps capabilities.
