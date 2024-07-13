import { createError, proxyRequest } from 'h3' // Nitro http framework

// Proxy request to avoid CORS issues
export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()?.shopinvader || {}
  const erpProxyConfig = runtimeConfig?.erp?.proxy || null
  if (!erpProxyConfig) {
    return createError({
      statusCode: 500,
      statusMessage: 'No proxy config found'
    })
  }

  try {
    const logLevel = erpProxyConfig.logLevel || 10
    const proxiedUrl: string = erpProxyConfig.url + event.node.req.url?.replace('/shopinvader', '')
    const reqHeaders = getHeaders(event)
    const headers: HeadersInit = {
      'Content-Type': reqHeaders?.['content-type'] || 'application/json'
    }
    if (erpProxyConfig?.auth) {
      headers['Authorization'] = erpProxyConfig.auth
    }
    if (logLevel > 0) {
      console.log(`[ShopInvader] PROXY - ${proxiedUrl} request`)
    }
    return await proxyRequest(event, proxiedUrl, {
      headers,
      fetchOptions: {
        redirect: 'manual'
      },
      onResponse: async (event, response) => {
        if (logLevel > 0) {
          const color = response.status >= 400 ? '\x1b[31m' : '\x1b[32m'
          console.log(
            `[ShopInvader] PROXY - ${proxiedUrl} response: ${color}${response.status} ${response.statusText}\x1b[0m`
          )
          if (logLevel > 1) {
            // Need to clone the response to read the body, else it will be consumed
            const copyResponse = response.clone()
            const body = await copyResponse.text()
            console.log(
              `[ShopInvader] PROXY - ${proxiedUrl} response body:`,
              body || '\x1b[3mempty\x1b[0m'
            )
          }
        }
        return response
      }
    })
  } catch (error: any) {
    console.log('[ShopInvader] PROXY - \x1b[31merror\x1b[0m:', error)
    return createError({
      statusCode: error?.response?.status,
      statusMessage: error?.message,
      data: error?.data
    })
  }
})
