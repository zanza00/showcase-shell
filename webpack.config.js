const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react-ts");

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "zanza00",
    projectName: "shell",
    webpackConfigEnv,
    argv,
    outputSystemJS: false,
  });
  return merge(defaultConfig, {
  });
};
