$("#url").text(window.location.href);

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

let selectedVoteId = "";

getUser(
  (response) => {
    if (response.role === "admin") {
      $("#action").addClass("d-none");
      $("#manage-t").removeClass("d-none");

      refresh("admin");
    } else {
      refresh();
    }

    $("#change-vote").click(() => {
      adminUpdateVoteOption(
        () => {
          refresh("admin");
        },
        () => {},
        selectedVoteId,
        $("#change-input").val(),
      );
    });
  },
  () => {
    refresh();
    window.location.href = "/pages/login.html";
  },
);

const refresh = (role) => {
  getVoteObjects(
    (response) => {
      const { title, content, end_date, started_at, start_by, options } =
        response[0];

      $("#title").text(title);
      $("#content").text(content);
      $("#end-date").text(end_date);
      $("#started-at").text(started_at);
      $("#started-by").text(start_by);

      let totalVotes = 0;
      options.forEach((option) => {
        totalVotes += option.vote;
      });

      selectedVoteId = options[0].id;

      let radioButtons = "";
      options.forEach((option, i) => {
        radioButtons += `
        <div class="form-check">
        <input class="form-check-input" type="radio" name="flexRadioDefault" id="option-${
          option.id
        }" ${i === 0 ? "checked" : ""} 
        >
        <label class="form-check-label" for="flexRadioDefault2">
        ${option.content}
        </label>
        ${`<div class="progress">
            <div class="progress-bar primary-color" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: ${
              (option.vote / totalVotes) * 100
            }%"></div>`}
        </div>
        </div>
    `;
      });

      $("#options").html(radioButtons);

      $('input[type="radio"]').change(function () {
        selectedVoteId = $(this).attr("id").split("-")[1];
      });
    },
    () => {},
    null,
    urlParams.get("id"),
  );

  if (role === "admin") {
    adminGetVotes(
      (response) => {
        let votes = "";
        response.forEach((vote) => {
          votes += `<div class="d-flex justify-content-between border border-1 border-warning vote-ticket vote-ticket-${vote.id}">
            <div>${vote.user}</div>
            <div>${vote.option}</div>
            <button class='btn btn-danger delete-vote' data-id="${vote.id}">X</button>
            
            </div>`;
        });
        $("#options").addClass("d-none");
        $("#manage").html(votes);
        $(".delete-vote").click(function () {
          adminDeleteVote(
            () => {
              refresh("admin");
            },
            () => {},
            $(this).data("id"),
          );
        });
      },
      () => {},
      urlParams.get("id"),
    );
  }
};

$("#submit-vote").click(() => {
  increaseVoteOption(
    () => {
      showMessage("Vote submitted successfully", "success");
      refresh();
    },
    (response) => {
      console.log(response);

      showMessage(response.responseJSON.message, "error");
    },
    selectedVoteId,
  );
});
