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
    const logLevel = erpProxyConfig.logLevel || 0
    const proxiedUrl: string = erpProxyConfig.url + event.node.req.url?.replace('/shopinvader', '')
    const reqHeaders = getHeaders(event)
    const headers: HeadersInit = {
      'Content-Type': reqHeaders?.['content-type'] || 'application/json'
    }
    if (erpProxyConfig?.auth) {
      headers['Authorization'] = erpProxyConfig.auth
    }
    if (logLevel > 0) {
      console.log('[erpProxy] request:', proxiedUrl)
    }
    return await proxyRequest(event, proxiedUrl, {
      headers,
      fetchOptions: {
        redirect: 'manual'
      },
      onResponse: async (event, response) => {
        if (logLevel > 0) {
          console.log(
            '[erpProxy] response:',
            event.node.req.url,
            response.status,
            response.statusText
          )
          if (logLevel > 1) {
            const body = await response.text()
            console.log('[erpProxy] response body:', event.node.req.url, body)
          }
        }
        return response
      }
    })
  } catch (error: any) {
    return createError({
      statusCode: error?.response?.status,
      statusMessage: error?.message,
      data: error?.data
    })
  }
})
