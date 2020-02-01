(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.compileMarkdown = factory());
}(this, (function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }

    var Scanner = (function () {
        function Scanner(options) {
            var input = options.input, machine = options.machine;
            this.input = input.split('');
            this.machine = machine;
        }
        Scanner.prototype.run = function () {
            var tokens = [];
            for (var i = 0; i <= this.input.length; i++) {
                var char = this.input[i];
                var signal = this.machine.input(char);
                if (signal) {
                    tokens.push(signal.token);
                    if (!signal.scanner_continue) {
                        i = i - (signal.back_step || 1);
                    }
                }
            }
            return tokens;
        };
        return Scanner;
    }());

    var TOKEN_TYPE;
    (function (TOKEN_TYPE) {
        TOKEN_TYPE["ORDINARY_TEXT"] = "ORDINARY_TEXT";
        TOKEN_TYPE["NEWLINE"] = "NEWLINE";
        TOKEN_TYPE["HEADER_MARKUP"] = "HEADER_MARKUP";
        TOKEN_TYPE["WHITESPACE"] = "WHITESPACE";
        TOKEN_TYPE["CODE_DOT"] = "CODE_DOT";
        TOKEN_TYPE["STYLED_TEXT_MARKUP"] = "STYLED_TEXT_MARKUP";
        TOKEN_TYPE["LEFT_BRACKET"] = "LEFT_BRACKET";
        TOKEN_TYPE["RIGHT_BRACKET"] = "RIGHT_BRACKET";
        TOKEN_TYPE["LEFT_PARENTHESES"] = "LEFT_PARENTHESES";
        TOKEN_TYPE["RIGHT_PARENTHESES"] = "RIGHT_PARENTHESES";
        TOKEN_TYPE["LIST_NUMBER_INDEX"] = "LIST_NUMBER_INDEX";
        TOKEN_TYPE["LIST_SYMBOL_INDEX"] = "LIST_SYMBOL_INDEX";
        TOKEN_TYPE["CLAM"] = "CLAM";
        TOKEN_TYPE["INLINE_CODE"] = "INLINE_CODE";
        TOKEN_TYPE["BOLD_TEXT"] = "BOLD_TEXT";
        TOKEN_TYPE["LINK"] = "LINK";
        TOKEN_TYPE["IMAGE"] = "IMAGE";
        TOKEN_TYPE["REFER_MARKUP"] = "REFER_MARKUP";
    })(TOKEN_TYPE || (TOKEN_TYPE = {}));
    function notNormalTextStart(token) {
        return [
            TOKEN_TYPE.LEFT_BRACKET,
            TOKEN_TYPE.CLAM,
            TOKEN_TYPE.STYLED_TEXT_MARKUP,
            TOKEN_TYPE.CODE_DOT
        ].includes(token.tokenType);
    }

    var AST_TYPE;
    (function (AST_TYPE) {
        AST_TYPE["CONTENT"] = "content";
        AST_TYPE["HEAD_BLOCK"] = "head_block";
        AST_TYPE["REFER_BLOCK"] = "reference_block";
        AST_TYPE["CODE_BLOCK"] = "code_block";
        AST_TYPE["LIST_BLOCK"] = "list_block";
        AST_TYPE["PARAGRAPH"] = "paragraph";
        AST_TYPE["TEXT"] = "text";
        AST_TYPE["REFER_TEXT"] = "refer_text";
        AST_TYPE["REFER_NEWLINE"] = "refer_newline";
        AST_TYPE["LINK"] = "link";
        AST_TYPE["IMAGE"] = "image";
        AST_TYPE["BOLD_TEXT"] = "bold_text";
        AST_TYPE["ITALIC_TEXT"] = "italic_text";
        AST_TYPE["CODE_TEXT"] = "code_text";
        AST_TYPE["NORMAL_TEXT"] = "normal_text";
        AST_TYPE["LIST_ITEM"] = "LIST_ITEM";
    })(AST_TYPE || (AST_TYPE = {}));
    var AstCreator = {
        content: function (_a) {
            var children = _a.children;
            return {
                type: AST_TYPE.CONTENT,
                children: children,
            };
        },
        headBlock: function (_a) {
            var level = _a.level, children = _a.children;
            return {
                type: AST_TYPE.HEAD_BLOCK,
                level: level,
                children: children,
            };
        },
        referBlock: function (_a) {
            var children = _a.children;
            return {
                type: AST_TYPE.REFER_BLOCK,
                children: children
            };
        },
        codeBlock: function (_a) {
            var language = _a.language, text = _a.text;
            return {
                type: AST_TYPE.CODE_BLOCK,
                language: language,
                text: text
            };
        },
        listBlock: function (_a) {
            var ordered = _a.ordered, children = _a.children;
            return {
                type: AST_TYPE.LIST_BLOCK,
                ordered: ordered,
                children: children
            };
        },
        listItem: function (_a) {
            var children = _a.children;
            return {
                type: AST_TYPE.LIST_ITEM,
                children: children
            };
        },
        paragraph: function (_a) {
            var children = _a.children;
            return {
                type: AST_TYPE.PARAGRAPH,
                children: children
            };
        },
        text: function (_a) {
            var children = _a.children;
            return {
                type: AST_TYPE.TEXT,
                children: children
            };
        },
        referText: function (_a) {
            var children = _a.children;
            return {
                type: AST_TYPE.REFER_TEXT,
                children: children
            };
        },
        referNewline: function () {
            return {
                type: AST_TYPE.REFER_NEWLINE
            };
        },
        link: function (_a) {
            var text = _a.text, url = _a.url;
            return {
                type: AST_TYPE.LINK,
                text: text,
                url: url
            };
        },
        image: function (_a) {
            var alt = _a.alt, url = _a.url;
            return {
                type: AST_TYPE.IMAGE,
                alt: alt,
                url: url
            };
        },
        boldText: function (_a) {
            var text = _a.text;
            return {
                type: AST_TYPE.BOLD_TEXT,
                text: text
            };
        },
        italicText: function (_a) {
            var text = _a.text;
            return {
                type: AST_TYPE.ITALIC_TEXT,
                text: text
            };
        },
        codeText: function (_a) {
            var text = _a.text;
            return {
                type: AST_TYPE.CODE_TEXT,
                text: text
            };
        },
        normalText: function (_a) {
            var text = _a.text;
            return {
                type: AST_TYPE.NORMAL_TEXT,
                text: text
            };
        }
    };

    function Content(ctx) {
        var children = [];
        var block = Block(ctx);
        while (block) {
            children.push(block);
            if (ctx.isComplete()) {
                break;
            }
            ctx.back();
            block = Block(ctx);
        }
        return AstCreator.content({ children: children });
    }
    function Block(ctx) {
        var res = HeadBlock(ctx) || ReferBlock(ctx) || CodeBlock(ctx) || ListBlock(ctx) || Paragraph(ctx);
        return res;
    }
    function HeadBlock(ctx) {
        var originIndex = ctx.getIndex();
        var level;
        if (!ctx.match({ originIndex: originIndex, tokenType: TOKEN_TYPE.NEWLINE })) {
            return;
        }
        var token = ctx.consume();
        if (token.tokenType === TOKEN_TYPE.HEADER_MARKUP) {
            level = token.lexeme.length;
        }
        else {
            ctx.setIndex(originIndex);
            return;
        }
        if (!ctx.match({ originIndex: originIndex, tokenType: TOKEN_TYPE.WHITESPACE })) {
            return;
        }
        var children = Text(ctx);
        if (!children) {
            ctx.setIndex(originIndex);
            return;
        }
        if (!ctx.match({ originIndex: originIndex, tokenType: TOKEN_TYPE.NEWLINE })) {
            return;
        }
        return AstCreator.headBlock({ level: level, children: children });
    }
    function ReferBlock(ctx) {
        var originIndex = ctx.getIndex();
        if (!ctx.match({ originIndex: originIndex, tokenType: TOKEN_TYPE.NEWLINE })) {
            return;
        }
        if (!ctx.match({ originIndex: originIndex, tokenType: TOKEN_TYPE.REFER_MARKUP })) {
            return;
        }
        if (!ctx.match({ originIndex: originIndex, tokenType: TOKEN_TYPE.WHITESPACE })) {
            return;
        }
        var children = ReferText(ctx);
        if (!children) {
            ctx.setIndex(originIndex);
            return;
        }
        if (!ctx.match({ originIndex: originIndex, tokenType: TOKEN_TYPE.NEWLINE })) {
            return;
        }
        return AstCreator.referBlock({ children: children });
    }
    function CodeBlock(ctx) {
        var originIndex = ctx.getIndex();
        if (!ctx.match({
            originIndex: originIndex,
            tokenType: TOKEN_TYPE.NEWLINE,
        })) {
            return;
        }
        if (!ctx.match({
            originIndex: originIndex,
            tokenType: TOKEN_TYPE.CODE_DOT,
            lexeme: '```'
        })) {
            return;
        }
        var language = ctx.matchUntil({
            originIndex: originIndex,
            endToken: TOKEN_TYPE.NEWLINE,
            errorToken: null,
        });
        if (!language) {
            return;
        }
        var text = ctx.matchUntil({
            originIndex: originIndex,
            endToken: [TOKEN_TYPE.NEWLINE, TOKEN_TYPE.CODE_DOT],
            errorToken: null
        });
        if (text === false) {
            return;
        }
        if (!ctx.match({
            originIndex: originIndex,
            tokenType: TOKEN_TYPE.CODE_DOT,
            lexeme: '```'
        })) {
            return;
        }
        if (!ctx.match({ originIndex: originIndex, tokenType: TOKEN_TYPE.NEWLINE })) {
            return;
        }
        return AstCreator.codeBlock({ language: language, text: text });
    }
    function ListBlock(ctx) {
        var originIndex = ctx.getIndex();
        if (!ctx.match({
            originIndex: originIndex,
            tokenType: TOKEN_TYPE.NEWLINE
        })) {
            return;
        }
        var ordered = ctx.lookAhead().tokenType === TOKEN_TYPE.LIST_NUMBER_INDEX;
        var item = ListItem(ctx, ordered);
        if (!item) {
            ctx.setIndex(originIndex);
            return;
        }
        var children = [];
        while (item) {
            children.push(item);
            ctx.consume();
            item = ListItem(ctx, ordered);
            if (!item) {
                ctx.back();
            }
        }
        if (!ctx.match({
            originIndex: originIndex,
            tokenType: TOKEN_TYPE.NEWLINE
        })) {
            return;
        }
        return AstCreator.listBlock({
            ordered: ordered,
            children: children
        });
    }
    function ListItem(ctx, ordered) {
        var originIndex = ctx.getIndex();
        if (!ctx.match({
            originIndex: originIndex,
            tokenType: ordered ? TOKEN_TYPE.LIST_NUMBER_INDEX : TOKEN_TYPE.LIST_SYMBOL_INDEX
        })) {
            return;
        }
        if (!ctx.match({
            originIndex: originIndex,
            tokenType: TOKEN_TYPE.WHITESPACE
        })) {
            return;
        }
        var children = Text(ctx);
        if (!children) {
            return;
        }
        return AstCreator.listItem({
            children: children
        });
    }
    function Paragraph(ctx) {
        var originIndex = ctx.getIndex();
        if (!ctx.match({ originIndex: originIndex, tokenType: TOKEN_TYPE.NEWLINE })) {
            return;
        }
        var children = Text(ctx);
        if (!children) {
            ctx.setIndex(originIndex);
            return;
        }
        if (!ctx.match({ originIndex: originIndex, tokenType: TOKEN_TYPE.NEWLINE })) {
            return;
        }
        return AstCreator.paragraph({ children: children });
    }
    function Text(ctx) {
        var children = [];
        var token = ctx.lookAhead();
        while (token.tokenType !== TOKEN_TYPE.NEWLINE) {
            var item = CodeText(ctx) || BoldText(ctx) || ItalicText(ctx) || Image(ctx) || Link(ctx) || NormalText(ctx);
            children.push(item);
            token = ctx.lookAhead();
        }
        return AstCreator.text({ children: children });
    }
    function ReferText(ctx) {
        var children = [];
        var token = ctx.lookAhead();
        while (token.tokenType !== TOKEN_TYPE.NEWLINE || token.lexeme.length < 2) {
            var item = CodeText(ctx) || BoldText(ctx) || ItalicText(ctx) || Image(ctx) || Link(ctx) || ReferNewLine(ctx) || NormalText(ctx);
            token = ctx.lookAhead();
            children.push(item);
            if (!token) {
                return AstCreator.referText({ children: children });
            }
        }
        return AstCreator.referText({ children: children });
    }
    function ReferNewLine(ctx) {
        var originIndex = ctx.getIndex();
        var token = ctx.consume();
        if (token.tokenType !== TOKEN_TYPE.NEWLINE || token.lexeme.length > 1) {
            ctx.setIndex(originIndex);
            return;
        }
        return AstCreator.referNewline();
    }
    function Link(ctx) {
        var originIndex = ctx.getIndex();
        if (!ctx.match({ originIndex: originIndex, tokenType: TOKEN_TYPE.LEFT_BRACKET })) {
            return;
        }
        var text = ctx.matchUntil({
            originIndex: originIndex,
            endToken: TOKEN_TYPE.RIGHT_BRACKET,
            errorToken: TOKEN_TYPE.NEWLINE
        });
        if (!text) {
            return;
        }
        if (!ctx.match({ originIndex: originIndex, tokenType: TOKEN_TYPE.LEFT_PARENTHESES })) {
            return;
        }
        var url = ctx.matchUntil({
            originIndex: originIndex,
            endToken: TOKEN_TYPE.RIGHT_PARENTHESES,
            errorToken: TOKEN_TYPE.NEWLINE
        });
        if (!url) {
            return;
        }
        return AstCreator.link({ text: text, url: url });
    }
    function Image(ctx) {
        var originIndex = ctx.getIndex();
        if (!ctx.match({ originIndex: originIndex, tokenType: TOKEN_TYPE.CLAM })) {
            return;
        }
        if (!ctx.match({ originIndex: originIndex, tokenType: TOKEN_TYPE.LEFT_BRACKET })) {
            return;
        }
        var alt = ctx.matchUntil({
            originIndex: originIndex,
            endToken: TOKEN_TYPE.RIGHT_BRACKET,
            errorToken: TOKEN_TYPE.NEWLINE
        });
        if (!alt) {
            return;
        }
        if (!ctx.match({ originIndex: originIndex, tokenType: TOKEN_TYPE.LEFT_PARENTHESES })) {
            return;
        }
        var url = ctx.matchUntil({
            originIndex: originIndex,
            endToken: TOKEN_TYPE.RIGHT_PARENTHESES,
            errorToken: TOKEN_TYPE.NEWLINE
        });
        if (!url) {
            return;
        }
        return AstCreator.image({ alt: alt, url: url });
    }
    function BoldText(ctx) {
        var originIndex = ctx.getIndex();
        if (!ctx.match({
            originIndex: originIndex,
            tokenType: TOKEN_TYPE.STYLED_TEXT_MARKUP,
            count: 2,
        })) {
            return;
        }
        var text = ctx.matchUntil({
            originIndex: originIndex,
            endToken: TOKEN_TYPE.STYLED_TEXT_MARKUP,
            errorToken: TOKEN_TYPE.NEWLINE
        });
        if (!text) {
            return;
        }
        if (!ctx.match({
            originIndex: originIndex,
            tokenType: TOKEN_TYPE.STYLED_TEXT_MARKUP
        })) {
            return;
        }
        return AstCreator.boldText({ text: text });
    }
    function ItalicText(ctx) {
        var originIndex = ctx.getIndex();
        if (!ctx.match({
            originIndex: originIndex,
            tokenType: TOKEN_TYPE.STYLED_TEXT_MARKUP
        })) {
            return;
        }
        var text = ctx.matchUntil({
            originIndex: originIndex,
            endToken: TOKEN_TYPE.STYLED_TEXT_MARKUP,
            errorToken: TOKEN_TYPE.NEWLINE
        });
        if (!text) {
            return;
        }
        return AstCreator.italicText({ text: text });
    }
    function CodeText(ctx) {
        var originIndex = ctx.getIndex();
        if (!ctx.match({
            originIndex: originIndex,
            tokenType: TOKEN_TYPE.CODE_DOT
        })) {
            return;
        }
        var text = ctx.matchUntil({
            originIndex: originIndex,
            endToken: TOKEN_TYPE.CODE_DOT,
            errorToken: TOKEN_TYPE.NEWLINE
        });
        if (!text) {
            return;
        }
        return AstCreator.codeText({ text: text });
    }
    function NormalText(ctx) {
        var token = ctx.consume();
        var text = '';
        while (token.tokenType !== TOKEN_TYPE.NEWLINE) {
            text += token.lexeme;
            token = ctx.consume();
            if (notNormalTextStart(token)) {
                ctx.back();
                return AstCreator.normalText({ text: text });
            }
        }
        ctx.back();
        return AstCreator.normalText({ text: text });
    }
    function genAst(ctx) {
        return Content(ctx);
    }

    var Parser = (function () {
        function Parser(options) {
            this.scanner = options.scanner;
            this.index = 0;
        }
        Parser.prototype.parse = function () {
            var tokens = this.scanner.run();
            this.tokens = __spreadArrays([
                {
                    tokenType: TOKEN_TYPE.NEWLINE,
                    lexeme: '',
                }
            ], tokens, [
                {
                    tokenType: TOKEN_TYPE.NEWLINE,
                    lexeme: '\n\n',
                }
            ]);
            this.ast = genAst(this);
            return this.ast;
        };
        Parser.prototype.consume = function () {
            return this.tokens[this.index++];
        };
        Parser.prototype.back = function () {
            this.index = this.index - 1;
        };
        Parser.prototype.lookAhead = function (offset) {
            if (offset === void 0) { offset = 0; }
            return this.tokens[this.index + offset];
        };
        Parser.prototype.isComplete = function () {
            return this.index >= this.tokens.length;
        };
        Parser.prototype.getIndex = function () {
            return this.index;
        };
        Parser.prototype.setIndex = function (index) {
            this.index = index;
        };
        Parser.prototype.match = function (option) {
            var _a;
            var originIndex = option.originIndex, tokenType = option.tokenType, lexeme = option.lexeme;
            var count = option.count > 1 ? option.count : 1;
            var token;
            for (var i = 0; i < count; i++) {
                token = this.consume();
                if (((_a = token) === null || _a === void 0 ? void 0 : _a.tokenType) !== tokenType || (typeof lexeme === 'undefined' ? false : lexeme !== token.lexeme)) {
                    this.setIndex(originIndex);
                    return false;
                }
            }
            return true;
        };
        Parser.prototype.matchUntil = function (option) {
            var _this = this;
            var originIndex = option.originIndex, endToken = option.endToken, errorToken = option.errorToken;
            var token = this.consume();
            var text = '';
            var consumed = false;
            var isEndToken = function (token) {
                if (endToken instanceof Array) {
                    return endToken.every(function (end, index) {
                        var _a;
                        if (index === 0) {
                            return end === token.tokenType;
                        }
                        return end === ((_a = _this.lookAhead(index - 1)) === null || _a === void 0 ? void 0 : _a.tokenType);
                    });
                }
                return token.tokenType === endToken;
            };
            while (token && !isEndToken(token)) {
                consumed = true;
                text += token.lexeme;
                token = this.consume();
                if (!token || token.tokenType === errorToken) {
                    this.setIndex(originIndex);
                    return false;
                }
            }
            if (!consumed) {
                this.setIndex(originIndex);
            }
            return text;
        };
        return Parser;
    }());

    var Machine = (function () {
        function Machine(options) {
            var states = options.states;
            this.states = states;
            this.indexedStates = states.reduce(function (prev, cur) {
                prev[cur.key] = cur;
                return prev;
            }, {});
            this.entry = options.entry;
            this.current = this.entry;
            this.buffer = [];
            this.options = options;
        }
        Machine.prototype.input = function (char) {
            var endFile = typeof char === 'undefined';
            this.buffer.push(char);
            var currentTransitions = this.current.transitions || [];
            var transition = currentTransitions.find(function (transition) {
                var regExp = transition.regExp, transitionChar = transition.char;
                return regExp ? new RegExp(transitionChar).test(char) : char === transitionChar;
            });
            if (!transition || endFile) {
                return this.current.accept ? this.accept() : this.error(endFile);
            }
            var targetState = this.indexedStates[transition.target];
            if (!targetState) {
                throw new Error("\u672A\u627E\u5230 key \u4E3A " + JSON.stringify(transition.target) + " \u7684\u72B6\u6001\uFF01");
            }
            this.current = targetState;
        };
        Machine.prototype.error = function (endFile) {
            var on = this.options.on;
            var bufferString = (endFile ? this.buffer.slice(0, -1) : this.buffer).join('');
            this.reset();
            if (on && on.error) {
                on.error(bufferString);
            }
            var back_step = bufferString.length - 1 > 1 ? (bufferString.length - 1) : 1;
            var scanner_continue = endFile || bufferString.length === 1;
            return {
                scanner_continue: scanner_continue,
                back_step: back_step,
                token: {
                    tokenType: TOKEN_TYPE.ORDINARY_TEXT,
                    lexeme: endFile ? bufferString : bufferString[0],
                }
            };
        };
        Machine.prototype.accept = function () {
            var on = this.options.on;
            var bufferString = this.buffer.slice(0, -1).join('');
            var current = this.current;
            this.reset();
            if (on && on.accept) {
                on.accept(bufferString);
            }
            return {
                scanner_continue: false,
                token: current.onAccept(bufferString)
            };
        };
        Machine.prototype.reset = function () {
            this.buffer = [];
            this.current = this.entry;
        };
        return Machine;
    }());

    var NEWLINE_STATES = {
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
            onAccept: function (lexeme) {
                return {
                    tokenType: TOKEN_TYPE.NEWLINE,
                    lexeme: lexeme,
                };
            }
        }
    };
    var HEADER_IDENTIFIER_STATES = {
        header_s: {
            key: 'header_s',
            accept: true,
            transitions: [
                {
                    char: '#',
                    target: 'header_s'
                }
            ],
            onAccept: function (lexeme) {
                return {
                    tokenType: TOKEN_TYPE.HEADER_MARKUP,
                    lexeme: lexeme,
                };
            }
        },
    };
    var WHITE_SPACE_STATES = {
        whiteSpace_a: {
            key: 'whiteSpace_a',
            accept: true,
            transitions: [
                {
                    char: ' ',
                    target: 'whiteSpace_a'
                }
            ],
            onAccept: function (lexeme) {
                return {
                    tokenType: TOKEN_TYPE.WHITESPACE,
                    lexeme: lexeme,
                };
            }
        }
    };
    var CODE_DOT_STATES = {
        code_dot_a: {
            key: 'code_dot_a',
            accept: true,
            transitions: [
                {
                    char: '`',
                    target: 'code_dot_a'
                }
            ],
            onAccept: function (lexeme) {
                return {
                    tokenType: TOKEN_TYPE.CODE_DOT,
                    lexeme: lexeme,
                };
            }
        }
    };
    var TEXT_STYLE_STATES = {
        text_style_a: {
            key: 'text_style_a',
            accept: true,
            onAccept: function (lexeme) {
                return {
                    tokenType: TOKEN_TYPE.STYLED_TEXT_MARKUP,
                    lexeme: lexeme,
                };
            }
        }
    };
    var LIST_NUMBER_INDEX_STATES = {
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
            onAccept: function (lexeme) {
                return {
                    tokenType: TOKEN_TYPE.LIST_NUMBER_INDEX,
                    lexeme: lexeme
                };
            }
        }
    };
    var LIST_SYMBOL_INDEX_STATES = {
        list_symbol_index_a: {
            key: 'list_symbol_index_a',
            accept: true,
            onAccept: function (lexeme) {
                return {
                    tokenType: TOKEN_TYPE.LIST_SYMBOL_INDEX,
                    lexeme: lexeme
                };
            }
        }
    };
    var LEFT_BRACKET_STATE = {
        left_bracket_a: {
            key: 'left_bracket_a',
            accept: true,
            onAccept: function (lexeme) {
                return {
                    tokenType: TOKEN_TYPE.LEFT_BRACKET,
                    lexeme: lexeme,
                };
            }
        }
    };
    var RIGHT_BRACKET_STATE = {
        right_bracket_a: {
            key: 'right_bracket_a',
            accept: true,
            onAccept: function (lexeme) {
                return {
                    tokenType: TOKEN_TYPE.RIGHT_BRACKET,
                    lexeme: lexeme,
                };
            }
        }
    };
    var LEFT_PARENTHESES_STATE = {
        left_parentheses_a: {
            key: 'left_parentheses_a',
            accept: true,
            onAccept: function (lexeme) {
                return {
                    tokenType: TOKEN_TYPE.LEFT_PARENTHESES,
                    lexeme: lexeme,
                };
            }
        }
    };
    var RIGHT_PARENTHESES_STATE = {
        right_parentheses_a: {
            key: 'right_parentheses_a',
            accept: true,
            onAccept: function (lexeme) {
                return {
                    tokenType: TOKEN_TYPE.RIGHT_PARENTHESES,
                    lexeme: lexeme,
                };
            }
        }
    };
    var CLAM_STATE = {
        clam_a: {
            key: 'clam_a',
            accept: true,
            onAccept: function (lexeme) {
                return {
                    tokenType: TOKEN_TYPE.CLAM,
                    lexeme: lexeme,
                };
            }
        }
    };
    var REFER_STATE = {
        refer_a: {
            key: 'refer_a',
            accept: true,
            onAccept: function (lexeme) {
                return {
                    tokenType: TOKEN_TYPE.REFER_MARKUP,
                    lexeme: lexeme,
                };
            }
        }
    };

    var baseStyle = "html {\n  color: #333;\n  background: #fff;\n  text-rendering: optimizelegibility; }\n\nbody {\n  font: 300 1em/1.8 PingFang SC, Lantinghei SC, Microsoft Yahei, Hiragino Sans GB, Microsoft Sans Serif, WenQuanYi Micro Hei, sans-serif; }\n";

    var mainStyle = ".my-markdown_content {\n  color: #333;\n  background: #fff;\n  text-rendering: optimizelegibility;\n  font: 300 1em/1.8 PingFang SC, Lantinghei SC, Microsoft Yahei, Hiragino Sans GB, Microsoft Sans Serif, WenQuanYi Micro Hei, sans-serif; }\n  .my-markdown_content strong {\n    font-weight: bold;\n    color: #000; }\n  .my-markdown_content a {\n    border-bottom: 1px solid #1abc9c;\n    color: #1abc9c;\n    text-decoration: none; }\n    .my-markdown_content a:visited {\n      color: #1abc9c; }\n  .my-markdown_content pre {\n    display: block;\n    background: #f8f8f8;\n    border: 1px solid #ddd;\n    padding: 16px 24px;\n    font-family: Courier, 'Courier New', monospace;\n    white-space: pre-wrap; }\n  .my-markdown_content code {\n    font-size: 87.5%;\n    color: #e36397;\n    word-break: break-word;\n    font-family: Courier, 'Courier New', monospace; }\n  .my-markdown_content h1, .my-markdown_content h2, .my-markdown_content h3, .my-markdown_content h4, .my-markdown_content h5, .my-markdown_content h6 {\n    font-family: PingFang SC, Verdana, Helvetica Neue, Microsoft Yahei, Hiragino Sans GB, Microsoft Sans Serif, WenQuanYi Micro Hei, sans-serif;\n    font-weight: 100;\n    color: #000;\n    line-height: 1.35; }\n  .my-markdown_content .my-markdown_block__refer {\n    position: relative;\n    color: #999;\n    font-weight: 400;\n    border-left: 1px solid #1abc9c;\n    padding-left: 16px;\n    margin: 16px 48px 19.2px 32px; }\n  .my-markdown_content .my-markdown_block__paragraph {\n    margin: 16px; }\n";

    var prismStyle = "/*\n Solarized Color Schemes originally by Ethan Schoonover\n http://ethanschoonover.com/solarized\n\n Ported for PrismJS by Hector Matos\n Website: https://krakendev.io\n Twitter Handle: https://twitter.com/allonsykraken)\n*/\n/*\nSOLARIZED HEX\n--------- -------\nbase03    #002b36\nbase02    #073642\nbase01    #586e75\nbase00    #657b83\nbase0     #839496\nbase1     #93a1a1\nbase2     #eee8d5\nbase3     #fdf6e3\nyellow    #b58900\norange    #cb4b16\nred       #dc322f\nmagenta   #d33682\nviolet    #6c71c4\nblue      #268bd2\ncyan      #2aa198\ngreen     #859900\n*/\ncode[class*=\"language-\"],\npre[class*=\"language-\"] {\n  color: #657b83;\n  /* base00 */\n  font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;\n  font-size: 1em;\n  text-align: left;\n  white-space: pre;\n  word-spacing: normal;\n  word-break: normal;\n  word-wrap: normal;\n  line-height: 1.5;\n  -moz-tab-size: 4;\n  -o-tab-size: 4;\n  tab-size: 4;\n  -webkit-hyphens: none;\n  -moz-hyphens: none;\n  -ms-hyphens: none;\n  hyphens: none; }\n\npre[class*=\"language-\"]::-moz-selection, pre[class*=\"language-\"] ::-moz-selection,\ncode[class*=\"language-\"]::-moz-selection, code[class*=\"language-\"] ::-moz-selection {\n  background: #073642;\n  /* base02 */ }\n\npre[class*=\"language-\"]::selection, pre[class*=\"language-\"] ::selection,\ncode[class*=\"language-\"]::selection, code[class*=\"language-\"] ::selection {\n  background: #073642;\n  /* base02 */ }\n\n/* Code blocks */\npre[class*=\"language-\"] {\n  padding: 1em;\n  margin: .5em 0;\n  overflow: auto;\n  border-radius: 0.3em; }\n\n:not(pre) > code[class*=\"language-\"],\npre[class*=\"language-\"] {\n  background-color: #fdf6e3;\n  /* base3 */ }\n\n/* Inline code */\n:not(pre) > code[class*=\"language-\"] {\n  padding: .1em;\n  border-radius: .3em; }\n\n.token.comment,\n.token.prolog,\n.token.doctype,\n.token.cdata {\n  color: #93a1a1;\n  /* base1 */ }\n\n.token.punctuation {\n  color: #586e75;\n  /* base01 */ }\n\n.token.namespace {\n  opacity: .7; }\n\n.token.property,\n.token.tag,\n.token.boolean,\n.token.number,\n.token.constant,\n.token.symbol,\n.token.deleted {\n  color: #268bd2;\n  /* blue */ }\n\n.token.selector,\n.token.attr-name,\n.token.string,\n.token.char,\n.token.builtin,\n.token.url,\n.token.inserted {\n  color: #2aa198;\n  /* cyan */ }\n\n.token.entity {\n  color: #657b83;\n  /* base00 */\n  background: #eee8d5;\n  /* base2 */ }\n\n.token.atrule,\n.token.attr-value,\n.token.keyword {\n  color: #859900;\n  /* green */ }\n\n.token.function,\n.token.class-name {\n  color: #b58900;\n  /* yellow */ }\n\n.token.regex,\n.token.important,\n.token.variable {\n  color: #cb4b16;\n  /* orange */ }\n\n.token.important,\n.token.bold {\n  font-weight: bold; }\n\n.token.italic {\n  font-style: italic; }\n\n.token.entity {\n  cursor: help; }\n";

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var prism = createCommonjsModule(function (module) {
    /* **********************************************
         Begin prism-core.js
    ********************************************** */

    var _self = (typeof window !== 'undefined')
    	? window   // if in browser
    	: (
    		(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
    		? self // if in worker
    		: {}   // if in node js
    	);

    /**
     * Prism: Lightweight, robust, elegant syntax highlighting
     * MIT license http://www.opensource.org/licenses/mit-license.php/
     * @author Lea Verou http://lea.verou.me
     */

    var Prism = (function (_self){

    // Private helper vars
    var lang = /\blang(?:uage)?-([\w-]+)\b/i;
    var uniqueId = 0;


    var _ = {
    	manual: _self.Prism && _self.Prism.manual,
    	disableWorkerMessageHandler: _self.Prism && _self.Prism.disableWorkerMessageHandler,
    	util: {
    		encode: function (tokens) {
    			if (tokens instanceof Token) {
    				return new Token(tokens.type, _.util.encode(tokens.content), tokens.alias);
    			} else if (Array.isArray(tokens)) {
    				return tokens.map(_.util.encode);
    			} else {
    				return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
    			}
    		},

    		type: function (o) {
    			return Object.prototype.toString.call(o).slice(8, -1);
    		},

    		objId: function (obj) {
    			if (!obj['__id']) {
    				Object.defineProperty(obj, '__id', { value: ++uniqueId });
    			}
    			return obj['__id'];
    		},

    		// Deep clone a language definition (e.g. to extend it)
    		clone: function deepClone(o, visited) {
    			var clone, id, type = _.util.type(o);
    			visited = visited || {};

    			switch (type) {
    				case 'Object':
    					id = _.util.objId(o);
    					if (visited[id]) {
    						return visited[id];
    					}
    					clone = {};
    					visited[id] = clone;

    					for (var key in o) {
    						if (o.hasOwnProperty(key)) {
    							clone[key] = deepClone(o[key], visited);
    						}
    					}

    					return clone;

    				case 'Array':
    					id = _.util.objId(o);
    					if (visited[id]) {
    						return visited[id];
    					}
    					clone = [];
    					visited[id] = clone;

    					o.forEach(function (v, i) {
    						clone[i] = deepClone(v, visited);
    					});

    					return clone;

    				default:
    					return o;
    			}
    		},

    		/**
    		 * Returns the Prism language of the given element set by a `language-xxxx` or `lang-xxxx` class.
    		 *
    		 * If no language is set for the element or the element is `null` or `undefined`, `none` will be returned.
    		 *
    		 * @param {Element} element
    		 * @returns {string}
    		 */
    		getLanguage: function (element) {
    			while (element && !lang.test(element.className)) {
    				element = element.parentElement;
    			}
    			if (element) {
    				return (element.className.match(lang) || [, 'none'])[1].toLowerCase();
    			}
    			return 'none';
    		},

    		/**
    		 * Returns the script element that is currently executing.
    		 *
    		 * This does __not__ work for line script element.
    		 *
    		 * @returns {HTMLScriptElement | null}
    		 */
    		currentScript: function () {
    			if (typeof document === 'undefined') {
    				return null;
    			}
    			if ('currentScript' in document) {
    				return document.currentScript;
    			}

    			// IE11 workaround
    			// we'll get the src of the current script by parsing IE11's error stack trace
    			// this will not work for inline scripts

    			try {
    				throw new Error();
    			} catch (err) {
    				// Get file src url from stack. Specifically works with the format of stack traces in IE.
    				// A stack will look like this:
    				//
    				// Error
    				//    at _.util.currentScript (http://localhost/components/prism-core.js:119:5)
    				//    at Global code (http://localhost/components/prism-core.js:606:1)

    				var src = (/at [^(\r\n]*\((.*):.+:.+\)$/i.exec(err.stack) || [])[1];
    				if (src) {
    					var scripts = document.getElementsByTagName('script');
    					for (var i in scripts) {
    						if (scripts[i].src == src) {
    							return scripts[i];
    						}
    					}
    				}
    				return null;
    			}
    		}
    	},

    	languages: {
    		extend: function (id, redef) {
    			var lang = _.util.clone(_.languages[id]);

    			for (var key in redef) {
    				lang[key] = redef[key];
    			}

    			return lang;
    		},

    		/**
    		 * Insert a token before another token in a language literal
    		 * As this needs to recreate the object (we cannot actually insert before keys in object literals),
    		 * we cannot just provide an object, we need an object and a key.
    		 * @param inside The key (or language id) of the parent
    		 * @param before The key to insert before.
    		 * @param insert Object with the key/value pairs to insert
    		 * @param root The object that contains `inside`. If equal to Prism.languages, it can be omitted.
    		 */
    		insertBefore: function (inside, before, insert, root) {
    			root = root || _.languages;
    			var grammar = root[inside];
    			var ret = {};

    			for (var token in grammar) {
    				if (grammar.hasOwnProperty(token)) {

    					if (token == before) {
    						for (var newToken in insert) {
    							if (insert.hasOwnProperty(newToken)) {
    								ret[newToken] = insert[newToken];
    							}
    						}
    					}

    					// Do not insert token which also occur in insert. See #1525
    					if (!insert.hasOwnProperty(token)) {
    						ret[token] = grammar[token];
    					}
    				}
    			}

    			var old = root[inside];
    			root[inside] = ret;

    			// Update references in other language definitions
    			_.languages.DFS(_.languages, function(key, value) {
    				if (value === old && key != inside) {
    					this[key] = ret;
    				}
    			});

    			return ret;
    		},

    		// Traverse a language definition with Depth First Search
    		DFS: function DFS(o, callback, type, visited) {
    			visited = visited || {};

    			var objId = _.util.objId;

    			for (var i in o) {
    				if (o.hasOwnProperty(i)) {
    					callback.call(o, i, o[i], type || i);

    					var property = o[i],
    					    propertyType = _.util.type(property);

    					if (propertyType === 'Object' && !visited[objId(property)]) {
    						visited[objId(property)] = true;
    						DFS(property, callback, null, visited);
    					}
    					else if (propertyType === 'Array' && !visited[objId(property)]) {
    						visited[objId(property)] = true;
    						DFS(property, callback, i, visited);
    					}
    				}
    			}
    		}
    	},
    	plugins: {},

    	highlightAll: function(async, callback) {
    		_.highlightAllUnder(document, async, callback);
    	},

    	highlightAllUnder: function(container, async, callback) {
    		var env = {
    			callback: callback,
    			container: container,
    			selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
    		};

    		_.hooks.run('before-highlightall', env);

    		env.elements = Array.prototype.slice.apply(env.container.querySelectorAll(env.selector));

    		_.hooks.run('before-all-elements-highlight', env);

    		for (var i = 0, element; element = env.elements[i++];) {
    			_.highlightElement(element, async === true, env.callback);
    		}
    	},

    	highlightElement: function(element, async, callback) {
    		// Find language
    		var language = _.util.getLanguage(element);
    		var grammar = _.languages[language];

    		// Set language on the element, if not present
    		element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;

    		// Set language on the parent, for styling
    		var parent = element.parentNode;
    		if (parent && parent.nodeName.toLowerCase() === 'pre') {
    			parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
    		}

    		var code = element.textContent;

    		var env = {
    			element: element,
    			language: language,
    			grammar: grammar,
    			code: code
    		};

    		function insertHighlightedCode(highlightedCode) {
    			env.highlightedCode = highlightedCode;

    			_.hooks.run('before-insert', env);

    			env.element.innerHTML = env.highlightedCode;

    			_.hooks.run('after-highlight', env);
    			_.hooks.run('complete', env);
    			callback && callback.call(env.element);
    		}

    		_.hooks.run('before-sanity-check', env);

    		if (!env.code) {
    			_.hooks.run('complete', env);
    			callback && callback.call(env.element);
    			return;
    		}

    		_.hooks.run('before-highlight', env);

    		if (!env.grammar) {
    			insertHighlightedCode(_.util.encode(env.code));
    			return;
    		}

    		if (async && _self.Worker) {
    			var worker = new Worker(_.filename);

    			worker.onmessage = function(evt) {
    				insertHighlightedCode(evt.data);
    			};

    			worker.postMessage(JSON.stringify({
    				language: env.language,
    				code: env.code,
    				immediateClose: true
    			}));
    		}
    		else {
    			insertHighlightedCode(_.highlight(env.code, env.grammar, env.language));
    		}
    	},

    	highlight: function (text, grammar, language) {
    		var env = {
    			code: text,
    			grammar: grammar,
    			language: language
    		};
    		_.hooks.run('before-tokenize', env);
    		env.tokens = _.tokenize(env.code, env.grammar);
    		_.hooks.run('after-tokenize', env);
    		return Token.stringify(_.util.encode(env.tokens), env.language);
    	},

    	matchGrammar: function (text, strarr, grammar, index, startPos, oneshot, target) {
    		for (var token in grammar) {
    			if (!grammar.hasOwnProperty(token) || !grammar[token]) {
    				continue;
    			}

    			var patterns = grammar[token];
    			patterns = Array.isArray(patterns) ? patterns : [patterns];

    			for (var j = 0; j < patterns.length; ++j) {
    				if (target && target == token + ',' + j) {
    					return;
    				}

    				var pattern = patterns[j],
    					inside = pattern.inside,
    					lookbehind = !!pattern.lookbehind,
    					greedy = !!pattern.greedy,
    					lookbehindLength = 0,
    					alias = pattern.alias;

    				if (greedy && !pattern.pattern.global) {
    					// Without the global flag, lastIndex won't work
    					var flags = pattern.pattern.toString().match(/[imsuy]*$/)[0];
    					pattern.pattern = RegExp(pattern.pattern.source, flags + 'g');
    				}

    				pattern = pattern.pattern || pattern;

    				// Don’t cache length as it changes during the loop
    				for (var i = index, pos = startPos; i < strarr.length; pos += strarr[i].length, ++i) {

    					var str = strarr[i];

    					if (strarr.length > text.length) {
    						// Something went terribly wrong, ABORT, ABORT!
    						return;
    					}

    					if (str instanceof Token) {
    						continue;
    					}

    					if (greedy && i != strarr.length - 1) {
    						pattern.lastIndex = pos;
    						var match = pattern.exec(text);
    						if (!match) {
    							break;
    						}

    						var from = match.index + (lookbehind && match[1] ? match[1].length : 0),
    						    to = match.index + match[0].length,
    						    k = i,
    						    p = pos;

    						for (var len = strarr.length; k < len && (p < to || (!strarr[k].type && !strarr[k - 1].greedy)); ++k) {
    							p += strarr[k].length;
    							// Move the index i to the element in strarr that is closest to from
    							if (from >= p) {
    								++i;
    								pos = p;
    							}
    						}

    						// If strarr[i] is a Token, then the match starts inside another Token, which is invalid
    						if (strarr[i] instanceof Token) {
    							continue;
    						}

    						// Number of tokens to delete and replace with the new match
    						delNum = k - i;
    						str = text.slice(pos, p);
    						match.index -= pos;
    					} else {
    						pattern.lastIndex = 0;

    						var match = pattern.exec(str),
    							delNum = 1;
    					}

    					if (!match) {
    						if (oneshot) {
    							break;
    						}

    						continue;
    					}

    					if(lookbehind) {
    						lookbehindLength = match[1] ? match[1].length : 0;
    					}

    					var from = match.index + lookbehindLength,
    					    match = match[0].slice(lookbehindLength),
    					    to = from + match.length,
    					    before = str.slice(0, from),
    					    after = str.slice(to);

    					var args = [i, delNum];

    					if (before) {
    						++i;
    						pos += before.length;
    						args.push(before);
    					}

    					var wrapped = new Token(token, inside? _.tokenize(match, inside) : match, alias, match, greedy);

    					args.push(wrapped);

    					if (after) {
    						args.push(after);
    					}

    					Array.prototype.splice.apply(strarr, args);

    					if (delNum != 1)
    						_.matchGrammar(text, strarr, grammar, i, pos, true, token + ',' + j);

    					if (oneshot)
    						break;
    				}
    			}
    		}
    	},

    	tokenize: function(text, grammar) {
    		var strarr = [text];

    		var rest = grammar.rest;

    		if (rest) {
    			for (var token in rest) {
    				grammar[token] = rest[token];
    			}

    			delete grammar.rest;
    		}

    		_.matchGrammar(text, strarr, grammar, 0, 0, false);

    		return strarr;
    	},

    	hooks: {
    		all: {},

    		add: function (name, callback) {
    			var hooks = _.hooks.all;

    			hooks[name] = hooks[name] || [];

    			hooks[name].push(callback);
    		},

    		run: function (name, env) {
    			var callbacks = _.hooks.all[name];

    			if (!callbacks || !callbacks.length) {
    				return;
    			}

    			for (var i=0, callback; callback = callbacks[i++];) {
    				callback(env);
    			}
    		}
    	},

    	Token: Token
    };

    _self.Prism = _;

    function Token(type, content, alias, matchedStr, greedy) {
    	this.type = type;
    	this.content = content;
    	this.alias = alias;
    	// Copy of the full string this token was created from
    	this.length = (matchedStr || '').length|0;
    	this.greedy = !!greedy;
    }

    Token.stringify = function(o, language) {
    	if (typeof o == 'string') {
    		return o;
    	}

    	if (Array.isArray(o)) {
    		return o.map(function(element) {
    			return Token.stringify(element, language);
    		}).join('');
    	}

    	var env = {
    		type: o.type,
    		content: Token.stringify(o.content, language),
    		tag: 'span',
    		classes: ['token', o.type],
    		attributes: {},
    		language: language
    	};

    	if (o.alias) {
    		var aliases = Array.isArray(o.alias) ? o.alias : [o.alias];
    		Array.prototype.push.apply(env.classes, aliases);
    	}

    	_.hooks.run('wrap', env);

    	var attributes = Object.keys(env.attributes).map(function(name) {
    		return name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
    	}).join(' ');

    	return '<' + env.tag + ' class="' + env.classes.join(' ') + '"' + (attributes ? ' ' + attributes : '') + '>' + env.content + '</' + env.tag + '>';
    };

    if (!_self.document) {
    	if (!_self.addEventListener) {
    		// in Node.js
    		return _;
    	}

    	if (!_.disableWorkerMessageHandler) {
    		// In worker
    		_self.addEventListener('message', function (evt) {
    			var message = JSON.parse(evt.data),
    				lang = message.language,
    				code = message.code,
    				immediateClose = message.immediateClose;

    			_self.postMessage(_.highlight(code, _.languages[lang], lang));
    			if (immediateClose) {
    				_self.close();
    			}
    		}, false);
    	}

    	return _;
    }

    //Get current script and highlight
    var script = _.util.currentScript();

    if (script) {
    	_.filename = script.src;

    	if (script.hasAttribute('data-manual')) {
    		_.manual = true;
    	}
    }

    if (!_.manual) {
    	function highlightAutomaticallyCallback() {
    		if (!_.manual) {
    			_.highlightAll();
    		}
    	}

    	// If the document state is "loading", then we'll use DOMContentLoaded.
    	// If the document state is "interactive" and the prism.js script is deferred, then we'll also use the
    	// DOMContentLoaded event because there might be some plugins or languages which have also been deferred and they
    	// might take longer one animation frame to execute which can create a race condition where only some plugins have
    	// been loaded when Prism.highlightAll() is executed, depending on how fast resources are loaded.
    	// See https://github.com/PrismJS/prism/issues/2102
    	var readyState = document.readyState;
    	if (readyState === 'loading' || readyState === 'interactive' && script && script.defer) {
    		document.addEventListener('DOMContentLoaded', highlightAutomaticallyCallback);
    	} else {
    		if (window.requestAnimationFrame) {
    			window.requestAnimationFrame(highlightAutomaticallyCallback);
    		} else {
    			window.setTimeout(highlightAutomaticallyCallback, 16);
    		}
    	}
    }

    return _;

    })(_self);

    if ( module.exports) {
    	module.exports = Prism;
    }

    // hack for components to work correctly in node.js
    if (typeof commonjsGlobal !== 'undefined') {
    	commonjsGlobal.Prism = Prism;
    }


    /* **********************************************
         Begin prism-markup.js
    ********************************************** */

    Prism.languages.markup = {
    	'comment': /<!--[\s\S]*?-->/,
    	'prolog': /<\?[\s\S]+?\?>/,
    	'doctype': {
    		pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:(?!<!--)[^"'\]]|"[^"]*"|'[^']*'|<!--[\s\S]*?-->)*\]\s*)?>/i,
    		greedy: true
    	},
    	'cdata': /<!\[CDATA\[[\s\S]*?]]>/i,
    	'tag': {
    		pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/i,
    		greedy: true,
    		inside: {
    			'tag': {
    				pattern: /^<\/?[^\s>\/]+/i,
    				inside: {
    					'punctuation': /^<\/?/,
    					'namespace': /^[^\s>\/:]+:/
    				}
    			},
    			'attr-value': {
    				pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/i,
    				inside: {
    					'punctuation': [
    						/^=/,
    						{
    							pattern: /^(\s*)["']|["']$/,
    							lookbehind: true
    						}
    					]
    				}
    			},
    			'punctuation': /\/?>/,
    			'attr-name': {
    				pattern: /[^\s>\/]+/,
    				inside: {
    					'namespace': /^[^\s>\/:]+:/
    				}
    			}

    		}
    	},
    	'entity': /&#?[\da-z]{1,8};/i
    };

    Prism.languages.markup['tag'].inside['attr-value'].inside['entity'] =
    	Prism.languages.markup['entity'];

    // Plugin to make entity title show the real entity, idea by Roman Komarov
    Prism.hooks.add('wrap', function(env) {

    	if (env.type === 'entity') {
    		env.attributes['title'] = env.content.replace(/&amp;/, '&');
    	}
    });

    Object.defineProperty(Prism.languages.markup.tag, 'addInlined', {
    	/**
    	 * Adds an inlined language to markup.
    	 *
    	 * An example of an inlined language is CSS with `<style>` tags.
    	 *
    	 * @param {string} tagName The name of the tag that contains the inlined language. This name will be treated as
    	 * case insensitive.
    	 * @param {string} lang The language key.
    	 * @example
    	 * addInlined('style', 'css');
    	 */
    	value: function addInlined(tagName, lang) {
    		var includedCdataInside = {};
    		includedCdataInside['language-' + lang] = {
    			pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
    			lookbehind: true,
    			inside: Prism.languages[lang]
    		};
    		includedCdataInside['cdata'] = /^<!\[CDATA\[|\]\]>$/i;

    		var inside = {
    			'included-cdata': {
    				pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
    				inside: includedCdataInside
    			}
    		};
    		inside['language-' + lang] = {
    			pattern: /[\s\S]+/,
    			inside: Prism.languages[lang]
    		};

    		var def = {};
    		def[tagName] = {
    			pattern: RegExp(/(<__[\s\S]*?>)(?:<!\[CDATA\[[\s\S]*?\]\]>\s*|[\s\S])*?(?=<\/__>)/.source.replace(/__/g, tagName), 'i'),
    			lookbehind: true,
    			greedy: true,
    			inside: inside
    		};

    		Prism.languages.insertBefore('markup', 'cdata', def);
    	}
    });

    Prism.languages.xml = Prism.languages.extend('markup', {});
    Prism.languages.html = Prism.languages.markup;
    Prism.languages.mathml = Prism.languages.markup;
    Prism.languages.svg = Prism.languages.markup;


    /* **********************************************
         Begin prism-css.js
    ********************************************** */

    (function (Prism) {

    	var string = /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/;

    	Prism.languages.css = {
    		'comment': /\/\*[\s\S]*?\*\//,
    		'atrule': {
    			pattern: /@[\w-]+[\s\S]*?(?:;|(?=\s*\{))/,
    			inside: {
    				'rule': /@[\w-]+/
    				// See rest below
    			}
    		},
    		'url': {
    			pattern: RegExp('url\\((?:' + string.source + '|[^\n\r()]*)\\)', 'i'),
    			inside: {
    				'function': /^url/i,
    				'punctuation': /^\(|\)$/
    			}
    		},
    		'selector': RegExp('[^{}\\s](?:[^{};"\']|' + string.source + ')*?(?=\\s*\\{)'),
    		'string': {
    			pattern: string,
    			greedy: true
    		},
    		'property': /[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,
    		'important': /!important\b/i,
    		'function': /[-a-z0-9]+(?=\()/i,
    		'punctuation': /[(){};:,]/
    	};

    	Prism.languages.css['atrule'].inside.rest = Prism.languages.css;

    	var markup = Prism.languages.markup;
    	if (markup) {
    		markup.tag.addInlined('style', 'css');

    		Prism.languages.insertBefore('inside', 'attr-value', {
    			'style-attr': {
    				pattern: /\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,
    				inside: {
    					'attr-name': {
    						pattern: /^\s*style/i,
    						inside: markup.tag.inside
    					},
    					'punctuation': /^\s*=\s*['"]|['"]\s*$/,
    					'attr-value': {
    						pattern: /.+/i,
    						inside: Prism.languages.css
    					}
    				},
    				alias: 'language-css'
    			}
    		}, markup.tag);
    	}

    }(Prism));


    /* **********************************************
         Begin prism-clike.js
    ********************************************** */

    Prism.languages.clike = {
    	'comment': [
    		{
    			pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
    			lookbehind: true
    		},
    		{
    			pattern: /(^|[^\\:])\/\/.*/,
    			lookbehind: true,
    			greedy: true
    		}
    	],
    	'string': {
    		pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
    		greedy: true
    	},
    	'class-name': {
    		pattern: /(\b(?:class|interface|extends|implements|trait|instanceof|new)\s+|\bcatch\s+\()[\w.\\]+/i,
    		lookbehind: true,
    		inside: {
    			'punctuation': /[.\\]/
    		}
    	},
    	'keyword': /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
    	'boolean': /\b(?:true|false)\b/,
    	'function': /\w+(?=\()/,
    	'number': /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
    	'operator': /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
    	'punctuation': /[{}[\];(),.:]/
    };


    /* **********************************************
         Begin prism-javascript.js
    ********************************************** */

    Prism.languages.javascript = Prism.languages.extend('clike', {
    	'class-name': [
    		Prism.languages.clike['class-name'],
    		{
    			pattern: /(^|[^$\w\xA0-\uFFFF])[_$A-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\.(?:prototype|constructor))/,
    			lookbehind: true
    		}
    	],
    	'keyword': [
    		{
    			pattern: /((?:^|})\s*)(?:catch|finally)\b/,
    			lookbehind: true
    		},
    		{
    			pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
    			lookbehind: true
    		},
    	],
    	'number': /\b(?:(?:0[xX](?:[\dA-Fa-f](?:_[\dA-Fa-f])?)+|0[bB](?:[01](?:_[01])?)+|0[oO](?:[0-7](?:_[0-7])?)+)n?|(?:\d(?:_\d)?)+n|NaN|Infinity)\b|(?:\b(?:\d(?:_\d)?)+\.?(?:\d(?:_\d)?)*|\B\.(?:\d(?:_\d)?)+)(?:[Ee][+-]?(?:\d(?:_\d)?)+)?/,
    	// Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
    	'function': /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
    	'operator': /--|\+\+|\*\*=?|=>|&&|\|\||[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?[.?]?|[~:]/
    });

    Prism.languages.javascript['class-name'][0].pattern = /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/;

    Prism.languages.insertBefore('javascript', 'keyword', {
    	'regex': {
    		pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(?:\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^/\\\[\r\n])+\/[gimyus]{0,6}(?=(?:\s|\/\*[\s\S]*?\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/,
    		lookbehind: true,
    		greedy: true
    	},
    	// This must be declared before keyword because we use "function" inside the look-forward
    	'function-variable': {
    		pattern: /#?[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/,
    		alias: 'function'
    	},
    	'parameter': [
    		{
    			pattern: /(function(?:\s+[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)?\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\))/,
    			lookbehind: true,
    			inside: Prism.languages.javascript
    		},
    		{
    			pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=>)/i,
    			inside: Prism.languages.javascript
    		},
    		{
    			pattern: /(\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*=>)/,
    			lookbehind: true,
    			inside: Prism.languages.javascript
    		},
    		{
    			pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\s*)\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*\{)/,
    			lookbehind: true,
    			inside: Prism.languages.javascript
    		}
    	],
    	'constant': /\b[A-Z](?:[A-Z_]|\dx?)*\b/
    });

    Prism.languages.insertBefore('javascript', 'string', {
    	'template-string': {
    		pattern: /`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}|(?!\${)[^\\`])*`/,
    		greedy: true,
    		inside: {
    			'template-punctuation': {
    				pattern: /^`|`$/,
    				alias: 'string'
    			},
    			'interpolation': {
    				pattern: /((?:^|[^\\])(?:\\{2})*)\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}/,
    				lookbehind: true,
    				inside: {
    					'interpolation-punctuation': {
    						pattern: /^\${|}$/,
    						alias: 'punctuation'
    					},
    					rest: Prism.languages.javascript
    				}
    			},
    			'string': /[\s\S]+/
    		}
    	}
    });

    if (Prism.languages.markup) {
    	Prism.languages.markup.tag.addInlined('script', 'javascript');
    }

    Prism.languages.js = Prism.languages.javascript;


    /* **********************************************
         Begin prism-file-highlight.js
    ********************************************** */

    (function () {
    	if (typeof self === 'undefined' || !self.Prism || !self.document || !document.querySelector) {
    		return;
    	}

    	/**
    	 * @param {Element} [container=document]
    	 */
    	self.Prism.fileHighlight = function(container) {
    		container = container || document;

    		var Extensions = {
    			'js': 'javascript',
    			'py': 'python',
    			'rb': 'ruby',
    			'ps1': 'powershell',
    			'psm1': 'powershell',
    			'sh': 'bash',
    			'bat': 'batch',
    			'h': 'c',
    			'tex': 'latex'
    		};

    		Array.prototype.slice.call(container.querySelectorAll('pre[data-src]')).forEach(function (pre) {
    			// ignore if already loaded
    			if (pre.hasAttribute('data-src-loaded')) {
    				return;
    			}

    			// load current
    			var src = pre.getAttribute('data-src');

    			var language, parent = pre;
    			var lang = /\blang(?:uage)?-([\w-]+)\b/i;
    			while (parent && !lang.test(parent.className)) {
    				parent = parent.parentNode;
    			}

    			if (parent) {
    				language = (pre.className.match(lang) || [, ''])[1];
    			}

    			if (!language) {
    				var extension = (src.match(/\.(\w+)$/) || [, ''])[1];
    				language = Extensions[extension] || extension;
    			}

    			var code = document.createElement('code');
    			code.className = 'language-' + language;

    			pre.textContent = '';

    			code.textContent = 'Loading…';

    			pre.appendChild(code);

    			var xhr = new XMLHttpRequest();

    			xhr.open('GET', src, true);

    			xhr.onreadystatechange = function () {
    				if (xhr.readyState == 4) {

    					if (xhr.status < 400 && xhr.responseText) {
    						code.textContent = xhr.responseText;

    						Prism.highlightElement(code);
    						// mark as loaded
    						pre.setAttribute('data-src-loaded', '');
    					}
    					else if (xhr.status >= 400) {
    						code.textContent = '✖ Error ' + xhr.status + ' while fetching file: ' + xhr.statusText;
    					}
    					else {
    						code.textContent = '✖ Error: File does not exist or is empty';
    					}
    				}
    			};

    			xhr.send(null);
    		});
    	};

    	document.addEventListener('DOMContentLoaded', function () {
    		// execute inside handler, for dropping Event as argument
    		self.Prism.fileHighlight();
    	});

    })();
    });

    function ContentTransform(ast) {
        return "\n        <style>" + (mainStyle + baseStyle + prismStyle) + "</style>\n        <div class=\"my-markdown_content\">\n            " + ast.children.map(BlockTransform).join('') + "\n        </div>\n        \n    ";
    }
    function BlockTransform(ast) {
        switch (ast.type) {
            case AST_TYPE.HEAD_BLOCK: return HeadBlockTransform(ast);
            case AST_TYPE.REFER_BLOCK: return ReferBlockTransform(ast);
            case AST_TYPE.CODE_BLOCK: return CodeBlockTransform(ast);
            case AST_TYPE.LIST_BLOCK: return ListBlockTransform(ast);
            case AST_TYPE.PARAGRAPH: return ParagraphTransform(ast);
            default: return ParagraphTransform(ast);
        }
    }
    function HeadBlockTransform(ast) {
        return "\n        <h" + ast.level + " class=\"my-markdown_block my-markdown_block__head\">\n            " + TextTransform(ast.children) + "\n        </h" + ast.level + ">\n    ";
    }
    function ReferBlockTransform(ast) {
        return "\n        <blockquote class=\"my-markdown_block my-markdown_block__refer\">\n            " + ReferTextTransform(ast.children) + "\n        </blockquote>\n    ";
    }
    function CodeBlockTransform(ast) {
        var code = prism.highlight(ast.text, prism.languages[ast.language], ast.language);
        return "\n        <pre class=\"my-markdown_block my-markdown_block__" + ast.language + "-code language-" + ast.language + "\"><code class=\"language-" + ast.language + "\">" + code + "</code></pre>\n    ";
    }
    function ListBlockTransform(ast) {
        var tag = ast.ordered ? 'ol' : 'ul';
        var listSuffix = ast.ordered ? 'ordered-list' : 'unordered-list';
        return "\n        <" + tag + " class=\"my-markdown_block my-markdown_block__list___" + listSuffix + "\">\n            " + ast.children.map(ListItemTransform).join('') + "\n        </" + tag + ">\n    ";
    }
    function ListItemTransform(ast) {
        return "<li>" + TextTransform(ast.children) + "</li>";
    }
    function ParagraphTransform(ast) {
        return "\n        <p class=\"my-markdown_block my-markdown_block__paragraph\">\n            " + TextTransform(ast.children) + "\n        </p>\n    ";
    }
    function BasicTextTransform(ast) {
        switch (ast.type) {
            case AST_TYPE.CODE_TEXT: return CodeTextTransform(ast);
            case AST_TYPE.BOLD_TEXT: return BoldTextTransform(ast);
            case AST_TYPE.ITALIC_TEXT: return ItalicTextTransform(ast);
            case AST_TYPE.LINK: return LinkTransform(ast);
            case AST_TYPE.IMAGE: return ImageTransform(ast);
            case AST_TYPE.NORMAL_TEXT: return NormalTextTransform(ast);
            default: return NormalTextTransform(ast);
        }
    }
    function ReferTextTransform(ast) {
        return ast.children.map(function (text) {
            if (text.type === AST_TYPE.REFER_NEWLINE) {
                return "<br/>";
            }
            return BasicTextTransform(text);
        }).join('');
    }
    function TextTransform(ast) {
        return ast.children.map(BasicTextTransform).join('');
    }
    function CodeTextTransform(ast) {
        return "<code>" + ast.text + "</code>";
    }
    function BoldTextTransform(ast) {
        return "<strong>" + ast.text + "</strong>";
    }
    function ItalicTextTransform(ast) {
        return "<em>" + ast.text + "</em>";
    }
    function LinkTransform(ast) {
        return "<a href=\"" + ast.url + "\" target=\"__blank\">" + ast.text + "</a>";
    }
    function ImageTransform(ast) {
        return "<img src=\"" + ast.url + "\" alt=\"" + ast.alt + "\"/>";
    }
    function NormalTextTransform(ast) {
        return ast.text;
    }
    function CodeTransform(ast) {
        var html = '';
        html += ContentTransform(ast);
        return html;
    }

    var machine = new Machine({
        entry: {
            key: 'start_state',
            transitions: [
                {
                    char: '\r',
                    target: NEWLINE_STATES.newline_a.key
                },
                {
                    char: '\n',
                    target: NEWLINE_STATES.newline_b.key
                },
                {
                    char: '#',
                    target: HEADER_IDENTIFIER_STATES.header_s.key
                },
                {
                    char: '[\\u2002\\u2003\\u00a0\\u3000\\u0020]',
                    regExp: true,
                    target: WHITE_SPACE_STATES.whiteSpace_a.key
                },
                {
                    char: '`',
                    target: CODE_DOT_STATES.code_dot_a.key
                },
                {
                    char: '*',
                    target: TEXT_STYLE_STATES.text_style_a.key,
                },
                {
                    char: '[',
                    target: LEFT_BRACKET_STATE.left_bracket_a.key,
                },
                {
                    char: ']',
                    target: RIGHT_BRACKET_STATE.right_bracket_a.key,
                },
                {
                    char: '(',
                    target: LEFT_PARENTHESES_STATE.left_parentheses_a.key,
                },
                {
                    char: ')',
                    target: RIGHT_PARENTHESES_STATE.right_parentheses_a.key,
                },
                {
                    char: '!',
                    target: CLAM_STATE.clam_a.key,
                },
                {
                    char: '>',
                    target: REFER_STATE.refer_a.key,
                },
                {
                    char: '\\d',
                    regExp: true,
                    target: LIST_NUMBER_INDEX_STATES.list_number_index_a.key,
                },
                {
                    char: '-',
                    target: LIST_SYMBOL_INDEX_STATES.list_symbol_index_a.key,
                }
            ]
        },
        states: __spreadArrays(Object.values(NEWLINE_STATES), Object.values(HEADER_IDENTIFIER_STATES), Object.values(WHITE_SPACE_STATES), Object.values(CODE_DOT_STATES), Object.values(TEXT_STYLE_STATES), Object.values(LEFT_BRACKET_STATE), Object.values(RIGHT_BRACKET_STATE), Object.values(LEFT_PARENTHESES_STATE), Object.values(RIGHT_PARENTHESES_STATE), Object.values(CLAM_STATE), Object.values(REFER_STATE), Object.values(LIST_NUMBER_INDEX_STATES), Object.values(LIST_SYMBOL_INDEX_STATES))
    });
    function transform(source) {
        if (!source) {
            return '';
        }
        var scanner = new Scanner({
            input: source,
            machine: machine,
        });
        var parser = new Parser({
            scanner: scanner,
        });
        return CodeTransform(parser.parse());
    }

    return transform;

})));
