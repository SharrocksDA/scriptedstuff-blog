import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export interface PostMetadata {
  title: string;
  date: string;
  tags?: string[];
  description?: string;
  slug: string;
  draft?: boolean;
}

export interface Post extends PostMetadata {
  content: string;
}

export function getAllPosts(): PostMetadata[] {
  const postDirs = fs.readdirSync(postsDirectory);
  
  const posts = postDirs
    .map((dir) => {
      const fullPath = path.join(postsDirectory, dir);
      if (!fs.statSync(fullPath).isDirectory()) return null;
      
      // Look for index.md or the directory name.md
      let filePath = path.join(fullPath, 'index.md');
      if (!fs.existsSync(filePath)) {
        filePath = path.join(fullPath, `${dir}.md`);
      }
      
      if (!fs.existsSync(filePath)) return null;
      
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);
      
      return {
        slug: dir,
        title: data.title || dir,
        date: data.date || new Date().toISOString(),
        tags: data.tags || [],
        description: data.description || '',
        draft: data.draft || false,
      } as PostMetadata;
    })
    .filter((post): post is PostMetadata => post !== null)
    .filter((post) => !post.draft || process.env.NODE_ENV === 'development')
    .sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));
  
  return posts;
}

export function getPostBySlug(slug: string): Post | null {
  const fullPath = path.join(postsDirectory, slug);
  
  if (!fs.existsSync(fullPath)) return null;
  
  // Look for index.md or the directory name.md
  let filePath = path.join(fullPath, 'index.md');
  if (!fs.existsSync(filePath)) {
    filePath = path.join(fullPath, `${slug}.md`);
  }
  
  if (!fs.existsSync(filePath)) return null;
  
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  
  return {
    slug,
    title: data.title || slug,
    date: data.date || new Date().toISOString(),
    draft: data.draft || false,
    tags: data.tags || [],
    description: data.description || '',
    content,
  };
}
