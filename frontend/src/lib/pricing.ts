// Single source of truth for order pricing so the cart and checkout always agree.

export type DeliveryType = 'pickup' | 'delivery';

export const FREE_DELIVERY_THRESHOLD = 500;
export const HOME_DELIVERY_FEE = 40;

// Coupon codes the store already advertises (navbar banner, account page)
export const COUPONS: Record<string, { percent: number; label: string }> = {
  STUDENT10: { percent: 10, label: 'Student discount' },
  KMRFREE: { percent: 5, label: 'Kamareddy local discount' },
};

export const normalizeCoupon = (code: string) => code.trim().toUpperCase();

export const findCoupon = (code: string | null | undefined) =>
  code ? COUPONS[normalizeCoupon(code)] ?? null : null;

export const deliveryFeeFor = (deliveryType: DeliveryType, subtotal: number) =>
  deliveryType === 'delivery' && subtotal < FREE_DELIVERY_THRESHOLD ? HOME_DELIVERY_FEE : 0;

export interface OrderTotals {
  subtotal: number;
  discount: number;
  discountPercent: number;
  deliveryFee: number;
  total: number;
}

export const computeTotals = (
  subtotal: number,
  couponCode: string | null | undefined,
  deliveryType: DeliveryType = 'pickup'
): OrderTotals => {
  const coupon = findCoupon(couponCode);
  const discount = coupon ? Math.round((subtotal * coupon.percent) / 100) : 0;
  const deliveryFee = deliveryFeeFor(deliveryType, subtotal);
  return {
    subtotal,
    discount,
    discountPercent: coupon?.percent ?? 0,
    deliveryFee,
    total: Math.max(0, subtotal - discount + deliveryFee),
  };
};
