import babel from 'rollup-plugin-babel';
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import scss from 'rollup-plugin-scss';

export default {
    input: './src/main.ts',
    output: {
        file: './dist/md-compiler.js',
        format: 'umd',
        name: 'compileMarkdown',
    },
    plugins: [
        resolve(),
        commonjs(),
        scss({
            output: false,
        }),
        typescript(),
        babel({
            exclude: ['node_modules/**'],
            runtimeHelpers: true
        }),
    ]
}