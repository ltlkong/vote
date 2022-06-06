const scripts = [
  "bootstrap.min.js",
  "js-cookie.js",
  "pre.js",
  "constants.js",
  "sdk.js",
];

function loadScript(prefix, scripts, callback) {
  scripts.forEach((script) => {
    document.head.appendChild(
      document.createElement("script"),
    ).src = `${prefix}${script}`;
  });
}
