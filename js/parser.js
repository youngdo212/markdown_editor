/*
param {Array} tokens
returns {string}
*/
function parser(tokens){
  let html = '';
  let parentTagName = '';
  
  tokens.forEach(token => {
    if(/^<h\d>/.test(token)){
      if(parentTagName){
        token = `</${parentTagName}>` + token;
        parentTagName = '';
      }
    }
    else if(/^<ul>/.test(token)){
      if(parentTagName){
        if(parentTagName === 'ul'){
          token = token.replace(/^<ul>/, '</li>');
        }
        else {
          token = `</${parentTagName}>` + token;
          parentTagName = 'ul';
        }
      }
      else {
        parentTagName = 'ul';
      }
    }
    else if(token === ''){
      if(parentTagName){
        token = `${parentTagName === 'ul' ? '</li>' : ''}</${parentTagName}>` + token;
        parentTagName = '';
      }
    }
    else{
      if(!parentTagName){
        parentTagName = 'p';
        token = '<p>' + token;
      }
    }

    html += token + "&#10";
  })
  
  return html;
}

export {parser};