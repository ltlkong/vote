getUser(
  (response) => {
    $("#auth-container").html(`
        <span class="text-secondary text-center">Hi! <span id="usrname">${response.username}</span></span>
        <button class="btn btn-outline-primary outline-primary-color me-2" id="logout">退出</button>
      `);

    $("#logout").click(() => {
      Cookies.remove("auth_token");

      $("#auth-container").html(`
        <a class="btn btn-outline-primary outline-primary-color me-2" href="/pages/login.html">登录</a>
        <a class="btn btn-primary primary-color" href="/pages/register.html">注册</a>
      `);

      window.location.href = "/";
    });

    if (response.role === "admin") {
      $("#auth-container").append(`
            <span class="primary-color" href="#">管理员</span>
        `);
    }

    $("#action-list-vote").removeClass("d-none");
  },
  () => {
    $("#auth-container").html(`
        <a class="btn btn-outline-primary outline-primary-color me-2" href="/pages/login.html">登录</a>
        <a class="btn btn-primary primary-color" href="/pages/register.html">注册</a>
      `);
  },
);

$("#register-btn").click(() => {
  const username = $("#username").val();
  const password = $("#password").val();
  const email = $("#email").val();
  const successPage = "/";
  register(username, email, password, successPage);
});

$("#login-btn").click(() => {
  const username = $("#username").val();
  const password = $("#password").val();
  const successPage = "/";
  login(username, password, successPage);
});
