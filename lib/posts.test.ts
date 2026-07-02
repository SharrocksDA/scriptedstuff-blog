import fs from 'fs';
import os from 'os';
import path from 'path';
import { afterEach, describe, expect, it } from 'vitest';
import { getAllPosts, getHomePageMetadata, getPostBySlug } from './posts';

let tempRoot: string | null = null;

function createTempRoot() {
  tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'scriptedstuff-posts-'));
  return tempRoot;
}

function writePost(postsDirectory: string, slug: string, fileName: string, markdown: string) {
  const postDirectory = path.join(postsDirectory, slug);
  fs.mkdirSync(postDirectory, { recursive: true });
  fs.writeFileSync(path.join(postDirectory, fileName), markdown);
}

afterEach(() => {
  if (tempRoot) {
    fs.rmSync(tempRoot, { recursive: true, force: true });
    tempRoot = null;
  }
});

describe('getAllPosts', () => {
  it('loads posts from index.md and slug-named markdown files newest first', () => {
    const root = createTempRoot();
    const postsDirectory = path.join(root, 'posts');
    fs.mkdirSync(postsDirectory);

    writePost(
      postsDirectory,
      'first-post',
      'index.md',
      `---
title: First Post
date: 2024-01-01
tags:
  - testing
description: The first post
---

First body.`,
    );
    writePost(
      postsDirectory,
      'second-post',
      'second-post.md',
      `---
title: Second Post
date: 2025-01-01
tags:
  - nextjs
---

Second body.`,
    );

    const posts = getAllPosts({ postsDirectory, nodeEnv: 'production' });

    expect(posts.map((post) => post.slug)).toEqual(['second-post', 'first-post']);
    expect(posts[0]).toMatchObject({
      title: 'Second Post',
      date: '2025-01-01',
      tags: ['nextjs'],
      description: '',
      draft: false,
    });
    expect(posts[1]).toMatchObject({
      title: 'First Post',
      tags: ['testing'],
      description: 'The first post',
    });
  });

  it('ignores directories without markdown and applies metadata defaults', () => {
    const root = createTempRoot();
    const postsDirectory = path.join(root, 'posts');
    fs.mkdirSync(path.join(postsDirectory, 'empty-post'), { recursive: true });

    writePost(postsDirectory, 'fallback-post', 'index.md', 'Fallback body.');

    const posts = getAllPosts({ postsDirectory, nodeEnv: 'production' });

    expect(posts).toHaveLength(1);
    expect(posts[0]).toMatchObject({
      slug: 'fallback-post',
      title: 'fallback-post',
      tags: [],
      description: '',
      draft: false,
    });
    expect(new Date(posts[0].date).toString()).not.toBe('Invalid Date');
  });

  it('hides draft posts outside development', () => {
    const root = createTempRoot();
    const postsDirectory = path.join(root, 'posts');
    fs.mkdirSync(postsDirectory);

    writePost(
      postsDirectory,
      'published-post',
      'index.md',
      `---
title: Published
date: 2024-01-01
---

Published body.`,
    );
    writePost(
      postsDirectory,
      'draft-post',
      'index.md',
      `---
title: Draft
date: 2025-01-01
draft: true
---

Draft body.`,
    );

    expect(getAllPosts({ postsDirectory, nodeEnv: 'production' }).map((post) => post.slug)).toEqual([
      'published-post',
    ]);
    expect(getAllPosts({ postsDirectory, nodeEnv: 'development' }).map((post) => post.slug)).toEqual([
      'draft-post',
      'published-post',
    ]);
  });
});

describe('getPostBySlug', () => {
  it('returns parsed frontmatter and markdown content for a post', () => {
    const root = createTempRoot();
    const postsDirectory = path.join(root, 'posts');
    fs.mkdirSync(postsDirectory);

    writePost(
      postsDirectory,
      'post-with-content',
      'index.md',
      `---
title: Post With Content
date: 2024-04-15
tags:
  - markdown
description: Has a body
---

# Hello

This is the body.`,
    );

    const post = getPostBySlug('post-with-content', { postsDirectory });

    expect(post).toMatchObject({
      slug: 'post-with-content',
      title: 'Post With Content',
      date: '2024-04-15',
      tags: ['markdown'],
      description: 'Has a body',
      draft: false,
    });
    expect(post?.content).toContain('# Hello');
    expect(post?.content).toContain('This is the body.');
  });

  it('supports slug-named markdown files and returns null for missing posts', () => {
    const root = createTempRoot();
    const postsDirectory = path.join(root, 'posts');
    fs.mkdirSync(postsDirectory);

    writePost(
      postsDirectory,
      'slug-file',
      'slug-file.md',
      `---
title: Slug File
date: 2024-06-01
---

Slug file body.`,
    );

    expect(getPostBySlug('slug-file', { postsDirectory })?.title).toBe('Slug File');
    expect(getPostBySlug('missing-post', { postsDirectory })).toBeNull();
  });
});

describe('getHomePageMetadata', () => {
  it('reads homepage frontmatter and markdown content', () => {
    const root = createTempRoot();
    const homePagePath = path.join(root, '_index.md');
    fs.writeFileSync(
      homePagePath,
      `---
title: Custom Home
description: Custom description
---

Welcome home.`,
    );

    expect(getHomePageMetadata({ homePagePath })).toEqual({
      title: 'Custom Home',
      description: 'Custom description',
      content: '\nWelcome home.',
    });
  });

  it('applies homepage metadata defaults', () => {
    const root = createTempRoot();
    const homePagePath = path.join(root, '_index.md');
    fs.writeFileSync(homePagePath, 'Default homepage body.');

    expect(getHomePageMetadata({ homePagePath })).toEqual({
      title: 'ScriptedStuff',
      description: '',
      content: 'Default homepage body.',
    });
  });
});
