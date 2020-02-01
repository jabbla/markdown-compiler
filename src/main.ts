/// <reference path="./modules.d.ts" />
import Scanner from './scanner';
import Parser from './parser';
import { Machine } from './machine';
import {
    NEWLINE_STATES,
    HEADER_IDENTIFIER_STATES,
    WHITE_SPACE_STATES,
    CODE_DOT_STATES,
    TEXT_STYLE_STATES,
    LEFT_BRACKET_STATE,
    RIGHT_BRACKET_STATE,
    LEFT_PARENTHESES_STATE,
    RIGHT_PARENTHESES_STATE,
    CLAM_STATE,
    REFER_STATE,
    LIST_NUMBER_INDEX_STATES,
    LIST_SYMBOL_INDEX_STATES,
} from './states';
import CodeTransform from './transform';

const machine = new Machine({
    entry: {
        key: 'start_state',
        transitions: [
            /** 
             * 换行符 
             */
            {
                char: '\r',
                target: NEWLINE_STATES.newline_a.key
            },
            {
                char: '\n',
                target: NEWLINE_STATES.newline_b.key
            },
            /**
             * 标题标识符
             */
            {
                char: '#',
                target: HEADER_IDENTIFIER_STATES.header_s.key
            },
            /**
             * 空格
             */
            {
                char: '[\\u2002\\u2003\\u00a0\\u3000\\u0020]',
                regExp: true,
                target: WHITE_SPACE_STATES.whiteSpace_a.key
            },
            /**
             * 代码标识
             */
            {
                char: '`',
                target: CODE_DOT_STATES.code_dot_a.key
            },
            /**
             * 文字样式
             */
            {
                char: '*',
                target: TEXT_STYLE_STATES.text_style_a.key,
            },
            /**
             * 左中括号
             */
            {
                char: '[',
                target: LEFT_BRACKET_STATE.left_bracket_a.key,
            },
            /**
             * 右中括号
             */
            {
                char: ']',
                target: RIGHT_BRACKET_STATE.right_bracket_a.key,
            },
            /**
             * 左圆括号
             */
            {
                char: '(',
                target: LEFT_PARENTHESES_STATE.left_parentheses_a.key,
            },
            /**
             * 右圆括号
             */
            {
                char: ')',
                target: RIGHT_PARENTHESES_STATE.right_parentheses_a.key,
            },
            /**
             * 感叹号
             */
            {
                char: '!',
                target: CLAM_STATE.clam_a.key,
            },
            /**
             * 引用标识符
             */
            {
                char: '>',
                target: REFER_STATE.refer_a.key,
            },
            /**
             * 有序列表索引
             */
            {
                char: '\\d',
                regExp: true,
                target: LIST_NUMBER_INDEX_STATES.list_number_index_a.key,
            },
            /**
             * 无序列表索引
             */
            {
                char: '-',
                target: LIST_SYMBOL_INDEX_STATES.list_symbol_index_a.key,
            }
        ]
    },
    states: [
        ...Object.values(NEWLINE_STATES),
        ...Object.values(HEADER_IDENTIFIER_STATES),
        ...Object.values(WHITE_SPACE_STATES),
        ...Object.values(CODE_DOT_STATES),
        ...Object.values(TEXT_STYLE_STATES),
        ...Object.values(LEFT_BRACKET_STATE),
        ...Object.values(RIGHT_BRACKET_STATE),
        ...Object.values(LEFT_PARENTHESES_STATE),
        ...Object.values(RIGHT_PARENTHESES_STATE),
        ...Object.values(CLAM_STATE),
        ...Object.values(REFER_STATE),
        ...Object.values(LIST_NUMBER_INDEX_STATES),
        ...Object.values(LIST_SYMBOL_INDEX_STATES),
    ]
});

export default function transform(source: string) {
    if(!source) {
        return '';
    }

    const scanner = new Scanner({
        input: source,
        machine,
    });

    const parser = new Parser({
        scanner,
    });

    return CodeTransform(parser.parse());
}