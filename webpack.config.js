import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import WebExtensionPlugin from 'webpack-target-webextension'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import { isNotJunk } from 'junk'

import packageJson from './package.json' assert {type: 'json'}


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const config = {
  entry: {
    content: path.join(__dirname, 'src', 'pages', 'content', 'index.tsx'),
    background: path.join(__dirname, 'src', 'pages', 'background', 'index.ts'),
    options: path.join(__dirname, 'src', 'pages', 'options', 'index.tsx'),
  },

  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    environment: {
      dynamicImport: true,
    }
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: [
          path.resolve(__dirname, 'src'),
        ],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                ['@babel/preset-react', { runtime: 'automatic' }],
                '@babel/preset-typescript',
              ],
              plugins: [
                ['i18next-extract', {
                  locales: fs.readdirSync(path.join(__dirname, 'src', 'common', 'locales')).filter(isNotJunk),
                  outputPath: path.resolve(__dirname, 'src', 'common', 'locales', '{{locale}}', '{{ns}}.json'),
                  defaultValue: null,
                  useI18nextDefaultValue: true,
                  discardOldKeys: true,
                }],
              ],
            },
          },
        ],
      },

      {
        test: /\.scss$/,
        include: [
          path.resolve(__dirname, 'src'),
        ],
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                exportLocalsConvention: 'camelCaseOnly',
                localIdentHashSalt: packageJson.version,
              },
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  ['@csstools/postcss-sass', { outputStyle: 'compressed' }],
                  'autoprefixer',
                ],
              },
            },
          },
        ],
      },

      {
        test: /\.svg$/,
        include: [
          path.resolve(__dirname, 'src', 'assets', 'icons'),
        ],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                ['@babel/preset-react', { runtime: 'automatic' }],
              ],
            },
          },
          {
            loader: '@svgr/webpack',
            options: {
              babel: false,
              icon: true,
            },
          },
        ],
      },

      {
        test: /\.html$/,
        include: [
          path.resolve(__dirname, 'src'),
        ],
        use: [
          'html-loader',
        ],
      },

    ],
  },

  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname, 'src', 'manifest.json'),
          transform(content) {
            return JSON.stringify({
              ...JSON.parse(content.toString()),
              version: packageJson.version,
              description: packageJson.description
            }, null, 2)
          }
        },
        {
          from: path.join(__dirname, 'icons'),
        },
        {
          from: path.join(__dirname, 'src', 'assets'),
          to: 'assets',
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'pages', 'options', 'index.html'),
      filename: 'options.html',
      chunks: ['options'],
    }),
    new WebExtensionPlugin({
      weakRuntimeCheck: true,
    }),
  ],

  resolve: {
    extensions: ['.js', '.ts', '.tsx']
  },
}

export default config
