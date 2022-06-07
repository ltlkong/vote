const scripts = [
  "bootstrap.min.js",
  "js-cookie.js",
  "pre.js",
  "constants.js",
  "sdk.js",
];

function loadScriptDelay(prefix, scripts, callback) {
  setTimeout(() => {
    scripts.forEach((script) => {
      document.head.appendChild(
        document.createElement("script"),
      ).src = `${prefix}${script}`;
    });
    if (callback) {
      callback();
    }
    document.querySelector("#loading").remove();
  }, 600);
}

function loadScript(prefix, scripts, callback) {
  scripts.forEach((script) => {
    document.head.appendChild(
      document.createElement("script"),
    ).src = `${prefix}${script}`;
  });
}
