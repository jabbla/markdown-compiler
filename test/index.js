const compileMarkdown = window.compileMarkdown;

const editor = document.querySelector('#editor');
const previewer = document.querySelector('#previewer');

let source = `# 一级标题
## 二级标题
### 三级标题
\`\`\`js
const content = 'markdown compiler';
console.log(\`hello world\${content}\`);
\`\`\`
#### 四级标题
1. 有序列表项1[文字链接](http://blog.zxrcool.com)
2. 有序列表项2**加粗文字**
- 无序列表项1*斜体文字*
- 无序列表项2
> 一段引用\`\`内联代码\`\`
一段引用
![图片描述](http://blog.zxrcool.com/images/avatar.jpg)`;
let current = 0;
let sourceForShow = '';

function input() {
    setTimeout(() => {
        if(current >= source.length) {
            return;
        }
        sourceForShow += source[current];
        editor.innerText = sourceForShow;
        showSourceHtml(sourceForShow);
        current++;
        input();
    }, 100);
}

input();

function showSourceHtml(source) {
    let html = compileMarkdown(source)
    previewer.innerHTML = html;
}

editor.addEventListener('input', (e) => {
    showSourceHtml(e.target.innerText);
});
console.log(editor);