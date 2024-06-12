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
        for (let callback of this.requestCallback) {
          args = await callback(...args)
        }
        res = await fetchAPI(...args)
        if (!res?.ok) {
          throw new Error(res)
        }
      } catch (e: any) {
        for (let callback of this.errorsCallback) {
          e = await callback(res, ...args)
        }
        if (e) {
          throw e
        }
      } finally {
        for (let callback of this.responseCallback) {
          res = await callback(res)
        }
        return res
      }
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
