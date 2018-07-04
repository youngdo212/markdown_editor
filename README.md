# use case

### 클라이언트

**좌측: markdown, 우측: markup**


**히스토리: 되돌리기 기능(command+z, command+shift+z)을 이용해 히스토리를 이동할 수 있다.**

* 히스토리 단위
  * Insert
    * 입력 후 1초가 지나면 하나의 히스토리 단위가 생성
  * delete
    * 하나의 문자씩 삭제되는 경우: 마지막 Delete입력 후 1초가 지나면 히스토리 단위 생성
    * 복수의 문자가 삭제되는 경우: 복수 문자를 하나의 히스토리 단위로 생성
* 히스토리의 개수 제한
  * 개수를 초과하면 가장 오래된 히스토리부터 제거한다

1. 단축키를 통해 히스토리를 이동한다
2. 이동할 때마다 편집기가 렌더링 된다
3. 히스토리 중간에서 새로 입력할 경우 이후의 히스토리는 전부 삭제된다


**버튼을 누르면 markdown이 markup으로 변환된다**

1. 버튼을 누른다
2. markdown의 textContent가 json 데이터로 변환된다
3. json 데이터는 해석기를 통해 마크업 문서가 된다
4. 해석된 마크업 문서는 markup의 innerHtml로 들어간다


**(확장)**

실시간 편집기로 확장하기

* contenteditable기능 직접 구현해야 할 듯



### 문법

**double carriage return rule**

**header**

**list(ol, ul)**

**bold/italic**

**blockquote**

**code block/syntax highlighting**

**link**

**images**

table(align)

emoji(추후에 추가)



### 파싱

마크업 자체가 계층구조를 가지니까 ast를 만들자



### 데이터 구조

```
{
    tagName:
    attributes: [{name: href, value: "www.naver.com"}, {}, ...]
    textContent:
    child:[]
}
```



### 희망사항

크로스 브라우징(polyfill)

테스트 코드

webpack



### 구조

설계 내용을 바탕으로 대락적인 구조 설계

```javascript
class Controller{
  constructor({button, markdown, markup, converter})
  showContent(){
    const text = this.markdown.getText();
    const html = this.converter.run(text);
    this.markup.setHtml(html);
  }
}
class Button{
  bindShowContent(handler)
}
class Markdown{
  getText()
}
class Markup{
  setHtml(html)
}
class Converter{
  constructor({tokenizer, lexer, parser}){
    this.parser = pipe(tokenizer, lexer, parser);
  }
  run(text){
    const html = this.parser(text);
    return html
  }
}
/* modules
index.js {Controller, Button, Converter}
view.js {Markdown, Markup}
tokenizer.js {tokenizer}
lexer.js {lexer}
parser.js {parser}
*/
```



### 파서 제작

데이터 구조

```
{
    tagName:
    attributes: [{name: href, value: "www.naver.com"}, {}, ...]
    textContent:
    child:[]
}
```

문법

1. **double carriage return rule**

2. **header**

   ```
   # h1      		// # h1\n

   ###### h6 		// ###### h6\n

   h1
   =         		// h1\n=\n (보류)

   h2
   -         		// h2\n-\n (보류)
   ```

3. **list(ol, ul)**

   ```
   * ul      		 // * ul\n\n
   - ul
   + ul

   * first
   * second   		 // * first\n* second\n\n

   0. ol     		 // 0. ol\n\n

   1. first
   2. second  		 // 1. first\n2. second\n\n
   ```

4. **bold/italic/tilde**(복잡해서 단순화)

   ```
   *italic*
   **bold**
   ***bold and italic***
   ~~tilde~~
   ```

5. **blockquote**

   ```
   >blockquote				// >blockquote\n\n
   > blockquote			// > blockquote\n\n

   > blockquote
   > blockquote			// 하나의 blockquote로 취급(보류)
   ```

6. **code block/syntax highlighting**(복잡해서 단순화)

   ```
   `highlight`

   ​```
   code
   block
   ​```							// ```\ncode\nblock\n```\n (보류)
   ```

7. **link**

   ```
   [link](uri)
   ```

   * `<a href="url">link</a>`

8. **images**

   ```
   ![name](url)
   ```

   * `<img src="url" alt="name">`

9. table(align)

10. emoji(추후에 추가)

11. horizontal line

    * `***`
    * `___`

구상: text와 줄구조가 완벽히 똑같은 html을 반환하는 파서

tokenizer: 토큰화

* 줄단위로 토큰을 나눈다


* \n기준으로 토큰화

* trim

* ```javascript
  "* first\n* second\n\n# title"
  ```

* ```javascript
  ["* first", "* second", "", "# title"]
  ```


lexer: 토큰의 정보(태그)담는다

* 각 토큰의 특수기호를 태그로 대체한다->정규표현식 사용


* cheatsheet: 위 문법 참고


* 한 줄안에서 중첩태그가 발생하는 경우
  * bold/italic/tilde/highlight
  * link/image

Parser: 각 토큰에 문법 정보를 담는다

* p태그
* 열림 닫힘태그: list, codeblock
* ul과 ol을 확인한다

설계

```javascript
/*
param {string} text
returns {Array}
*/
tokenizer(text){}

/*
param {Array} tokens
returns {Array}
*/
lexer(tokens){
    return tokens.map(token => {
        return insertTag(token)
    })
}
insertTag(token){
    // is header, ol, ul, blockquote
    token = insertHeaderTag(token);
    token = insertListTag(token);
    token = insertBlockquoteTag(token);

    // has bold, italic, tilde, highlight, link, image
    token = insertBoldTag(token);
    token = insertItalicTag(token);
    token = insertStrikethroughTag(token);
    token = insertHighlightTag(token);
    token = insertLinkTag(token);
    token = insertImageTag(token);
    
    return token;
}

/*
param {Array} tokens
returns {string}
*/
parser(tokens){
    let html = '';
    let parentTag = '';
    
    tokens.forEach(token => {
        const tokenInfo = getTokenInfo(token);
        if(!parentTag) parentTag = tokenInfo.parent;
        else{
            if(parentTag !== tokenInfo.parent) token = `</${parentTag}>` + token
        }
        
        html += token;
    })
    
    return html;
}
/*
returns {Object}
*/
getTokenInfo(token)

getParentTag(token)

```

7/4 핵심기능만 간추리기로 함

* 헤더(h1)
* 리스트(ul)
* bold
* P

설계

* tokenizer
  * 줄대로 토큰화
  * trim
* lexer
  * 특수기호 태그로 변환
    * 헤더: 마침기호까지
    * 리스트: 시작기호만
    * bold
    * 일반 텍스트: 태그 변환 x
* parser
  * 문법구조 형성
  * 헤더
    * if(parent): parent 태그 닫힘, parent 초기화
    * if(!parent): 그대로
  * ul
    * if(parent !== ul): parent 태그 닫힘, parent 초기화
    * if(parent === ul): ul태그 삭제, list 닫힘
    * if(!parent): parent 설정(ul) > 그대로
  * 일반 텍스트(bold 포함)
    * if(parent): 그대로
    * if(!parent): parent 설정(p) > p태그 앞에 붙임
  * 공백
    * if(parent): parent태그 닫힘, parent 초기화
    * if(!parent): 그대로