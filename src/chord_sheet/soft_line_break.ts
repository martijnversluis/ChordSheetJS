class SoftLineBreak {
  content: string;

  constructor(content = ' ') {
    this.content = content;
  }

  clone() {
    return new SoftLineBreak();
  }
}

export default SoftLineBreak;
