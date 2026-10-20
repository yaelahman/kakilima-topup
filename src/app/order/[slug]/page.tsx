import Order from "@/components/order";
import ProductSEO from "@/components/utils/ProductSEO";
import { getProduct } from "@/services/order.service";
// import { getOrder } from "@/lib/orders";

export default async function OrderPage({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { slug } = await params;
    const searchParamsData = await searchParams;
    const promo = typeof searchParamsData?.promo === 'string' ? searchParamsData.promo : undefined;
    const priceId = typeof searchParamsData?.price_id === 'string' ? searchParamsData.price_id : undefined;

    const data = await getProduct(slug);
    const product = data.product;
    const payments = data.group?.map((item: any) => ({
        group: item,
        payments: data.payment[item]
    }));
    const enableCheckerId = data.enableCheckerId;

    return (
        <>
            <ProductSEO product={product} slug={slug} />
            <Order
                product={product}
                payments={payments}
                enableCheckerId={enableCheckerId}
                initialPromoCode={promo}
                initialPriceId={priceId}
            />
        </>
    );
}
