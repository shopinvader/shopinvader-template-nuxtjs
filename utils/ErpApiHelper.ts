/** Extract error messages from Odoo API error */
export function erpApiExtractErrorMessages(error: any): string[] {
  const messages: string[] = []
  if (error && error.detail) {
    if (Array.isArray(error.detail)) {
      error.detail.forEach((detail: any) => {
        messages.push(detail.msg)
      })
    } else {
      messages.push(error.detail)
    }
  }
  return messages
}

export function erpApiGetErrorMessagesAsStr(error: any): string {
  return erpApiExtractErrorMessages(error).join(', ')
}

export function erpApiGetErrorMessagesAsHtml(error: any): string {
  const messages = erpApiExtractErrorMessages(error)
  return messages.map((error) => error.replaceAll('\n', '<br />')).join('<br />')
}

export function erpApiGetErrorMessagesAsHtmlList(error: any): string {
  const messages = erpApiExtractErrorMessages(error)
  let result = ''
  // Check if any error have \n in it
  const haveNewLine = messages.some((error) => error.includes('\n'))
  if (messages.length > 1 || haveNewLine) {
    result += '<ul>'
  }
  messages.forEach((error) => {
    const lines = error.split('\n')
    // Remove last empty line
    if (lines[lines.length - 1] === '') {
      lines.pop()
    }
    if (lines.length > 1) {
      result += '<li>'
      result += lines.join('</li><li>')
      result += '</li>'
    } else {
      result += `<li>${error}</li>`
    }
  })
  if (messages.length > 1) {
    result += '</ul>'
  }
  return result
}
