import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.browser.js',
      format: 'umd',
      name: 'VTubersUtils',
      sourcemap: true,
      globals: {
        tslib: 'tslib'
      }
    },
    {
      file: 'dist/index.browser.min.js',
      format: 'umd',
      name: 'VTubersUtils',
      sourcemap: true,
      plugins: [terser()],
      globals: {
        tslib: 'tslib'
      }
    },
    {
      file: 'dist/index.esm.js',
      format: 'es',
      sourcemap: true
    }
  ],
  plugins: [
    replace({
      preventAssignment: true,
      values: {
        'process.env.BROWSER': JSON.stringify(true)
      }
    }),
    nodeResolve({
      browser: true,
      preferBuiltins: false,
      extensions: ['.ts', '.js']
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      sourceMap: true,
      compilerOptions: {
        paths: {
          './utils/file': ['./src/utils/file.browser.ts']
        }
      }
    })
  ],
  external: ['fs', 'path', 'crypto', 'os', 'tslib']
};

export default config;
