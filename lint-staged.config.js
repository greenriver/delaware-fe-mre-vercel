// https://stackoverflow.com/questions/37927772/how-to-silence-warnings-about-ignored-files-in-eslint/73818629#73818629

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { ESLint } = require("eslint");

const removeIgnoredFiles = async (files) => {
  const eslint = new ESLint();
  const ignoredFiles = await Promise.all(files.map((file) => eslint.isPathIgnored(file)));
  const filteredFiles = files.filter((_, i) => !ignoredFiles[i]);
  return filteredFiles.join(" ");
};

module.exports = {
  "*.{js,ts,tsx}": async (files) => {
    const filesToLint = await removeIgnoredFiles(files);
    return [`eslint --max-warnings=0 ${filesToLint}`];
  }
};
