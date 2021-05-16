import resolve from 'rollup-plugin-node-resolve';
import serve from "rollup-plugin-serve";
import livereload from 'rollup-plugin-livereload'; 
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";
import htmlTemplate from 'rollup-plugin-generate-html-template';
import typescript from "rollup-plugin-typescript2";


import pkg from './package.json';

const isDev = process.env.NODE_ENV !== 'production';

const sourcemap = isDev ? true : false;

let plugins = [];
if (isDev) {
    plugins = [
        serve({
            port: 3007,
            // open: true,
            openPage: '/',
            host: '0.0.0.0',
            contentBase: ['dist', 'src', '/']
        }),
        htmlTemplate({
            template: 'index.html',
            target: 'index.html'
        }),
        livereload()
    ]
} else {
    plugins = [ terser() ]
}

export default {
    input: 'src/core.ts',
    output: [
        { name: "CompressImage", file: pkg.unpkg, format: 'umd', sourcemap },
        { name: "CompressImage", file: pkg.module, format: 'es', sourcemap },
    ],
    plugins: [
        resolve(), // 引用commonjs模块时需要
        babel({
            exclude: 'node_modules/**', // 防止打包node_modules下的文件
            runtimeHelpers: true,       // 使plugin-transform-runtime生效
        }),
        commonjs(), // 引用commonjs模块时需要
        typescript({
            exclude: "node_modules/**",
            declarationDir: process.cwd()
        }),
        ...plugins
    ]
}
