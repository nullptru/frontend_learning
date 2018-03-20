const path = require('path');

module.exports = {
  entry: __dirname + "/index.js",
  output: {
      filename: "bundle.js"
  },
  module: {
      rules: [
          {
              test: /(\.jsx|\.js)$/,
              exclude: path.resolve(__dirname, 'node_modules'),
              loader: "babel-loader",
          }
      ]
  },
  resolve: {
    // 使用的扩展名
    extensions: [".js", ".json", ".jsx", ".css"],
  },
  devtool: 'eval-source-map',
  devServer: {
      contentBase: "./public",//本地服务器所加载的页面所在的目录
      historyApiFallback: true,//不跳转
      inline: true//实时刷新
  },
};