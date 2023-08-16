import { createError, readBody, getMethod } from 'h3';
import https from 'https';
export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()?.shopinvader || {}
  const config = runtimeConfig?.erp?.proxy || null
  if(!config) {
    return createError({
      statusCode: 500,
      statusMessage: 'No proxy config found',
    });
  }
  try {
    const method = getMethod(event)
    const url:string = event.node.req.url?.replace('/shopinvader', '') || '';
    const reqHeaders = getHeaders(event)

    const body = method !== 'GET' && method !== 'HEAD' ? await readBody(event) : null
    const agent = new https.Agent({
      rejectUnauthorized: false,
    })

    const headers:any = {
      'Content-Type': reqHeaders?.['content-type'] || 'application/json',
    }

    if(reqHeaders?.cookie) {
      headers['cookie'] = reqHeaders.cookie
    }
    if(config?.auth) {
      headers['Authorization'] = config.auth
    }

    const response = await $fetch.raw(`${config?.url}${url}`, {
      method,
      agent,
      body,
      headers
    })
    return response._data
  } catch (error:any) {
    return createError({
      statusCode: error?.response?.status,
      statusMessage: error?.message,
      data: error?.data,
    });
  }
})
