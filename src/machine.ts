import * as _ from './utils';
import { IBasicToken, TOKEN_TYPE } from './token';

interface ITransition {
    char: string;
    regExp?: boolean;
    target: string;
}

interface IState {
    key: string;
    transitions?: ITransition[];
    accept?: boolean;
    onAccept?: (s: string) => IBasicToken;
}

interface IMachineOptions {
    entry: IState;
    states: IState[];
    on?: {
        error?: (s: string) => void;
        accept?: (s: string) => void;
    }
}

interface IScannerSignal {
    scanner_continue: boolean;
    back_step?: number;
    token: IBasicToken;
}

export class Machine {
    private entry: IState;

    private states: IState[];

    private indexedStates: {
        [key: string]: IState;
    };

    private current: IState;

    private buffer: string[];

    private options: IMachineOptions;

    constructor(options: IMachineOptions) {
        const { states } = options;

        this.states = states;
        this.indexedStates = states.reduce((prev, cur) => {
            prev[cur.key] = cur;
            return prev;
        }, {} as any);
        this.entry = options.entry;
        this.current = this.entry;
        this.buffer = [];

        this.options = options;
    }

    public input(char?: string) {
        const endFile = typeof char === 'undefined';
        this.buffer.push(char);
        
        const currentTransitions = this.current.transitions || [];
        const transition = currentTransitions.find(transition => {
            const { regExp, char: transitionChar } = transition;
            return regExp? new RegExp(transitionChar).test(char) : char === transitionChar;
        });

        if(!transition || endFile) {
            return this.current.accept ? this.accept() : this.error(endFile);
        }

        const targetState = this.indexedStates[transition.target];
        if(!targetState) {
            throw new Error(`未找到 key 为 ${JSON.stringify(transition.target)} 的状态！`);
        }

        this.current = targetState;
    }

    private error(endFile: boolean): IScannerSignal {
        const { on } = this.options;
        const bufferString = (endFile? this.buffer.slice(0, -1) : this.buffer).join('');

        this.reset();

        if(on && on.error) {
            on.error(bufferString);
        }

        /**
         * 错误状态只接收buffer中的第一个字符，其它的字符重新再流经词法状态机
         */
        const back_step = bufferString.length - 1 > 1? (bufferString.length - 1) : 1;
        const scanner_continue = endFile || bufferString.length === 1;
        return {
            scanner_continue,
            back_step, 
            token: {
                tokenType: TOKEN_TYPE.ORDINARY_TEXT,
                lexeme: endFile? bufferString : bufferString[0],
            }
        };
    }

    private accept(): IScannerSignal {
        const { on } = this.options;
        const bufferString = this.buffer.slice(0, -1).join('');
        const current = this.current;
        this.reset();

        if(on && on.accept) {
            on.accept(bufferString);
        }

        return {
            scanner_continue: false,
            token: current.onAccept(bufferString)
        };
    }

    private reset() {
        this.buffer = [];
        this.current = this.entry;
    }
}