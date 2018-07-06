class TextEditor{
  constructor(){
    this.$markdown = document.querySelector(".markdown");
    this.$currentLine = null;
    this.bindAddNewLine = null;
    this.bindShowContent = null;

    this.$markdown.addEventListener('click', ({target}) => {
      target = this.activeLine(target);
      this.setCurrentLine(target);
    })
    document.addEventListener('keydown', ({key}) => {
      if(!this.$currentLine) return;
      if(key === 'Enter'){
        this.appendLine();
        this.activeLine(this.$currentLine);
        this.bindAddNewLine();
        return;
      }
      this.type(key);
      this.bindShowContent(this.$currentLine.textContent);
    })
  }
  activeLine(target){
    Array.from(this.$markdown.children).forEach(line => {
      line.classList.remove('active');
    })
    if(target.className === 'markdown') target = this.$markdown.lastElementChild; // re: 위치에 따른 activeLine변화
    target.classList.add('active');
    
    return target;
  }
  type(key){
    if(key === 'Shift') return;
    if(key === 'Backspace'){
      if(!this.$currentLine.textContent){
        this.deleteLine(this.$currentLine);
        return
      }
      this.$currentLine.textContent = this.$currentLine.textContent.slice(0, this.$currentLine.textContent.length-1);
    }
    else this.$currentLine.textContent += key;
  }
  appendLine(){
    if(!this.$currentLine) return;
    const line = document.createElement('div');
    this.$currentLine.insertAdjacentElement("afterend", line);
    this.setCurrentLine(line);
  }
  setCurrentLine(target){
    this.$currentLine = target;
  }
  deleteLine(line){
    const nextCurrentLine = line.previousElementSibling;
    if(!nextCurrentLine) return;
    this.$markdown.removeChild(line);
    this.setCurrentLine(nextCurrentLine);
    this.activeLine(this.$currentLine);    
  }
}

export {TextEditor};