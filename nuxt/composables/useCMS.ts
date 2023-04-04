import { Header } from '~~/models/cms/Header'
import { Footer } from '~~/models/cms/Footer'
import { Page } from '~~/models/cms/Page'
import md from 'markdown-it'

export const useCMS = () => {
  const { findOne, find } = useStrapi()
  return {
    findOne: async (query: string, params?: any) => {
      return findOne(query + '?populate=deep', params)
    },
    find: async (query: string, params?: any) => {
      return find(query + '?populate=deep', params)
    },
    getHeader: async () => {
      const { data = { attributes: null } } = await findOne(
        'header?populate=deep'
      )
      return new Header(data)
    },
    getFooter: async () => {
      const { data = { attributes: null } } = await findOne(
        'footer?populate=deep'
      )
      return new Footer(data)
    },
    findPage: async (params: object) => {
      params = {
        ...params,
        populate: 'deep'
      }
      const { data = [] } = await find('pages', params)
      if (data?.length > 0) {
        return new Page(data[0])
      }
      return null
    }
  }
}

export const markdown = (body: string): string => {
  const renderer = md({})
  return renderer.render(body)
}
