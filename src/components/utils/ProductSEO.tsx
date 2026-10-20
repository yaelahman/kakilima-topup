'use client';

import Script from 'next/script';
import { SITE_NAME, SITE_URL } from '@/lib/site-config';

interface ProductSEOProps {
    product: {
        id?: string;
        name?: string;
        title?: string;
        description?: string;
        price?: number;
        cost?: number;
        image?: string;
        thumbnail?: string;
        category?: string;
        brand?: string;
        availability?: string;
        condition?: string;
        sku?: string;
    };
    slug: string;
}

export default function ProductSEO({ product, slug }: ProductSEOProps) {
    const baseUrl = SITE_URL.replace(/\/$/, '');
    const productName = product.name || product.title || "Game Product";
    const productDescription = product.description || `Top up ${productName} dengan harga terbaik dan proses cepat di ${SITE_NAME}`;
    const productPrice = product.price || product.cost || 0;
    const productImage = product.image || product.thumbnail || "/images/logo.png";
    const productUrl = `${baseUrl}/order/${slug}`;
    const imageUrl = productImage.startsWith('http') ? productImage : `${baseUrl}${productImage}`;

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": productName,
        "description": productDescription,
        "image": imageUrl,
        "url": productUrl,
        "brand": {
            "@type": "Brand",
            "name": SITE_NAME
        },
        "category": product.category || "Game Top Up",
        "offers": {
            "@type": "Offer",
            "price": productPrice,
            "priceCurrency": "IDR",
            "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            "availability": "https://schema.org/InStock",
            "seller": {
                "@type": "Organization",
                "name": SITE_NAME,
                "url": SITE_URL
            },
            "areaServed": {
                "@type": "Country",
                "name": "Indonesia"
            }
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "1500",
            "bestRating": "5",
            "worstRating": "1"
        },
        "review": [
            {
                "@type": "Review",
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": "5",
                    "bestRating": "5"
                },
                "author": {
                    "@type": "Person",
                    "name": "Gamer Indonesia"
                },
                "reviewBody": "Layanan top up game yang sangat cepat dan terpercaya. Harga murah dan proses aman!"
            }
        ],
        "additionalProperty": [
            {
                "@type": "PropertyValue",
                "name": "Game Type",
                "value": "Mobile Game"
            },
            {
                "@type": "PropertyValue",
                "name": "Delivery Time",
                "value": "Instan"
            },
            {
                "@type": "PropertyValue",
                "name": "Service Hours",
                "value": "24 Jam"
            }
        ]
    };

    const organizationStructuredData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": SITE_NAME,
        "url": SITE_URL,
        "logo": `${baseUrl}/images/logo.png`,
        "description": `${SITE_NAME} adalah platform top up game terpercaya No.1 di Indonesia dengan layanan 24 jam, harga murah, dan proses cepat.`,
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "ID",
            "addressLocality": "Indonesia"
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "availableLanguage": ["Indonesian", "English"],
            "hoursAvailable": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                    "Monday",
                    "Tuesday", 
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday"
                ],
                "opens": "00:00",
                "closes": "23:59"
            }
        },
        "sameAs": [
            "https://www.facebook.com/wxstore",
            "https://www.instagram.com/wxstore",
            "https://twitter.com/wxstore"
        ]
    };

    return (
        <>
            <Script
                id="product-structured-data"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(structuredData)
                }}
            />
            <Script
                id="organization-structured-data"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(organizationStructuredData)
                }}
            />
        </>
    );
} 