export function nl2br(text: string): string {
  return text.replace(/\n/g, '<br>')
}

export function formatCurrency(value: number): string {
  const formatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  })
  return formatter.format(value)
}
