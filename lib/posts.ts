import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content/posts');
const homePagePath = path.join(process.cwd(), 'content/_index.md');

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

export interface HomePageMetadata {
  title: string;
  description: string;
  content: string;
}

interface ContentOptions {
  postsDirectory?: string;
  homePagePath?: string;
  nodeEnv?: string;
}

function getPostFilePath(directory: string, slug: string): string | null {
  const fullPath = path.join(directory, slug);

  if (!fs.existsSync(fullPath)) return null;

  let filePath = path.join(fullPath, 'index.md');
  if (!fs.existsSync(filePath)) {
    filePath = path.join(fullPath, `${slug}.md`);
  }

  return fs.existsSync(filePath) ? filePath : null;
}

function getPostDate(date: unknown): string {
  if (date instanceof Date) return date.toISOString().slice(0, 10);
  if (typeof date === 'string') return date;
  return new Date().toISOString();
}

export function getHomePageMetadata(options: Pick<ContentOptions, 'homePagePath'> = {}): HomePageMetadata {
  const fileContents = fs.readFileSync(options.homePagePath || homePagePath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    title: data.title || 'ScriptedStuff',
    description: data.description || '',
    content,
  };
}

export function getAllPosts(options: Pick<ContentOptions, 'postsDirectory' | 'nodeEnv'> = {}): PostMetadata[] {
  const directory = options.postsDirectory || postsDirectory;
  const nodeEnv = options.nodeEnv || process.env.NODE_ENV;
  const postDirs = fs.readdirSync(directory);
  
  const posts = postDirs
    .map((dir) => {
      const fullPath = path.join(directory, dir);
      if (!fs.statSync(fullPath).isDirectory()) return null;
      
      const filePath = getPostFilePath(directory, dir);
      if (!filePath) return null;
      
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);
      
      return {
        slug: dir,
        title: data.title || dir,
        date: getPostDate(data.date),
        tags: data.tags || [],
        description: data.description || '',
        draft: data.draft || false,
      } as PostMetadata;
    })
    .filter((post): post is PostMetadata => post !== null)
    .filter((post) => !post.draft || nodeEnv === 'development')
    .sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));
  
  return posts;
}

export function getPostBySlug(slug: string, options: Pick<ContentOptions, 'postsDirectory'> = {}): Post | null {
  const filePath = getPostFilePath(options.postsDirectory || postsDirectory, slug);
  if (!filePath) return null;
  
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  
  return {
    slug,
    title: data.title || slug,
    date: getPostDate(data.date),
    draft: data.draft || false,
    tags: data.tags || [],
    description: data.description || '',
    content,
  };
}
