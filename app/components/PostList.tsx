import Link from "next/link";
import { format } from "date-fns";
import type { PostMetadata } from "@/lib/posts";

interface PostListProps {
  posts: PostMetadata[];
}

export default function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return <p className="text-gray-300">New posts coming soon.</p>;
  }

  return (
    <div className="space-y-8">
      {posts.map((post) => (
        <article key={post.slug} className="border-b border-gray-700 pb-8">
          <Link href={`/posts/${post.slug}`}>
            <h2 className="text-2xl font-bold mb-2 text-white hover:text-blue-400">
              {post.title}
            </h2>
          </Link>
          <div className="text-gray-400 mb-2">
            {format(new Date(post.date), "MMMM d, yyyy")}
          </div>
          {post.description && (
            <p className="text-gray-300 mb-4">{post.description}</p>
          )}
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
