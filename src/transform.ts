import {
    IContent,
    IBlock,
    IHeadBlock,
    IReferBlock,
    ICodeBlock,
    IListBlock,
    IParagraph,

    IText,
    TextChild,
    ICodeText,
    IBoldText,
    IItalicText,
    ILink,
    IImage,
    INormalText,
    IReferText,
    IListItem,
    AST_TYPE
} from './ast';
import baseStyle from './style/base.scss';
import mainStyle from './style/main.scss';
import prismStyle from 'prismjs/themes/prism-solarizedlight.css';
import Prism from 'prismjs';

function ContentTransform(ast: IContent) {
    return `
        <style>${mainStyle + baseStyle + prismStyle}</style>
        <div class="my-markdown_content">
            ${ast.children.map(BlockTransform).join('')}
        </div>
        
    `;
}

function BlockTransform(ast: IBlock) {
    switch(ast.type) {
        case AST_TYPE.HEAD_BLOCK: return HeadBlockTransform(ast);
        case AST_TYPE.REFER_BLOCK: return ReferBlockTransform(ast);
        case AST_TYPE.CODE_BLOCK: return CodeBlockTransform(ast);
        case AST_TYPE.LIST_BLOCK: return ListBlockTransform(ast);
        case AST_TYPE.PARAGRAPH: return ParagraphTransform(ast);
        default: return ParagraphTransform(ast);
    }
}

function HeadBlockTransform(ast: IHeadBlock) {
    return `
        <h${ast.level} class="my-markdown_block my-markdown_block__head">
            ${TextTransform(ast.children)}
        </h${ast.level}>
    `
}

function ReferBlockTransform(ast: IReferBlock) {
    return `
        <blockquote class="my-markdown_block my-markdown_block__refer">
            ${ReferTextTransform(ast.children)}
        </blockquote>
    `;
}

function CodeBlockTransform(ast: ICodeBlock) {
    const code = Prism.highlight(ast.text, Prism.languages[ast.language], ast.language);
    return `
        <pre class="my-markdown_block my-markdown_block__${ast.language}-code language-${ast.language}"><code class="language-${ast.language}">${code}</code></pre>
    `;
}

function ListBlockTransform(ast: IListBlock) {
    const tag = ast.ordered? 'ol' : 'ul';
    const listSuffix = ast.ordered? 'ordered-list' : 'unordered-list'
    return `
        <${tag} class="my-markdown_block my-markdown_block__list___${listSuffix}">
            ${ast.children.map(ListItemTransform).join('')}
        </${tag}>
    `
}

function ListItemTransform(ast: IListItem) {
    return `<li>${TextTransform(ast.children)}</li>`;
}

function ParagraphTransform(ast: IParagraph) {
    return `
        <p class="my-markdown_block my-markdown_block__paragraph">
            ${TextTransform(ast.children)}
        </p>
    `;
}

function BasicTextTransform(ast: TextChild) {
    switch(ast.type) {
        case AST_TYPE.CODE_TEXT: return CodeTextTransform(ast);
        case AST_TYPE.BOLD_TEXT: return BoldTextTransform(ast);
        case AST_TYPE.ITALIC_TEXT: return ItalicTextTransform(ast);
        case AST_TYPE.LINK: return LinkTransform(ast);
        case AST_TYPE.IMAGE: return ImageTransform(ast);
        case AST_TYPE.NORMAL_TEXT: return NormalTextTransform(ast);
        default: return NormalTextTransform(ast);
    }
}

function ReferTextTransform(ast: IReferText) {
    return ast.children.map(text => {
        if(text.type === AST_TYPE.REFER_NEWLINE) {
            return `<br/>`
        }
        return BasicTextTransform(text);
    }).join('');
}

function TextTransform(ast: IText) {
    return ast.children.map(BasicTextTransform).join('');
}

function CodeTextTransform(ast: ICodeText) {
    return `<code>${ast.text}</code>`;
}

function BoldTextTransform(ast: IBoldText) {
    return `<strong>${ast.text}</strong>`;
}

function ItalicTextTransform(ast: IItalicText) {
    return `<em>${ast.text}</em>`
}

function LinkTransform(ast: ILink) {
    return `<a href="${ast.url}" target="__blank">${ast.text}</a>`
}

function ImageTransform(ast: IImage) {
    return `<img src="${ast.url}" alt="${ast.alt}"/>`;
}

function NormalTextTransform(ast: INormalText) {
    return ast.text;
}

export default function CodeTransform(ast: IContent) {
    let html = '';

    html += ContentTransform(ast);

    return html;
}