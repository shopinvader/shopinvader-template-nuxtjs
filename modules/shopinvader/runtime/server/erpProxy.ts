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
    const debugMode = erpProxyConfig.debug || false
    const proxiedUrl: string = erpProxyConfig.url + event.node.req.url?.replace('/shopinvader', '')
    const reqHeaders = getHeaders(event)
    const headers: HeadersInit = {
      'Content-Type': reqHeaders?.['content-type'] || 'application/json'
    }
    if (erpProxyConfig?.auth) {
      headers['Authorization'] = erpProxyConfig.auth
    }
    if (debugMode) {
      console.log('[erpProxy] request:', proxiedUrl)
    }
    return await proxyRequest(event, proxiedUrl, {
      headers,
      fetchOptions: {
        redirect: 'manual'
      },
      onResponse: (event, response) => {
        if (debugMode) {
          console.log(
            '[erpProxy] response:',
            event.node.req.url,
            response.status,
            response.statusText
          )
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
