const isProd = process.env.NODE_ENV === "production";;
const purgecss = require("@fullhuman/postcss-purgecss")({
  content: ["./views/**/*.ejs"],
  defaultExtractor: (content) => content.match(/[A-Za-z0-9-_:/]+/g) || [],
});

const plugins = [
  require("tailwindcss"),
  require("autoprefixer"),
  ...(isProd ? [purgecss, require("cssnano")]: []),
];

module.exports = {
  plugins: plugins
};