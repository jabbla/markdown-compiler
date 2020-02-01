import Parser from './parser';
import { TOKEN_TYPE, notNormalTextStart } from './token';
import { AstCreator, IBlock } from './ast';

/**
 * Content -> <block>*
 */
function Content(ctx: Parser) {
    const children = [] as IBlock[];
    let block = Block(ctx);
    while(block) {
        children.push(block);
        if(ctx.isComplete()) {
            break;
        }
        ctx.back();
        block = Block(ctx);
    }
    return AstCreator.content({ children });
}

/**
 * Block -> <head-block> | <refer-block> | <code-block> | <list-block> | <paragraph>
 */
function Block(ctx: Parser) {
    let res = HeadBlock(ctx) || ReferBlock(ctx) || CodeBlock(ctx) || ListBlock(ctx) || Paragraph(ctx);
    
    return res as IBlock;
}

/**
 * HeadBlock -> <newline><head-markup><white-space> Text <newline>
 */
function HeadBlock(ctx: Parser) {
    let originIndex = ctx.getIndex();
    let level: number;

    if(!ctx.match({ originIndex, tokenType: TOKEN_TYPE.NEWLINE })) {
        return;
    }

    let token = ctx.consume();

    if(token.tokenType === TOKEN_TYPE.HEADER_MARKUP) {
        level = token.lexeme.length;
    }else{
        ctx.setIndex(originIndex);
        return;
    }

    if(!ctx.match({ originIndex, tokenType: TOKEN_TYPE.WHITESPACE })) {
        return;
    }

    let children = Text(ctx);

    if(!children) {
        ctx.setIndex(originIndex);
        return;
    }

    if(!ctx.match({ originIndex, tokenType: TOKEN_TYPE.NEWLINE })) {
        return;
    }

    return AstCreator.headBlock({ level, children });
}

/**
 * ReferBlock -> <newline> <refer-signal> <white-sapce> <refer-text> <newline>
 */
function ReferBlock(ctx: Parser) {
    let originIndex = ctx.getIndex();

    if(!ctx.match({ originIndex, tokenType: TOKEN_TYPE.NEWLINE })) {
        return;
    }


    if(!ctx.match({ originIndex, tokenType: TOKEN_TYPE.REFER_MARKUP })) {
        return;
    }

    if(!ctx.match({ originIndex, tokenType: TOKEN_TYPE.WHITESPACE })) {
        return;
    }

    let children = ReferText(ctx);

    if(!children) {
        ctx.setIndex(originIndex);
        return;
    }

    if(!ctx.match({ originIndex, tokenType: TOKEN_TYPE.NEWLINE })) {
        return;
    }

    return AstCreator.referBlock({ children });
}

/**
 * CodeBlock -> <newline> <code-dot>{3} <language> <code-text> <code-dot>{3} <newline>
 */
function CodeBlock(ctx: Parser) {
    let originIndex = ctx.getIndex();

    if(!ctx.match({
        originIndex,
        tokenType: TOKEN_TYPE.NEWLINE,
    })) {
        return;
    }

    if(!ctx.match({
        originIndex,
        tokenType: TOKEN_TYPE.CODE_DOT,
        lexeme: '```'
    })) {
        return;
    }

    const language = ctx.matchUntil({
        originIndex,
        endToken: TOKEN_TYPE.NEWLINE,
        errorToken: null,
    });

    if(!language) {
        return;
    }

    const text = ctx.matchUntil({
        originIndex,
        endToken: [TOKEN_TYPE.NEWLINE, TOKEN_TYPE.CODE_DOT],
        errorToken: null
    });

    if(text === false) {
        return;
    }

    if(!ctx.match({
        originIndex,
        tokenType: TOKEN_TYPE.CODE_DOT,
        lexeme: '```'
    })) {
        return;
    }

    if(!ctx.match({ originIndex, tokenType: TOKEN_TYPE.NEWLINE })) {
        return;
    }

    return AstCreator.codeBlock({ language, text });
}

/**
 * ListBlock -> <newline> (<list-item> <newline>)* <list-item> <newline>
 */
function ListBlock(ctx: Parser) {
    let originIndex = ctx.getIndex();

    if(!ctx.match({
        originIndex,
        tokenType: TOKEN_TYPE.NEWLINE
    })) {
        return;
    }

    const ordered = ctx.lookAhead().tokenType === TOKEN_TYPE.LIST_NUMBER_INDEX;

    let item = ListItem(ctx, ordered);
    if(!item) {
        ctx.setIndex(originIndex)
        return;
    }
    const children = [];
    
    while(item) {
        children.push(item);
        // 消耗一个换行符
        ctx.consume();
        item = ListItem(ctx, ordered);
        if(!item) {
            // 抵消1个换行符
            ctx.back();
        }
    }

    if(!ctx.match({
        originIndex,
        tokenType: TOKEN_TYPE.NEWLINE
    })) {
        return;
    }

    return AstCreator.listBlock({
        ordered,
        children
    });
}

/**
 * ListItem -> <list-index> <whitespace> <Text>
 */
function ListItem(ctx: Parser, ordered: boolean) {
    let originIndex = ctx.getIndex();

    if(!ctx.match({
        originIndex,
        tokenType: ordered? TOKEN_TYPE.LIST_NUMBER_INDEX : TOKEN_TYPE.LIST_SYMBOL_INDEX
    })) {
        return;
    }

    if(!ctx.match({
        originIndex,
        tokenType: TOKEN_TYPE.WHITESPACE
    })) {
        return;
    }

    const children = Text(ctx);
    if(!children) {
        return;
    }

    return AstCreator.listItem({
        children
    });
}

/**
 * Paragraph -> <newline> Text <newline>
 */
function Paragraph(ctx: Parser) {
    let originIndex = ctx.getIndex();

    if(!ctx.match({ originIndex, tokenType: TOKEN_TYPE.NEWLINE })) {
        return;
    }

    let children = Text(ctx);
    if(!children) {
        ctx.setIndex(originIndex);
        return;
    }

    if(!ctx.match({ originIndex, tokenType: TOKEN_TYPE.NEWLINE })) {
        return;
    }

    return AstCreator.paragraph({ children });
}

/**
 * Text -> (<code-text> | <bold-text> | <italic-text> | <link> | <Image> | <normal-text>)*
 */
function Text(ctx: Parser) {
    let children = [];
    let token = ctx.lookAhead();
    while(token.tokenType !== TOKEN_TYPE.NEWLINE) {
        let item = CodeText(ctx) || BoldText(ctx) || ItalicText(ctx) || Image(ctx) || Link(ctx) || NormalText(ctx);

        children.push(item);
        token = ctx.lookAhead();
    }

    return AstCreator.text({ children });
}

/**
 * ReferText -> (Text <refer-newline>?)*
 */
function ReferText(ctx: Parser) {
    let children = [];
    let token = ctx.lookAhead();
    while(token.tokenType !== TOKEN_TYPE.NEWLINE || token.lexeme.length < 2) {
        let item = CodeText(ctx) || BoldText(ctx) || ItalicText(ctx) || Image(ctx) || Link(ctx) || ReferNewLine(ctx) || NormalText(ctx);

        token = ctx.lookAhead();
        children.push(item);
        if(!token) {
            return AstCreator.referText({ children });
        }
    }

    return AstCreator.referText({ children });
}

/**
 * ReferNewLine -> <newline>
 */
function ReferNewLine(ctx: Parser) {
    let originIndex = ctx.getIndex();
    let token = ctx.consume();
    
    if(token.tokenType !== TOKEN_TYPE.NEWLINE || token.lexeme.length > 1) {
        ctx.setIndex(originIndex);
        return;
    }

    return AstCreator.referNewline();
}


/**
 * Link -> <left-bracket> <other> <right-bracket> <left-parentheses> <other> <right-parentheses> 
 */
function Link(ctx: Parser) {
    let originIndex = ctx.getIndex();

    if(!ctx.match({originIndex, tokenType: TOKEN_TYPE.LEFT_BRACKET})) {
        return;
    }

    const text = ctx.matchUntil({
        originIndex,
        endToken: TOKEN_TYPE.RIGHT_BRACKET,
        errorToken: TOKEN_TYPE.NEWLINE
    });

    if(!text) {
        return;
    }

    if(!ctx.match({ originIndex, tokenType: TOKEN_TYPE.LEFT_PARENTHESES })) {
        return;
    }

    const url = ctx.matchUntil({
        originIndex,
        endToken: TOKEN_TYPE.RIGHT_PARENTHESES,
        errorToken: TOKEN_TYPE.NEWLINE
    });

    if(!url) {
        return;
    }

    return AstCreator.link({ text, url });
}

/**
 * Image -> <clam> <left-bracket> <other> <right-bracket> <left-parentheses> <other> <right-parentheses>
 */
function Image(ctx: Parser) {
    let originIndex = ctx.getIndex();

    if(!ctx.match({ originIndex, tokenType: TOKEN_TYPE.CLAM })) {
        return;
    }

    if(!ctx.match({ originIndex, tokenType: TOKEN_TYPE.LEFT_BRACKET })) {
        return;
    }

    const alt = ctx.matchUntil({
        originIndex,
        endToken: TOKEN_TYPE.RIGHT_BRACKET,
        errorToken: TOKEN_TYPE.NEWLINE
    });
    
    if(!alt) {
        return;
    }

    if(!ctx.match({ originIndex, tokenType: TOKEN_TYPE.LEFT_PARENTHESES })) {
        return;
    }

    const url = ctx.matchUntil({
        originIndex,
        endToken: TOKEN_TYPE.RIGHT_PARENTHESES,
        errorToken: TOKEN_TYPE.NEWLINE
    });
    
    if(!url) {
        return;
    }

    return AstCreator.image({ alt, url });
}

/**
 * BoldText -> <styled-text-markup>{2} <other> <styled-text-markup>{2}
 */
function BoldText(ctx: Parser) {
    let originIndex = ctx.getIndex();

    if(!ctx.match({
        originIndex,
        tokenType: TOKEN_TYPE.STYLED_TEXT_MARKUP,
        count: 2,
    })) {
        return;
    }

    const text = ctx.matchUntil({
        originIndex,
        endToken: TOKEN_TYPE.STYLED_TEXT_MARKUP,
        errorToken: TOKEN_TYPE.NEWLINE
    });

    if(!text) {
        return;
    }

    if(!ctx.match({
        originIndex,
        tokenType: TOKEN_TYPE.STYLED_TEXT_MARKUP
    })) {
        return;
    }

    return AstCreator.boldText({ text });
}

/**
 * ItalicText -> <styled-text-markup> <other> <styled-text-markup>
 */
function ItalicText(ctx: Parser) {
    let originIndex = ctx.getIndex();

    if(!ctx.match({
        originIndex,
        tokenType: TOKEN_TYPE.STYLED_TEXT_MARKUP
    })) {
        return;
    }

    const text = ctx.matchUntil({
        originIndex,
        endToken: TOKEN_TYPE.STYLED_TEXT_MARKUP,
        errorToken: TOKEN_TYPE.NEWLINE
    });

    if(!text) {
        return;
    }

    return AstCreator.italicText({ text });
}

/**
 * CodeText -> <code-dot> <other> <code-dot>
 */
function CodeText(ctx: Parser) {
    let originIndex = ctx.getIndex();

    if(!ctx.match({
        originIndex,
        tokenType: TOKEN_TYPE.CODE_DOT
    })) {
        return;
    }

    const text = ctx.matchUntil({
        originIndex,
        endToken: TOKEN_TYPE.CODE_DOT,
        errorToken: TOKEN_TYPE.NEWLINE
    });

    if(!text) {
        return;
    }

    return AstCreator.codeText({ text });
}


/**
 * NormalText
 */
function NormalText(ctx: Parser) {
    let token = ctx.consume();
    
    let text = '';
    while(token.tokenType !== TOKEN_TYPE.NEWLINE) {
        text += token.lexeme;
        token = ctx.consume();
        if(notNormalTextStart(token)) {
            ctx.back();
            return AstCreator.normalText({ text });
        }
    }

    ctx.back();

    return AstCreator.normalText({ text });
}

export default function genAst(ctx: Parser) {
    return Content(ctx);
}