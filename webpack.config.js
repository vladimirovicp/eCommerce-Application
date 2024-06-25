const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const EslintPlugin = require('eslint-webpack-plugin');

module.exports = (env, argv) => {
  const mode = argv.mode || 'development';
  const isDevelopment = mode === 'development';
  const devtool = isDevelopment ? 'source-map' : undefined;
  return {
    mode,
    devtool,
    entry: './src/app.ts',
    module: {
      rules: [
        {
          test: /\.ts$/,
          include: [path.resolve(__dirname, 'src')],
          use: 'ts-loader',
        },
        {
          test: /\.(jpg|png|svg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(css|scss)$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src/index.html'),
        favicon: path.resolve(__dirname, 'src/assets/img/favicon.ico'),
        filename: 'index.html',
      }),
      new EslintPlugin({ extensions: ['ts'] }),
    ],
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
      assetModuleFilename: 'assets/[hash][ext]',
      publicPath: '/',
    },
    devServer: {
      static: path.join(__dirname, 'src'),
      compress: true,
      port: 9000,
      open: true,
      // historyApiFallback: true,
      historyApiFallback: {
        index: '/',
      },
    },
  };
};
