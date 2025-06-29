import { notFound } from "next/navigation";
import Link from "next/link";
import { getImageURL } from "@/app/config";

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  author?: string;
  topic_id: number;
  thumbnail?: string;
  status: number;
  created_at?: string;
  updated_at?: string;
  topic?: {
    id: number;
    name: string;
    slug: string;
    description: string;
    status: number;
    created_at?: string;
    updated_at?: string;
  };
}

const API_URL = "http://localhost:8000/api";

async function getPostBySlug(slug: string) {
  const res = await fetch(`${API_URL}/posts-by-slug/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const response = await getPostBySlug(params.slug);

  if (!response?.success || !response?.data?.post) {
    notFound();
  }

  const post = response.data.post;

  const plainText = post.content?.replace(/<[^>]+>/g, "").substring(0, 160) || "";

  return {
    title: post.title,
    description: plainText,
    openGraph: {
      title: post.title,
      description: plainText,
      images: post.thumbnail ? [getImageURL(post.thumbnail)] : [],
    },
  };
}

export async function generateStaticParams() {
  const res = await fetch('http://localhost:8000/api/posts');
  const data = await res.json();

  const posts = data?.data?.posts || [];

  return posts.map((post: { slug: string }) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ 
  params 
}: {
  params: { slug: string }
}) {
  const response = await getPostBySlug(params.slug);
  const post: Post = response?.data?.post || {};
  const relatedPosts: Post[] = response?.data?.related_posts || [];
  const latestPosts: Post[] = response?.data?.latest_posts || [];

  if (!post || !response?.success) {
    notFound();
  }

  return (
    <div className="max-w-8xl h-full mx-auto px-6">
      <div className="h-full flex flex-col md:flex-row gap-8 py-8">
        {/* Main content - left column */}
        <div className="flex-1 bg-gray-50 p-6 rounded-lg">
          {/* Breadcrumb */}
          <div className="text-sm italic mb-4">
            <Link href="/" className="hover:underline">
              Trang chủ
            </Link>
            <span> &gt;&gt; </span>
            <Link href="/bai-viet" className="hover:underline">
              {post.topic?.name}
            </Link>
            <span> &gt;&gt; </span>
            <span className="text-gray-600">{post.title}</span>
          </div>

          {/* Ngày cập nhật và tác giả */}
          <div className="flex justify-between items-center mb-4 text-gray-500 text-sm">
            <div className="italic">
              {post.updated_at && (
                <span>
                  Cập nhật lần cuối:{" "}
                  {new Date(post.updated_at).toLocaleDateString("vi-VN")}
                </span>
              )}
            </div>
            {post.topic && (
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                {post.topic.name}
              </span>
            )}
          </div>

          {/* Tiêu đề */}
          <h1 className="text-3xl font-bold mb-6">{post.title}</h1>

          {/* Thumbnail */}
          {post.thumbnail && (
            <div className="mb-8 text-center">
              <img
                src={getImageURL(post.thumbnail || "")}
                alt={post.title}
                className="max-w-full h-auto mx-auto rounded-lg shadow-md"
              />
            </div>
          )}

          {/* Nội dung bài viết */}
          <div className="prose max-w-none mb-12">
            <div
              className="post-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* Tác giả */}
          <div className="text-right italic mt-6 text-gray-700 border-t pt-4">
            {post.author && (
              <span>
                Tác giả: <span className="font-medium">{post.author}</span>
              </span>
            )}
          </div>

          {/* Bài viết liên quan */}
          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-4">Bài viết liên quan</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {relatedPosts.map((post: Post) => (
                  <Link
                    key={post.id}
                    href={`/bai-viet/${post.slug}`}
                    className="rounded-2xl shadow-lg p-5 bg-white hover:shadow-xl transition"
                  >
                    {post.thumbnail && (
                      <img
                        src={getImageURL(post.thumbnail || "")}
                        alt={post.title}
                        className="w-full h-48 object-contain bg-gray-100 rounded-lg mb-4"
                      />
                    )}
                    <h3 className="text-xl font-medium mb-2">{post.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <span>{post.author}</span>
                      <span className="mx-2">•</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - right column */}
        <div className="md:w-120 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Bài viết mới nhất</h2>
          <div className="space-y-3">
            {latestPosts.map((post: Post) => (
              <Link
                key={post.id}
                href={`/bai-viet/${post.slug}`}
                className="block p-3 hover:bg-gray-100 rounded transition-colors"
              >
                <h3 className="font-medium">{post.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}