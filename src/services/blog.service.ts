import { httpClient } from "@/lib/client";

export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  image: string | null;
  image_alt: string | null;
  author: string;
  published_at: string | null;
  updated_at: string | null;
  status?: string;
  created_at?: string | null;
};

export async function getBlogList(): Promise<BlogPost[]> {
  try {
    const response = await httpClient({
      route: "/blog",
    });
    if (!response?.success || !Array.isArray(response?.data)) return [];
    return response.data;
  } catch (error) {
    console.error("Failed to fetch blog list:", error);
    return [];
  }
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const response = await httpClient({
      route: `/blog/${encodeURIComponent(slug)}`,
    });
    if (!response?.success || !response?.data) return null;
    return response.data;
  } catch (error) {
    console.error("Failed to fetch blog post:", error);
    return null;
  }
}
