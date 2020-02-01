export enum TOKEN_TYPE {
    ORDINARY_TEXT = 'ORDINARY_TEXT',
    NEWLINE = 'NEWLINE',
    HEADER_MARKUP = 'HEADER_MARKUP',
    WHITESPACE = 'WHITESPACE',
    CODE_DOT = 'CODE_DOT',
    STYLED_TEXT_MARKUP = 'STYLED_TEXT_MARKUP',
    LEFT_BRACKET = 'LEFT_BRACKET',
    RIGHT_BRACKET = 'RIGHT_BRACKET',
    LEFT_PARENTHESES = 'LEFT_PARENTHESES',
    RIGHT_PARENTHESES = 'RIGHT_PARENTHESES',
    LIST_NUMBER_INDEX = 'LIST_NUMBER_INDEX',
    LIST_SYMBOL_INDEX = 'LIST_SYMBOL_INDEX',
    CLAM = 'CLAM',
    INLINE_CODE = 'INLINE_CODE',
    BOLD_TEXT = 'BOLD_TEXT',
    LINK = 'LINK',
    IMAGE = 'IMAGE',
    REFER_MARKUP = 'REFER_MARKUP'
}

export interface IBasicToken {
    tokenType: TOKEN_TYPE;
    lexeme: string;
}

/**
 * 是否不是普通文本开头的 token
 */
export function notNormalTextStart(token: IBasicToken) {
    return [
        TOKEN_TYPE.LEFT_BRACKET,
        TOKEN_TYPE.CLAM,
        TOKEN_TYPE.STYLED_TEXT_MARKUP,
        TOKEN_TYPE.CODE_DOT
    ].includes(token.tokenType);
}
