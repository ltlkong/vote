function baseApiCall(settings, success, fail) {
  const apiCall = $.ajax(settings);

  apiCall.done(success);

  apiCall.fail(fail);
}

const register = (username, email, password, successPage, master_key) => {
  const settings = {
    url: baseUrl + "/register",
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      email,
      password,
      username,
      master_key,
    }),
  };

  $.ajax(settings)
    .done((response) => {
      window.location.replace(successPage);
    })
    .fail((response) => {
      showMessage(response.responseJSON.message, "error");
    });
};

const login = (username, password, successPage) => {
  const settings = {
    url: baseUrl + "/login",
    method: "POST",
    timeout: 0,
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      username,
      password,
    }),
  };

  const login = $.ajax(settings);

  login.done(function (response) {
    Cookies.set("auth_token", response.data.token);
    window.location.href = successPage;
  });

  login.fail(function (response) {
    showMessage(response.responseJSON.message, "error");
  });
};

const getUser = (success, fail) => {
  const settings = {
    url: baseUrl + "/user",
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: Cookies.get("auth_token"),
    },
  };

  baseApiCall(settings, success, fail);
};

const createVoteObject = (title, content, endDate, success, fail) => {
  const settings = {
    url: baseUrl + "/vote",
    method: "POST",
    timeout: 0,
    headers: {
      Authorization: Cookies.get("auth_token"),
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      title,
      content,
      end_date: endDate,
    }),
  };

  baseApiCall(settings, success, fail);
};

const createVoteOption = (voteId, content, success, fail) => {
  const settings = {
    url: baseUrl + "/vote/option",
    method: "POST",
    timeout: 0,
    headers: {
      Authorization: Cookies.get("auth_token"),
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      content,
      vote_object_id: voteId,
    }),
  };

  baseApiCall(settings, success, fail);
};

const getVoteObjects = (success, fail, username, id) => {
  let url = baseUrl + "/vote";

  if (username) {
    url += "?username=" + username;
  } else if (id) {
    url += "?public_id=" + id;
  }

  const settings = {
    url: url,
    method: "GET",
    timeout: 0,
    headers: {
      Authorization: Cookies.get("auth_token"),
    },
  };

  baseApiCall(settings, success, fail);
};

const increaseVoteOption = (success, fail, id) => {
  const url = baseUrl + "/vote/option";

  const settings = {
    url: url,
    method: "PUT",
    timeout: 0,
    headers: {
      Authorization: Cookies.get("auth_token"),
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      vote_option_id: id,
    }),
  };

  baseApiCall(settings, success, fail);
};

const adminUpdateVoteOption = (success, fail, id, vote) => {
  const url = baseUrl + "/admin/vote/option";

  const settings = {
    url: url,
    method: "PUT",
    timeout: 0,
    headers: {
      Authorization: Cookies.get("auth_token"),
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      vote_option_id: id,
      vote,
    }),
  };

  baseApiCall(settings, success, fail);
};
