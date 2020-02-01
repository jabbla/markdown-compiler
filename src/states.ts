import { TOKEN_TYPE } from './token';

/**
 * 换行符 状态
 */
export const NEWLINE_STATES = {
    newline_a: {
        key: 'newline_a',
        transitions: [
            {
                char: '\n',
                target: 'newline_b'
            }
        ]
    },
    newline_b: {
        key: 'newline_b',
        accept: true,
        transitions: [
            {
                char: '\n',
                target: 'newline_b'
            },
            {
                char: '\r',
                target: 'newline_a'
            }
        ],
        onAccept(lexeme: string) {
            return {
                tokenType: TOKEN_TYPE.NEWLINE,
                lexeme,
            };
        }
    }
};

/**
 * 标题标识符 状态
 */
export const HEADER_IDENTIFIER_STATES = {
    header_s: {
        key: 'header_s',
        accept: true,
        transitions: [
            {
                char: '#',
                target: 'header_s'
            }
        ],
        onAccept(lexeme: string) {
            return {
                tokenType: TOKEN_TYPE.HEADER_MARKUP,
                lexeme,
            };
        }
    },
};

/**
 * 空格 状态
 */
export const WHITE_SPACE_STATES = {
    whiteSpace_a: {
        key: 'whiteSpace_a',
        accept: true,
        transitions: [
            {
                char: ' ',
                target: 'whiteSpace_a'
            }
        ],
        onAccept(lexeme: string) {
            return {
                tokenType: TOKEN_TYPE.WHITESPACE,
                lexeme,
            };
        }
    }
};

/**
 * 代码标识 状态
 */
export const CODE_DOT_STATES = {
    code_dot_a: {
        key: 'code_dot_a',
        accept: true,
        transitions: [
            {
                char: '`',
                target: 'code_dot_a'
            }
        ],
        onAccept(lexeme: string) {
            return {
                tokenType: TOKEN_TYPE.CODE_DOT,
                lexeme,
            };
        }
    }
};

/**
 * 文字样式（加粗或者斜体） 状态
 */
export const TEXT_STYLE_STATES = {
    text_style_a: {
        key: 'text_style_a',
        accept: true,
        onAccept(lexeme: string) {
            return {
                tokenType: TOKEN_TYPE.STYLED_TEXT_MARKUP,
                lexeme,
            };
        }
    }
};

/**
 * 有序列表数字索引 状态
 */
export const LIST_NUMBER_INDEX_STATES = {
    list_number_index_a: {
        key: 'list_number_index_a',
        transitions: [
            {
                char: '\\d',
                regExp: true,
                target: 'list_number_index_a'
            },
            {
                char: '.',
                target: 'list_number_index_b'
            }
        ],
    },
    list_number_index_b: {
        key: 'list_number_index_b',
        accept: true,
        onAccept(lexeme: string) {
            return {
                tokenType: TOKEN_TYPE.LIST_NUMBER_INDEX,
                lexeme
            };
        }
    }
};

/**
 * 无序列表索引 状态
 */
export const LIST_SYMBOL_INDEX_STATES = {
    list_symbol_index_a: {
        key: 'list_symbol_index_a',
        accept: true,
        onAccept(lexeme: string) {
            return {
                tokenType: TOKEN_TYPE.LIST_SYMBOL_INDEX,
                lexeme
            };
        }
    }
};

/**
 * 左中括号
 */
export const LEFT_BRACKET_STATE = {
    left_bracket_a: {
        key: 'left_bracket_a',
        accept: true,
        onAccept(lexeme: string) {
            return {
                tokenType: TOKEN_TYPE.LEFT_BRACKET,
                lexeme,
            };
        }
    }
};

/**
 * 右中括号
 */
export const RIGHT_BRACKET_STATE = {
    right_bracket_a: {
        key: 'right_bracket_a',
        accept: true,
        onAccept(lexeme: string) {
            return {
                tokenType: TOKEN_TYPE.RIGHT_BRACKET,
                lexeme,
            };
        }
    }
};

/**
 * 左圆括号
 */
export const LEFT_PARENTHESES_STATE = {
    left_parentheses_a: {
        key: 'left_parentheses_a',
        accept: true,
        onAccept(lexeme: string) {
            return {
                tokenType: TOKEN_TYPE.LEFT_PARENTHESES,
                lexeme,
            };
        }
    }
};

/**
 * 右圆括号
 */
export const RIGHT_PARENTHESES_STATE = {
    right_parentheses_a: {
        key: 'right_parentheses_a',
        accept: true,
        onAccept(lexeme: string) {
            return {
                tokenType: TOKEN_TYPE.RIGHT_PARENTHESES,
                lexeme,
            };
        }
    }
};

/**
 * 感叹号
 */
export const CLAM_STATE = {
    clam_a: {
        key: 'clam_a',
        accept: true,
        onAccept(lexeme: string) {
            return {
                tokenType: TOKEN_TYPE.CLAM,
                lexeme,
            };
        }
    }
};

/**
 * 引用标识符
 */
export const REFER_STATE = {
    refer_a: {
        key: 'refer_a',
        accept: true,
        onAccept(lexeme: string) {
            return {
                tokenType: TOKEN_TYPE.REFER_MARKUP,
                lexeme,
            };
        }
    }
};

