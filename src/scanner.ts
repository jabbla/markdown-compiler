import { Machine } from './machine';

interface IScannerOptions {
    input: string;
    machine: Machine;
}

export default class Scanner {
    private input: any[];

    private machine: Machine;

    constructor(options: IScannerOptions) {
        const { input, machine } = options;

        this.input = input.split('');
        this.machine = machine;
    }

    public run() {
        const tokens = [];
        for(let i = 0; i <= this.input.length; i++) {
            const char = this.input[i];
            const signal = this.machine.input(char);
            if(signal) {
                tokens.push(signal.token);
                if(!signal.scanner_continue) {
                    i = i -  (signal.back_step || 1)
                }
            }
            
        }
        return tokens;
    }
}