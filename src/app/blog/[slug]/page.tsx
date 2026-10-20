import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_URL, SITE_NAME, SITE_LOGO_PATH } from "@/lib/site-config";
import { getBlogBySlug } from "@/services/blog.service";
import type { BlogPost } from "@/services/blog.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faUser, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const baseUrl = SITE_URL.replace(/\/$/, "");

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) return { title: "Artikel tidak ditemukan" };

  const title = post.title;
  const description = post.excerpt;
  const url = `${baseUrl}/blog/${post.slug}`;
  const imageUrl = post.image?.startsWith("http")
    ? post.image
    : `${baseUrl}${post.image || ""}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "article",
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at ?? undefined,
      authors: [post.author],
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 420,
          alt: post.image_alt || post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

function ArticleJsonLd({ post }: { post: BlogPost }) {
  const imageUrl = post.image?.startsWith("http")
    ? post.image
    : `${baseUrl}${post.image || ""}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: imageUrl,
    url: `${baseUrl}/blog/${post.slug}`,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}${SITE_LOGO_PATH}`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${post.slug}`,
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) notFound();

  const imageSrc = post.image || "/images/logo.png";
  const imageAlt = post.image_alt || post.title;
  const content = (post.content || "").trim();

  return (
    <>
      <ArticleJsonLd post={post} />
      <article className="space-y-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-primary font-medium text-sm hover:underline"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="h-3 w-3" />
          Kembali ke Blog
        </Link>

        <header>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <FontAwesomeIcon icon={faUser} className="h-4 w-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <FontAwesomeIcon icon={faCalendar} className="h-4 w-4" />
              {post.published_at
                ? new Date(post.published_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "—"}
            </span>
          </div>
        </header>

        <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 1024px"
            priority
          />
        </div>

        {content ? (
          <div
            className="prose prose-gray max-w-none prose-headings:font-semibold prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3 prose-p:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <p className="text-gray-500">Tidak ada konten.</p>
        )}
      </article>
    </>
  );
}
