const path = require('path');

const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

module.exports = function override(config, env) {
  // 添加别名配置
  config.resolve.alias = {
    '@': path.resolve(__dirname, 'src/'),
  };

  if (env === 'production') {
    config.plugins.push(
      new WorkboxWebpackPlugin.GenerateSW({
        clientsClaim: true,
        skipWaiting: true
      })
    );
  }

  return config;
};