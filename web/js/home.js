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

let id = 0;

const addOption = (remove = false) => {
  const optionId = id;

  $("#vote-options").append(`
        <div class="input-group mb-3 vote-option vote-option-${optionId}">
            <input type="text" class="form-control">
            ${
              remove
                ? ""
                : `
            <button class="input-group-text option-btn-${optionId} btn btn-danger" id="basic-addon1">X</button>`
            }
        </div>
  `);

  $(".option-btn-" + optionId).click(() => {
    $(".vote-option-" + optionId).remove();
  });

  id++;
};

addOption(true);
addOption(true);

$("#add-option-btn").click(() => {
  addOption();
});

$("#create-vote-btn").click(() => {
  createVoteObject(
    $("#create-vote-title").val(),
    $("#create-vote-content").val(),
    $("#create-vote-end-date").val(),
    (response) => {
      getVoteObjectsWrap();

      if ($("#vote-options .vote-option").length > 0) {
        $("#vote-options .vote-option").each(function () {
          const option = $(this);
          createVoteOption(response, option.find("input").val(), () => {
            console.log("success");
          });
        });
      }

      $("#create-vote-modal").modal("hide");
      $("#create-vote-title").val("");
      $("#create-vote-content").val("");
      $("#create-vote-end-date").val("");
      $("#vote-options").html("");
    },
    () => {},
  );
});

const voteObjectEle = (title, content, id, username, endDate) => {
  return `
  <div class='p-2 col-xl-3 col-md-4 col-sm-6 col-12'>
            <div class="card ">
          <img
            src="https://nsgeu.ca/wp-content/uploads/2021/02/vote.jpg"
            class="card-img-top"
            alt="..."
          />
          <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <p class="card-text mb-4 overflow-scroll" style="height:4em;">
            ${content}
            </p>
            <div>
            发起人: ${username}
            </div>
            <div>截止: ${endDate}</div>
            <a href="vote.html?id=${id}" class="btn btn-primary primary-color d-block w-100 vote-link" target="_blank">
              投票
            </a>
          </div>
        </div>
        </div>`;
};

const getVoteObjectsWrap = (username) => {
  getVoteObjects(
    (response) => {
      let voteObjectsELe = "";

      response.forEach((voteObject) => {
        voteObjectsELe += voteObjectEle(
          voteObject.title,
          voteObject.content,
          voteObject.id,
          voteObject.start_by,
          voteObject.end_date.split(" ")[0],
        );
      });

      $("#all-votes-container").html(voteObjectsELe);
    },
    () => {},
    username,
  );
};

$("#show-my-votes-btn").click(() => {
  getVoteObjectsWrap($("#usrname").text());
});

$("#show-all").click(() => {
  getVoteObjectsWrap();
});

getVoteObjectsWrap();
