import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article' | 'book' | 'profile';
    price?: {
        amount: number;
        currency: string;
    };
}

const SEO = ({
    title,
    description,
    image,
    url,
    type = 'website',
    price
}: SEOProps) => {
    const siteName = 'Storiofy';
    const defaultTitle = 'Storiofy - Personalized Storybooks for Kids';
    const defaultDescription = 'Create magical personalized storybooks where your child is the hero. The perfect gift for birthdays, holidays, and special moments.';
    const defaultImage = 'https://storiofy.com/logo.png'; // Update with actual production URL
    const siteUrl = 'https://storiofy.com';

    const metaTitle = title ? `${title} | ${siteName}` : defaultTitle;
    const metaDescription = description || defaultDescription;
    const metaImage = image || defaultImage;
    const metaUrl = url || siteUrl;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{metaTitle}</title>
            <meta name="description" content={metaDescription} />
            <link rel="canonical" href={metaUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:title" content={metaTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={metaImage} />
            <meta property="og:url" content={metaUrl} />

            {/* Product Specific OG Tags */}
            {price && (
                <>
                    <meta property="product:price:amount" content={price.amount.toString()} />
                    <meta property="product:price:currency" content={price.currency} />
                </>
            )}

            {/* Twitter Cards */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@storiofy" />
            <meta name="twitter:title" content={metaTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={metaImage} />

            {/* JSON-LD Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": type === 'book' ? 'Product' : 'WebSite',
                    "name": title || siteName,
                    "description": metaDescription,
                    "url": metaUrl,
                    "image": metaImage,
                    ...(price && {
                        "offers": {
                            "@type": "Offer",
                            "price": price.amount,
                            "priceCurrency": price.currency,
                            "availability": "https://schema.org/InStock"
                        }
                    }),
                    ...(type === 'website' && {
                        "potentialAction": {
                            "@type": "SearchAction",
                            "target": `${siteUrl}/books?search={search_term_string}`,
                            "query-input": "required name=search_term_string"
                        }
                    })
                })}
            </script>
        </Helmet>
    );
};

export default SEO;
