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
  constructor({button, markdown, markup, transpiler})
  showContent(){
    const text = this.markdown.getText();
    const html = this.transpiler.convert(text);
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
class Transpiler{
  constructor({parser, interpreter})
  convert(text){
    const ast = this.parser.run(text);
    const html = this.interpreter.run(ast);
    return html
  }
}
class Parser{
  run(text)
}
class Interpreter{
  run(ast)
}
```

