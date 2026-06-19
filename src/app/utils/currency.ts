// Centralized currency formatting for WearWhere.
//
// Product/price data across the app is authored in USD (small integers like 189).
// The platform is Vietnam-facing, so every price MUST render in Vietnamese đồng (VND).
// We convert at display time with a fixed rate and format with the Vietnamese locale.
//
// Rate note: the localized price ranges in mockData (e.g. "$50" -> "1.250k") imply
// 1 USD = 25.000₫, so we use the same rate here for consistency.
export const USD_TO_VND = 25000;

/**
 * Format a USD-denominated amount as a Vietnamese đồng string, e.g. 189 -> "4.725.000₫".
 * Accepts already-summed/decimal amounts (totals, taxes) — they are converted and rounded.
 */
export function formatVnd(usdAmount: number): string {
  const vnd = Math.round(usdAmount * USD_TO_VND);
  return vnd.toLocaleString('vi-VN') + '₫';
}

/**
 * Format an amount that is ALREADY in VND (no conversion), e.g. 1250000 -> "1.250.000₫".
 * Use this for figures authored directly in đồng.
 */
export function formatVndRaw(vndAmount: number): string {
  return Math.round(vndAmount).toLocaleString('vi-VN') + '₫';
}
