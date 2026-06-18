const vndFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
})

export function formatVND(value: number | string): string {
  return vndFormatter.format(Number(value))
}
