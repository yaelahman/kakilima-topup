import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SITE_URL, SITE_NAME, SITE_LOGO_PATH } from "@/lib/site-config";
import { getBlogList } from "@/services/blog.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faUser, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const baseUrl = SITE_URL.replace(/\/$/, "");

export const metadata: Metadata = {
  openGraph: {
    title: `Blog | ${SITE_NAME}`,
    description: "Artikel dan tips seputar top up game, voucher game, dan panduan bermain.",
    url: `${baseUrl}/blog`,
    siteName: SITE_NAME,
    type: "website",
  },
  alternates: {
    canonical: `${baseUrl}/blog`,
  },
};

export default async function BlogPage() {
  const posts = await getBlogList();

  const blogListSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `Blog | ${SITE_NAME}`,
    description: "Artikel dan tips seputar top up game, voucher game, dan panduan bermain.",
    url: `${baseUrl}/blog`,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}${SITE_LOGO_PATH}`,
      },
    },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      url: `${baseUrl}/blog/${post.slug}`,
      datePublished: post.published_at,
      dateModified: post.updated_at,
      author: { "@type": "Person", name: post.author },
      image: post.image?.startsWith("http") ? post.image : `${baseUrl}${post.image || ""}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListSchema) }}
      />
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Blog</h1>
          <p className="text-gray-600 mt-1">
            Tips, panduan, dan artikel seputar top up game dan voucher digital.
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="text-gray-500 text-center py-12">Belum ada artikel.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <li key={post.id}>
                <article className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
                  <Link href={`/blog/${post.slug}`} className="block aspect-video relative bg-gray-100">
                    <Image
                      src={post.image || "/images/logo.png"}
                      alt={post.image_alt || post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </Link>
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                      <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faUser} className="h-3 w-3" />
                        {post.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faCalendar} className="h-3 w-3" />
                        {post.published_at
                          ? new Date(post.published_at).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "—"}
                      </span>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-2">
                      <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                        {post.title}
                      </Link>
                    </h2>
                    <p className="text-sm text-gray-600 line-clamp-3 flex-1">{post.excerpt}</p>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-primary font-medium text-sm mt-3 hover:underline"
                    >
                      Baca selengkapnya
                      <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3" />
                    </Link>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
