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

$("body")
  .append(`<div class="vh-100 vw-100 d-flex justify-content-center align-items-center position-fixed top-0 left-0" style="background-color:white; opacity:0.4;" id="loading">
<div class="spinner-border" role="status">
  <span class="visually-hidden">Loading...</span>
</div></div>`);

setTimeout(() => {
  $("#loading").remove();
}, 1000);
