//生产环境
const {
  resolve
} = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
module.exports = {
  //入口
  entry: './src/js/index.js',
  //出口
  output: {
    filename: 'js/main.js',
    path: resolve(__dirname, 'dist')
  },
  //规则
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'eslint-loader',
      options: {
        //修复eslint的错误
        fix: true
      }
    }, {
      oneOf: [{
        test: /\.css$/,
        //打包成单个文件
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }, {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
      }, {
        test: /\.(jpg|png)$/,
        loader: 'url-loader',
        options: {
          limit: 8 * 1024,
          esModule: false,
          name: '[hash:10].[ext]'
        }
      }, {
        test: /\.html$/,
        loader: 'html-loader',
        options: {
          name: '[hash:10],[ext]'
        }
      }, {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',

      }]
    }]
  },
  //插件
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: {
        //移除空格
        collapseWhitespace: true,
        //移除注释
        removeComments: true
      }
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    }),
    new OptimizeCssAssetsWebpackPlugin()
  ],
  mode: 'development',
  devServer: {
    compress: true,
    port: 3000,
    open: true,
    //开启HMR
    hot: true
  },
  devtool: 'eval-source-map'
}