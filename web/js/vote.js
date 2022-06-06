$("#url").text(window.location.href);

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

let selectedVoteId = "";

const voted = JSON.parse(localStorage.getItem("vote"))?.filter(
  (v) => v.id === urlParams.get("id"),
);

if (voted?.length > 0) {
  $("#submit-vote").addClass("disabled");
}

getUser(
  (response) => {
    if (response.role === "admin") {
      $("#action")
        .append(`<button class="btn btn-primary primary-color me-2" id="change-vote">
                  更改
                </button><input type="text" id="change-input"/>`);
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
        }" ${i === 0 ? "checked" : ""} ${
          voted?.length > 0 &&
          voted[0].option !== option.id.toString() &&
          role !== "admin"
            ? 'disabled="disabled"'
            : "checked"
        }>
        <label class="form-check-label" for="flexRadioDefault2">
        ${option.content}
        </label>
        ${
          role !== "admin"
            ? `<div class="progress">
            <div class="progress-bar primary-color" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: ${
              (option.vote / totalVotes) * 100
            }%"></div>`
            : `<div>票数：${option.vote}</div>`
        }
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
};

$("#submit-vote").click(() => {
  increaseVoteOption(
    () => {
      showMessage("Vote submitted successfully", "success");
      const newVotes = JSON.parse(localStorage.getItem("votes")) || [];
      localStorage.setItem(
        "vote",
        JSON.stringify([
          ...newVotes,
          { id: urlParams.get("id"), option: selectedVoteId },
        ]),
      );
      refresh();
    },
    () => {},
    selectedVoteId,
  );
});
