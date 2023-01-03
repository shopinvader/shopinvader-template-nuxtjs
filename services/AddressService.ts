
import { ErpFetch } from "@shopinvader/fetch"
import {AddressResult, Address } from './../models/Address'
import { Settings } from "~~/models/Settings"
export class AddressService {

  provider: ErpFetch | null = null
  constructor(provider:ErpFetch, settings:Settings) {
    this.provider = provider

  }

  async getAll(per_page:number = 2, page:number = 1, scope:any=null): Promise<AddressResult | null>  {
    if(this.provider == null) {
      return null
    }
    const params =  {
      per_page,
      page,

     } as any

    const result = await this.provider?.get("addresses", params, null)
     return {
      size: result?.size || 0,
      data: result?.data?.map( (item:any) => new Address(item))
     } as AddressResult
  }

  /**
   * delete an address
   * @param Address address
   * @returns AddressResult
   */
  async delete(address:Address): Promise<AddressResult | null> {
    const data = await this.provider?.delete("addresses/" + address.id)
    if(data == null) {
      return {
        size: data?.size || 0,
        data: data?.data?.map( (item:any) => new Address(item))
       } as AddressResult
    }
    return null
  }

  /**
   * updateItem : update a cart line
   * @param {*} Id address Id
   * @param {*} options Options
   * @returns Promise
   */

  async update(address:Address) : Promise<AddressResult | null> {
    const data = address.getJSONData()

    return await this.provider?.post("addresses/" + address.id, data)
    .then((data) => {
      return {
        size: data?.size || 0,
        data: data?.data?.map( (item:any) => new Address(item))
       } as AddressResult
    })

  }

  async create( data: any ) : Promise<AddressResult | null> {
     console.log("data", data)
    return await this.provider?.post("addresses/" + "create", { data })
    .then((data) => {
      return {
        size: data?.size || 0,
        data: data?.data?.map( (item:any) => new Address(item))
       } as AddressResult
    })

  }
}
