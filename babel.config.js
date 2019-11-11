module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  env: {
    production: {
      plugins: ['transform-remove-console'],
    },
  },
  plugins: [
    '@babel/plugin-proposal-class-properties',
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.json'],
        alias: {
          assets: './src/assets',
          component: './src/components',
          shared: './src/components/shared',
          pages: './src/pages',
          routes: './src/routes',
          styles: './src/styles',
          utils: './src/utils',
        },
      },
    ],
  ],
};
