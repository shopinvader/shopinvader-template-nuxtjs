import { Card } from '../Card'
import { Component } from '../Component'
export class Cards extends Component {
  title: string | null = null
  cards: Card[] = []
  constructor(data: any) {
    super(data)
    this.title = data?.title || null
    this.cards = data?.cards?.map((card: any) => new Card(card)) || []
  }
}
