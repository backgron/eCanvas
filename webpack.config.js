//开发环境
const {
  resolve
} = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  //入口  默认  可修改
  entry: './src/js/index.js',
  //出口  默认 可修改
  output: {
    filename: 'js/eCanvas.js',
    path: resolve(__dirname, 'dist')
  },
  // 模块 loader的配置
  module: {
    rules: [{
        test: /\.css$/,
        use: [
          'style-loader', 'css-loader',
        ]
      },
      //具体的 loader 配置
      {
        // 匹配文件
        test: /\.less$/,
        //使用那些loader
        // //如果只有一个：
        // loader: 'style-loader',
        //如果有多个
        use: [
          'style-loader', 'css-loader', 'less-loader',
        ],
      },
      {
        //css中的图片
        test: /\.(jpg|png|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 8 * 1024,
          esModule: false,
          name: '[hash:10].[ext]'
        }
      },
      {
        //html中的图片
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        //其他资源
        exclude: /\.(css|js|html|less|jpg)$/,
        loader: 'file-loader',
        options: {
          name: '[hash:10].[ext]'
        }
      }
    ]
  },
  //插件
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: true
    })
  ],
  //打包类型
  mode: 'development',
  devServer: {
    //项目构建后的路径
    contentBase: resolve(__dirname, 'dist'),
    //启动gzip压缩
    compress: true,
    //端口号
    port: 3000,
    //自动打开浏览器
    open: true
  }
}