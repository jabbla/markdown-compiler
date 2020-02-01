import Scanner from './scanner';
import { IBasicToken, TOKEN_TYPE } from './token';
import genAst from './syntax';

interface IParserOptions {
    scanner: Scanner;
}

export default class Parser {
    private scanner: Scanner;
    private tokens: IBasicToken[];
    private index: number;
    private ast: any;

    constructor(options: IParserOptions) {
        this.scanner = options.scanner;
        this.index = 0;
    }

    public parse() {
        const tokens = this.scanner.run();
        this.tokens = [
            {
                tokenType: TOKEN_TYPE.NEWLINE,
                lexeme: '',
            },
            ...tokens,
            {
                tokenType: TOKEN_TYPE.NEWLINE,
                lexeme: '\n\n',
            }
        ];
        this.ast = genAst(this);
        return this.ast;
    }

    public consume() {
        return this.tokens[this.index++];
    }

    public back() {
        this.index = this.index - 1;
    }

    public lookAhead(offset = 0) {
        return this.tokens[this.index + offset];
    }

    public isComplete() {
        return this.index >= this.tokens.length;
    }

    public getIndex() {
        return this.index;
    }

    public setIndex(index: number) {
        this.index = index;
    }

    public match(option: {
        originIndex: number,
        tokenType: TOKEN_TYPE,
        count?: number,
        lexeme?: string,
    }) {
        const { originIndex, tokenType, lexeme } = option;
        let count = option.count > 1 ? option.count : 1;
        let token;

        for(let i = 0; i < count; i++) {
            token = this.consume();
            if(token?.tokenType !== tokenType || (typeof lexeme === 'undefined'? false : lexeme !== token.lexeme)) {
                this.setIndex(originIndex);
                return false;
            }
        }

        return true;
    }

    public matchUntil(option: {
        originIndex: number,
        endToken: TOKEN_TYPE | TOKEN_TYPE[],
        errorToken: TOKEN_TYPE
    }) {
        const { originIndex, endToken, errorToken } = option;
        let token = this.consume();
        let text = '';
        let consumed = false;

        const isEndToken = (token: IBasicToken) => {
            if(endToken instanceof Array) {
                return (endToken as TOKEN_TYPE[]).every((end, index) => {
                    if(index === 0) {
                        return end === token.tokenType;
                    }
                    return end === this.lookAhead(index - 1)?.tokenType;
                });
            } 
            
            return token.tokenType === endToken;
        }

        while(token && !isEndToken(token)) {
            consumed = true;
            text += token.lexeme;
            token = this.consume();
            if(!token || token.tokenType === errorToken) {
                this.setIndex(originIndex);
                return false;
            }
        }

        if(!consumed) {
            this.setIndex(originIndex);
        }

        return text;
    }
}
