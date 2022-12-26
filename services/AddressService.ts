
import { ErpFetch } from "@shopinvader/fetch"
import {AddressResult, Address } from './../models/Address'

export class AddressService {

  provider: ErpFetch | null = null
  constructor(provider:ErpFetch) {
    this.provider = provider

  }

  async getAll(): Promise<AddressResult | null>  {
    if(this.provider == null) {
      return null
    }
     
    const result = await this.provider?.get("addresses", [], null)
     return {
      size: result?.size || 0,
      data: result?.data?.map( (item:any) => new Address(item))
     } as AddressResult
  }

  /**
   * updateItem : update a cart line
   * @param {*} Id address Id
   * @param {*} options Options
   * @returns Promise
   */

  async update(id: number, data: any ) : Promise<AddressResult | null> {
     
    return await this.provider?.post("addresses/" + id, { data})
    .then((data) => {
      return {
        size: data?.size || 0,
        data: data?.data?.map( (item:any) => new Address(item))
       } as AddressResult
    }) 
  }
}