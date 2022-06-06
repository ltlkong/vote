document.querySelector("form")?.addEventListener("submit", function (e) {
  e.preventDefault();
});

const showMessage = (message, status) => {
  switch (status) {
    case "success":
      $("#message-bar").html(`
      <div class="alert alert-success" role="alert">${message} </div>
    `);
      break;
    case "error":
      $("#message-bar").html(`
          <div class="alert alert-danger" role="alert">${message} </div>
        `);
      break;
  }

  setTimeout(() => {
    $("#message-bar").html("");
  }, 3000);
};
