class Model{
  constructor({converter}){
    this.lines = [{tagName: '', innerHtml: '', nextLine: null, parentLine: null, elem: null}];
    this.firstLine = this.lines[0];
    this.converter = converter;

    this.bindReplaceElem = null;
    this.bindInsertAdjacentElem = null;
  }

  set({line, textContent}){
    let targetLine = this.get(line);

    ({tagName: targetLine.tagName, innerHtml: targetLine.innerHtml} = this.converter(textContent));

    if(targetLine.tagName === 'P') this.inputElemByLine(targetLine.parentLine || targetLine);

    if(targetLine.tagName !== 'P') {
      let nextLine = targetLine.nextLine;
      
      let parentLine = targetLine.parentLine || targetLine;

      if(nextLine && nextLine.parentLine === parentLine){
        this.modifyParentLine(nextLine, parentLine);
        this.inputElemByLine(nextLine, parentLine);
      }

      this.inputElemByLine(targetLine, targetLine.parentLine);
      
      targetLine.parentLine = null;

      if(parentLine) this.inputElemByLine(parentLine);
    }
  }

  modifyParentLine(newParentLine, oldParentLine){
    newParentLine.parentLine = null;

    let line = newParentLine; // 이상하다. while문을 위한 코드
    
    while(line = line.nextLine){

      if(line.parentLine !== oldParentLine) return;

      line.parentLine = newParentLine;
    }
  }

  inputElemByLine(targetLine, previousLine = null) {
    const elemInfo = this.collectElemInfo(targetLine);
    const newElem = this.makeElem(elemInfo);

    if(previousLine) this.bindInsertAdjacentElem(newElem, previousLine.elem);

    else this.bindReplaceElem(newElem, targetLine.elem);

    targetLine.elem = newElem;
  }

  collectElemInfo(line){
    let parentLine = line;
    let tagName = parentLine.tagName;
    let innerHtml = parentLine.innerHtml;

    while(line = line.nextLine){
      if(line.parentLine !== parentLine) break;
      innerHtml += line.innerHtml;
    }

    return {tagName: tagName, innerHtml: innerHtml};
  }

  get(line){
    let targetLine = this.firstLine;

    while(--line){
      targetLine = targetLine.nextLine;
    }

    return targetLine;
  }

  makeElem({tagName, innerHtml}){
    // 공백 문자열일 때
    if(!tagName) return null;

    let elem = document.createElement(tagName);
    elem.innerHTML = innerHtml;
    return elem
  }

  addNewLine(line){
    let aboveLine = this.get(line);
    let parentLine = aboveLine.parentLine || aboveLine;

    let newLine = {tagName: '', innerHtml: '', nextLine: null, parentLine: parentLine, elem: null};

    // 위의 라인이 헤더일 때
    if(/^H\d$/.test(aboveLine.tagName)) newLine.parentLine = null; // refactor
    // 위의 라인이 공백일 때
    else if(!aboveLine.tagName) newLine.parentLine = null;

    newLine.nextLine = aboveLine.nextLine;
    aboveLine.nextLine = newLine;

    this.lines.push(newLine);
  }

}

export {Model};