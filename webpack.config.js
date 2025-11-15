const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    // Create separate entry points for each component to make them independent
    entry: {
      'Button/index': './src/ui/Button/index.js',
      'Card/index': './src/ui/Card/index.js',
      main: './src/ui/index.js', // Optional: main entry for all components
    },
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: (pathData) => {
        const chunkName = pathData.chunk.name;
        const hash = isProduction ? '.[contenthash:8]' : '';
        
        // Handle entry points like 'Button/index' -> 'Button/index.js'
        if (chunkName && chunkName.includes('/')) {
          return `${chunkName}${hash}.js`;
        }
        
        // Check if it's a UI component chunk (Button, Card, etc.)
        if (chunkName && chunkName !== 'index' && chunkName !== 'vendor' && chunkName !== 'common') {
          return `${chunkName}/${chunkName}${hash}.js`;
        }
        
        // Default structure for other chunks
        return isProduction
          ? '[name].[contenthash:8].js'
          : '[name].js';
      },
      chunkFilename: (pathData) => {
        const chunkName = pathData.chunk.name;
        if (chunkName && chunkName !== 'index' && chunkName !== 'vendor' && chunkName !== 'common') {
          const hash = isProduction ? '.[contenthash:8]' : '';
          return `${chunkName}/${chunkName}${hash}.chunk.js`;
        }
        return isProduction
          ? '[name].[contenthash:8].chunk.js'
          : '[name].chunk.js';
      },
      assetModuleFilename: 'static/media/[name].[hash][ext]',
      clean: true,
      publicPath: '/',
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json'],
    },
    externals: {
      react: {
        commonjs: 'react',
        commonjs2: 'react',
        amd: 'react',
        root: 'React',
      },
      'react-dom': {
        commonjs: 'react-dom',
        commonjs2: 'react-dom',
        amd: 'react-dom',
        root: 'ReactDOM',
      },
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              // Babel config will be read from .babelrc
            },
            {
              loader: '@wyw-in-js/webpack-loader',
              options: {
                sourceMap: !isProduction,
                configFile: './wyw-in-js.config.js',
              },
            },
          ],
        },
        // Regular CSS files (including Linaria-generated CSS)
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg|ico)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },
      ],
    },
    plugins: [
      ...(isProduction
        ? [
            new MiniCssExtractPlugin({
              filename: (pathData) => {
                // Organize CSS files by component folder structure
                const chunkName = pathData.chunk.name;
                if (chunkName && chunkName !== 'index' && chunkName !== 'vendor' && chunkName !== 'common') {
                  return `${chunkName}/${chunkName}.[contenthash:8].css`;
                }
                return '[name].[contenthash:8].css';
              },
              chunkFilename: (pathData) => {
                const chunkName = pathData.chunk.name;
                if (chunkName && chunkName !== 'index' && chunkName !== 'vendor' && chunkName !== 'common') {
                  return `${chunkName}/${chunkName}.[contenthash:8].css`;
                }
                return '[name].[contenthash:8].css';
              },
              ignoreOrder: true,
            }),
            // Force source map generation for all chunks, including small empty chunks
            new webpack.SourceMapDevToolPlugin({
              filename: '[file].map',
              append: '\n//# sourceMappingURL=[url]',
              moduleFilenameTemplate: 'webpack://[namespace]/[resource-path]?[loaders]',
              exclude: ['/node_modules/'],
              noSources: false,
            }),
          ]
        : []),
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
      },
      compress: true,
      port: 3000,
      hot: true,
      historyApiFallback: true,
      open: true,
    },
    // Use SourceMapDevToolPlugin instead of devtool for more control
    devtool: false,
    optimization: {
      minimize: isProduction,
      usedExports: true, // Enable tree-shaking
      sideEffects: true, // Check sideEffects in package.json
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 20,
          },
          // Disable common chunk to make each component completely independent
          // common: {
          //   name: 'common',
          //   minChunks: 2,
          //   chunks: 'all',
          //   priority: 10,
          //   reuseExistingChunk: true,
          //   enforce: true,
          // },
          // Generate separate CSS files for each component in src/ui
          uiButton: {
            name: 'Button',
            test: /[\\/]src[\\/]ui[\\/]Button[\\/]/,
            chunks: 'all',
            priority: 30,
            enforce: true,
          },
          uiCard: {
            name: 'Card',
            test: /[\\/]src[\\/]ui[\\/]Card[\\/]/,
            chunks: 'all',
            priority: 30,
            enforce: true,
          },
        },
      },
    },
  };
};

