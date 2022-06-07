let id = 0;
let search = "";

$("#search-btn").click(() => {
  search = $("#search-input").val();
  getVoteObjectsWrapWithAuth();
  $("#search-input").val("");
});

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
      getVoteObjectsWrapWithAuth();

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
      addOption(true);
      addOption(true);
    },
    () => {},
  );
});

const voteObjectEle = (
  title,
  content,
  id,
  username,
  endDate,
  isActive,
  role,
) => {
  console.log(role);
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
            <div class="mb-1">${
              isActive
                ? `<span class="bg-success p-1 rounded">进行中</span>`
                : `<span class="bg-danger p-1 rounded">截止</span>`
            }</div>
            ${
              role === roleEnum.admin
                ? `<a class="btn btn-primary primary-color w-100" href ="vote.html?id=${id}">管理票数</a>`
                : `<a href="vote.html?id=${id}" class="btn btn-primary primary-color d-block w-100 vote-link" target="_blank">
            ${isActive ? "投票" : "查看"}
            </a>`
            }
            ${
              role === roleEnum.admin
                ? `<button class="btn btn-danger delete-btn w-100 mt-1" data-id="${id}">删除</button>`
                : ""
            }
          </div>
        </div>
        </div>`;
};

const getVoteObjectsWrap = (username, role) => {
  getVoteObjects(
    (response) => {
      let voteObjectsELe = "";

      if (search !== "") {
        response = response.filter((item) => item.title.includes(search));
      }

      response.forEach((voteObject) => {
        voteObjectsELe += voteObjectEle(
          voteObject.title,
          voteObject.content,
          voteObject.id,
          voteObject.start_by,
          voteObject.end_date.split(" ")[0],
          voteObject.is_active,
          role,
        );
      });

      $("#all-votes-container").html(voteObjectsELe);

      $(".delete-btn").click(function () {
        const id = $(this).data("id");
        adminDeleteVoteObject(
          () => {
            getVoteObjectsWrap(null, role);
          },
          () => {},
          id,
        );
      });
    },
    () => {},
    username,
  );
};

$("#show-my-votes-btn").click(() => {
  getVoteObjectsWrapWithAuth($("#usrname").text());
});

$("#show-all").click(() => {
  search = "";
  getVoteObjectsWrapWithAuth();
});

const getVoteObjectsWrapWithAuth = (username) => {
  getUser(
    (response) => {
      getVoteObjectsWrap(username, response.role);
    },
    () => {
      getVoteObjectsWrap(username);
    },
  );
};

getVoteObjectsWrapWithAuth();
