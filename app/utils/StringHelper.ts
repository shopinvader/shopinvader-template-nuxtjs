export function nl2br(text: string | null): string {
  if (!text) {
    return ''
  }
  return text.replace(/\n/g, '<br>')
}

export function formatCurrency(value: number | null): string {
  if (value == null) {
    return ''
  }
  const formatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  })
  return formatter.format(value)
}
