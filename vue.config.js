const path = require('path');
const webpack = require('webpack');
const TerserJSPlugin = require('terser-webpack-plugin');

const IS_RELEASE = process.env.VUE_APP_CURRENTMODE === 'release';

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    publicPath: process.env.VUE_APP_BASE_URL,
    css: {
        sourceMap: !IS_RELEASE
    },
    productionSourceMap: !IS_RELEASE,
    lintOnSave: false,
    chainWebpack: config => {
        config.module
            .rule('images')
            .use('url-loader')
            .loader('url-loader')
            .tap(options =>
                Object.assign(options, {
                    limit: 1024,
                    fallback: {
                        loader: 'file-loader',
                        options: {
                            name: 'img/[name].[ext]'
                        }
                    }
                })
            );
    },
    configureWebpack: config => {
        Object.assign(config.resolve, {
            alias: {
                '@': resolve('src'),
                '_c': resolve('src/components'),
                '_v': resolve('src/views')
            },
            extensions: ['.js', '.vue', '.less', '.json']
        });
        config.optimization = {
                minimizer: [
                    new TerserJSPlugin({
                        sourceMap: true, // Must be set to true if using source-maps in production
                        terserOptions: {
                            compress: {
                                dead_code: true,
                                drop_debugger: IS_RELEASE,
                                drop_console: IS_RELEASE
                            },
                        },
                    }),
                ]
            },
            config.externals = [{
                vue: 'Vue'
            }];
        config.plugins.push(
            new webpack.ProvidePlugin({
                _Global: [resolve('./src/config/index.js'), 'default'],
                _T: [resolve('./src/lib/tools.js'), 'default'],
            })
        );
    },
    devServer: {
        // host: 'localhost',
        // host: 'sth.10jqka.com.cn',
        disableHostCheck: true,
        host: '194.168.1.159',
        https: true,
        // proxy: {
        //     '/api': {
        //         target: 'http://ai.iwencai.com',
        //         ws: false,
        //         changeOrigin: true,
        //         pathRewrite: {
        //             '^/api': ''
        //         }
        //     }
        // }
    }
}