// function converter(text){
//   const elemInfo = makeElemInfo(text);
//   return makeElem(elemInfo);
// }

// function makeElemInfo(text){
//   const innerHtml = makeInnerHtml(text);

//   if(isHeader(text)) return {tagName: 'h1', innerHtml: innerHtml.slice(2)};

//   return {tagName: 'p', innerHtml: innerHtml}; // 띄어쓰기 부자연스러움
// }

// function makeInnerHtml(text){
//   return text.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
// }

// function isHeader(text){
//   return /^# /.test(text);
// }

// function makeElem({tagName, innerHtml}){
//   const node = document.createElement(tagName);
//   node.innerHTML = innerHtml;

//   return node;
// }

function converter(text){
  if(isHeader(text)) return {tagName: 'H1', innerHtml: text.slice(2)};

  return {tagName: 'P', innerHtml: text};
}

function isHeader(text){
  return /^# /.test(text);
}

export {converter}