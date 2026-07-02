import PostList from "@/app/components/PostList";
import { getAllPosts } from "@/lib/posts";

export default function PlaywrightPage() {
  const posts = getAllPosts().filter((post) =>
    post.tags?.includes("playwright"),
  );

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-white">Playwright</h1>
      <PostList posts={posts} />
    </div>
  );
}
