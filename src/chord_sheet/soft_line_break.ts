class SoftLineBreak {

  content: string;

  constructor(content: string = ' ') {
    this.content = content;
  }

  clone() {
    return new SoftLineBreak();
  }
}

export default SoftLineBreak;