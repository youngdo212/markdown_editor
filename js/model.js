class Model{
  constructor({converter}){
    this.lines = [{tagName: '', textContent: '', innerHtml: '', nextLine: null, parentLine: null, elem: null}];
    this.firstLine = this.lines[0];
    this.converter = converter;

    this.bindReplaceElem = null;
    this.bindInsertAdjacentElem = null;
  }

  modifyLine({lineNumber, key}){
    const targetLine = this._getLine(lineNumber);

    this._appendChar(targetLine, key);
    this._setTagInfo(targetLine);
    this._syncLine(targetLine);
  }

  _appendChar(line, key){
    line.textContent += key;
  }

  _setTagInfo(line){
    const {tagName, innerHtml} = this.converter(line.textContent);

    line.tagName = tagName;
    line.innerHtml = innerHtml;
  }

  _syncLine(line){
    if(line.tagName === 'P') this.inputElemByLine(line.parentLine || line);

    else if(line.tagName !== 'P') {
      let nextLine = line.nextLine;
      
      let parentLine = line.parentLine || line;

      if(nextLine && nextLine.parentLine === parentLine){
        this.modifyParentLine(nextLine, parentLine);
        this.inputElemByLine(nextLine, parentLine);
      }

      this.inputElemByLine(line, line.parentLine);
      
      line.parentLine = null;

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

  _getLine(lineNumber){
    let targetLine = this.firstLine;

    while(--lineNumber){
      targetLine = targetLine.nextLine;
    }

    return targetLine;
  }

  getText(lineNumber){
    let targetLine = this._getLine(lineNumber);
    let text = targetLine.textContent;

    return text;
  }

  makeElem({tagName, innerHtml}){
    // 공백 문자열일 때
    if(!tagName) return null;

    let elem = document.createElement(tagName);
    elem.innerHTML = innerHtml;
    return elem
  }

  addNewLine(line){
    let aboveLine = this._getLine(line);
    let parentLine = aboveLine.parentLine || aboveLine;

    let newLine = {tagName: '', textContent: '', innerHtml: '', nextLine: null, parentLine: parentLine, elem: null};

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