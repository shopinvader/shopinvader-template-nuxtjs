/* eslint-disable @typescript-eslint/ban-types */
import { ErpFetch } from '@shopinvader/fetch'

export class ErpFetchObservable extends ErpFetch {
  errorsCallback: Function[] = []
  requestCallback: Function[] = []
  responseCallback: Function[] = []
  time: Date = new Date()
  constructor(url: string, key: string, fetchAPI: Function) {
    const f = async (...args: any[]) => {
      let res = null
      try {
        for (const callback of this.requestCallback) {
          args = await callback(...args)
        }
        res = await fetchAPI(...args)
        if (!res?.ok) {
          throw new Error(res)
        }
      } catch (e: any) {
        for (const callback of this.errorsCallback) {
          await callback(res, ...args)
        }
        throw e
      } finally {
        for (const callback of this.responseCallback) {
          res = await callback(res)
        }
      }
      return res
    }
    super(url, key, f)
  }
  public onResponse(callback: Function) {
    this.responseCallback.push(callback)
  }
  public onRequest(callback: Function) {
    this.requestCallback.push(callback)
  }
  public onError(callback: Function) {
    this.errorsCallback.push(callback)
  }
}
