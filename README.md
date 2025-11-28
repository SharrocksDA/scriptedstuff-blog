# ScriptedStuff Blog

A modern, self-hosted technical blog built with Next.js, TypeScript, and Docker. Features static site generation, markdown-based content management, and automated deployment.

🔗 **Live Site:** [https://scriptedstuff.dev](https://scriptedstuff.dev)

## 🚀 Tech Stack

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Content:** Markdown with MDX support
- **Deployment:** Docker + Nginx
- **Reverse Proxy:** nginx-proxy with automatic SSL (Let's Encrypt)
- **Hosting:** Self-hosted on home server

## ✨ Features

- 📝 Markdown-based content management
- 🎨 Custom dark theme matching brand colors
- 🔍 Syntax highlighting for code blocks
- 📱 Fully responsive design
- ⚡ Static site generation for optimal performance
- 🔒 Automatic SSL certificate management
- 🐳 Containerized deployment
- 🚢 CI/CD via git hooks

## 📁 Project Structure

```
blog-next/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with header/footer
│   ├── page.tsx           # Homepage
│   ├── posts/             # Blog post routes
│   └── globals.css        # Global styles
├── content/               # Blog posts (Markdown)
│   └── posts/
├── lib/                   # Utilities
│   └── posts.ts          # Post loading logic
├── public/                # Static assets
│   └── images/
├── Dockerfile             # Production build
└── nginx.conf             # Nginx configuration
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

The deployment script:
1. Builds the static Next.js site
2. Creates a Docker image with Nginx
3. Deploys to production with zero downtime
4. Integrates with nginx-proxy for automatic SSL

### Architecture

- **nginx-proxy** handles incoming requests and SSL termination
- Blog container serves static files via Nginx
- Let's Encrypt certificates auto-renew
- Deployed on home server infrastructure

## 🎯 Key Design Decisions

- **Static Site Generation:** Optimal performance and SEO
- **Markdown-first:** Simple content management, version controlled
- **Docker:** Consistent environments, easy deployment
- **Self-hosted:** Full control, learning opportunity for infrastructure

## 🔧 Configuration

Environment variables are set via Docker at runtime:
- `VIRTUAL_HOST`: Domain name
- `LETSENCRYPT_HOST`: SSL certificate domain
- `LETSENCRYPT_EMAIL`: SSL renewal notifications

## 📝 License

MIT

## 👤 Author

David Sharrocks
- Website: [scriptedstuff.dev](https://scriptedstuff.dev)
- GitHub: [@SharrocksDA](https://github.com/SharrocksDA)
- LinkedIn: [Your LinkedIn](https://uk.linkedin.com/in/davidasharrocks)

---

**Note:** This is a personal project showcasing modern web development practices, TypeScript proficiency, and DevOps capabilities.
