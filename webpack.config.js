const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    // Enable ES modules output for tree-shaking
    experiments: {
      outputModule: true,
    },
    // Create separate entry points for each component to make them independent
    entry: {
      'Button/index': './src/ui/Button/index.js',
      'Card/index': './src/ui/Card/index.js',
      main: './src/ui/index.js', // Optional: main entry for all components
    },
    output: {
      path: path.resolve(__dirname, 'build'),
      // Output ES modules format for tree-shaking support
      module: true,
      library: {
        type: 'module',
      },
      environment: {
        module: true,
      },
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
      // For ES modules output, use module type externals
      react: {
        module: 'react',
        commonjs: 'react',
        commonjs2: 'react',
        amd: 'react',
        root: 'React',
      },
      'react-dom': {
        module: 'react-dom',
        commonjs: 'react-dom',
        commonjs2: 'react-dom',
        amd: 'react-dom',
        root: 'ReactDOM',
      },
      // Externalize jsx-runtime for cleaner ES modules output
      'react/jsx-runtime': {
        module: 'react/jsx-runtime',
        commonjs: 'react/jsx-runtime',
        commonjs2: 'react/jsx-runtime',
      },
      'react/jsx-dev-runtime': {
        module: 'react/jsx-dev-runtime',
        commonjs: 'react/jsx-dev-runtime',
        commonjs2: 'react/jsx-dev-runtime',
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
                const chunkName = pathData.chunk.name;
                const hash = isProduction ? '.[contenthash:8]' : '';
                
                // Handle entry points like 'Button/index' -> 'Button/index.css'
                if (chunkName && chunkName.includes('/')) {
                  return `${chunkName}${hash}.css`;
                }
                
                // Check if it's a UI component chunk (Button, Card, etc.)
                if (chunkName && chunkName !== 'index' && chunkName !== 'vendor' && chunkName !== 'common') {
                  return `${chunkName}/${chunkName}${hash}.css`;
                }
                
                // Default structure for other chunks
                return isProduction
                  ? '[name].[contenthash:8].css'
                  : '[name].css';
              },
              chunkFilename: (pathData) => {
                const chunkName = pathData.chunk.name;
                const hash = isProduction ? '.[contenthash:8]' : '';
                
                // Handle entry points like 'Button/index' -> 'Button/index.css'
                if (chunkName && chunkName.includes('/')) {
                  return `${chunkName}${hash}.css`;
                }
                
                if (chunkName && chunkName !== 'index' && chunkName !== 'vendor' && chunkName !== 'common') {
                  return `${chunkName}/${chunkName}${hash}.css`;
                }
                return isProduction
                  ? '[name].[contenthash:8].css'
                  : '[name].css';
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
      splitChunks: false, // Disable code splitting for ES modules output
    },
  };
};

