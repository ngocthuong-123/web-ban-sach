"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getImageURL } from "@/app/config";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
} from "react-share";
const API_URL = "http://localhost:8000/api";

export default function BlogPage() {
  const [topics, setTopics] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [currentTopic, setCurrentTopic] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch danh sách topics
  useEffect(() => {
    async function fetchTopics() {
      try {
        const res = await fetch(`${API_URL}/topics`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch topics");
        const data = await res.json();
        setTopics(data.data || data);
      } catch (err) {
        console.error(err);
        setTopics([]);
      }
    }
    fetchTopics();
  }, []);

  // Fetch bài viết mới nhất hoặc theo topic
  // Fetch bài viết mới nhất hoặc theo topic
  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        let url = `${API_URL}/posts-latest`;
        if (currentTopic) {
          url = `${API_URL}/topics/${currentTopic.id}`;
        }

        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();

        if (currentTopic) {
          // data.data là object topic, lấy luôn tên & desc
          //setCurrentTopic(data.data); // update lại (nếu cần)
          setPosts(data.data.posts || []);
        } else {
          // Bài viết mới nhất: data.data là array
          setPosts(data.data || []);
        }
      } catch (err) {
        console.error(err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [currentTopic]);

  const handleTopicClick = (topic: any) => {
    setCurrentTopic(topic);
  };

  const handleResetTopic = () => {
    setCurrentTopic(null);
  };
  const handleShare = async (post: any) => {
    const shareData = {
      title: post.title,
      text:
        post.summary || post.content.replace(/<[^>]+>/g, "").substring(0, 120),
      url: `${window.location.origin}/bai-viet/${post.slug}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback nếu trình duyệt không hỗ trợ Web Share API
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          post.title
        )}&url=${encodeURIComponent(shareData.url)}`;
        window.open(url, "_blank");
      }
    } catch (err) {
      console.error("Lỗi khi chia sẻ:", err);
    }
  };
  const handleCopyLink = (postSlug: string) => {
    const postUrl = `${window.location.origin}/bai-viet/${postSlug}`;
    navigator.clipboard
      .writeText(postUrl)
      .then(() => alert("Đã sao chép liên kết!"))
      .catch((err) => console.error("Lỗi khi sao chép:", err));
  };

  return (
    <div className="max-w-7xl h-full mx-auto px-4">
      <div className="h-full py-8 px-4 bg-[#FFF8F2]">
        <h1 className="text-3xl font-bold mb-8">Blog</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Danh mục topic bên trái */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="sticky top-8">
              <h2 className="text-xl font-semibold mb-4">Danh mục</h2>
              <nav className="space-y-2">
                <button
                  onClick={handleResetTopic}
                  className={`w-full text-left px-4 py-2 rounded-lg ${
                    !currentTopic
                      ? "bg-gray-700 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  Tất cả bài viết
                </button>
                {topics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => handleTopicClick(topic)}
                    className={`w-full text-left px-4 py-2 rounded-lg ${
                      currentTopic?.id === topic.id
                        ? "bg-gray-700 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {topic.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Nội dung chính */}
          <div className="flex-1 ">
            {currentTopic && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">{currentTopic.name}</h2>
                <p className="text-gray-600">{currentTopic.description}</p>
                <div className="border-b my-4" />
              </div>
            )}

            {loading ? (
              <div className="text-gray-400">Đang tải dữ liệu...</div>
            ) : posts.length === 0 ? (
              <div className="text-gray-500">Chưa có bài viết nào!</div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="rounded-2xl shadow-lg p-5 bg-white hover:shadow-xl transition group relative"
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
                      <span>
                        {new Date(post.created_at).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <p className="text-gray-500 line-clamp-3 mb-4">
                      {post.summary ||
                        post.content.replace(/<[^>]+>/g, "").substring(0, 120) +
                          "..."}
                    </p>
                    <Link
                      href={`/bai-viet/${post.slug}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Đọc tiếp →
                    </Link>
                    <div className="absolute right-0 bottom-2 flex space-x-1 rounded-lg py-3 px-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <FacebookShareButton
                        url={`${window.location.origin}/bai-viet/${post.slug}`}
                        title={post.title} // Thay thế `quote` bằng `title`
                        hashtag="#blog" // Tuỳ chọn thêm hashtag
                      >
                        <FacebookIcon size={32} round />
                      </FacebookShareButton>

                      <TwitterShareButton
                        url={`${window.location.origin}/bai-viet/${post.slug}`}
                        title={post.title}
                      >
                        <TwitterIcon size={32} round />
                      </TwitterShareButton>

                      <LinkedinShareButton
                        url={`${window.location.origin}/bai-viet/${post.slug}`}
                        title={post.title}
                        summary={post.summary}
                      >
                        <LinkedinIcon size={32} round />
                      </LinkedinShareButton>
                      <button
                        onClick={() => handleShare(post)}
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                        aria-label="Chia sẻ"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleCopyLink(post.slug)}
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                        aria-label="Sao chép liên kết"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Nội dung của bạn */}
      </div>
    </div>
  );
}
