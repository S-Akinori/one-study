const mix = require('laravel-mix');
const tailwindcss = require('tailwindcss');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */
mix.webpackConfig({
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.scss/,
        loader: 'import-glob-loader'
      }
    ]
  }
});

mix.ts('resources/ts/app.tsx', 'public/js')
    .sass('resources/sass/app.scss', 'public/css')
    .options({
      processCssUrls: false,
      postCss: [tailwindcss('./tailwind.config.js')],
    });
