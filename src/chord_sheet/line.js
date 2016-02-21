import Item from './item';

export default class Line {
  constructor() {
    this.items = [];
    this.currentItem = null;
  }

  addItem() {
    const item = new Item();
    this.items.push(item);
    this.currentItem = item;
    return item;
  }
}
