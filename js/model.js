class Model{
  constructor({converter}){
    this.lines = [{tagName: '', innerHtml: '', nextLine: null, parentLine: null, elem: null}];
    this.firstLine = this.lines[0];
    this.converter = converter;

    this.bindReplaceElem = null;
  }

  set({line, textContent}){
    let targetLine = this.get(line);

    ({tagName: targetLine.tagName, innerHtml: targetLine.innerHtml} = this.converter(textContent));
    
    const parentLine = targetLine.parentLine || targetLine;

    if(targetLine.tagName !== 'P' && targetLine.parentLine !== null){  // targetLine이 이미 p태그가 아닐 경우 중복 실행방지
      targetLine.parentLine = null
      this.inputElemByLine(targetLine)
    }

    this.inputElemByLine(parentLine);
  }

  inputElemByLine(line) {
    const elemInfo = this.collectElemInfo(line);
    const oldElem = line.elem;
    const newElem = this.makeElem(elemInfo);
    this.bindReplaceElem(newElem, oldElem);
    line.elem = newElem;
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
    let elem = document.createElement(tagName);
    elem.innerHTML = innerHtml;
    return elem
  }

  addNewLine(line){
    let aboveLine = this.get(line);
    let parentLine = aboveLine.parentLine || aboveLine;

    let newLine = {parentLine: parentLine};

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