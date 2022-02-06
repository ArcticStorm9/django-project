function getFilteredData() {
  let hero = document.querySelector("#param-hero").value;
  let role = document.querySelector("#param-role").value;
  let sort = document.querySelector("#param-sort").value;
  if (hero == "--Select Hero--") {
    hero = null;
  }
  if (role == "--Select Role--") {
    role = null;
  }
  if (sort == "Score") {
    sort = "score";
  }
  else if (sort == "Date") {
    sort = "date_created";
  }
  fetch("/builds/", {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest', //Necessary to work with request.is_ajax()
          'X-CSRFToken': getCookie('csrftoken'),
          'X-Filters': true,
          'X-Hero': hero,
          'X-Role': role,
          'X-Sort': sort,
      }
  }).then(function (response) {
    console.log(response);
    return response.json();
  }).then(function (data) {
    console.log("Should refresh");
  });
}

/*
function reloadBuilds(builds) {
  let buildsContainer = document.getElementsByClassName("builds-container")[0];
  removeAllChildNodes(buildsContainer);
  Object.keys(builds).forEach(key => {
    build = builds[key];
    console.log(build);
    let linkContainer = document.createElement("a");
    linkContainer.href = `http://localhost:8000/builds/${build.pk}`;
    let buildHolder = document.createElement("div");
    buildHolder.setAttribute("class", "build");
    let buildThumbnail = document.createElement("div");
    buildThumbnail.setAttribute("class", "build-name name");
    let buildImage = document.createElement("img");

    console.log(heroes);

    buildImage.src = `../../static/styles/images/heroes/${heroes[build.fields.hero].img_src}`;
    buildImage.setAttribute("class", "img-cover");
    buildThumbnail.appendChild(buildImage);
    let buildNameContainer = document.createElement("div");
    buildNameContainer.setAttribute("class", "build-name-container");
    let buildName = document.createElement("h2");
    buildName.innerHTML = build.fields.name;
    buildNameContainer.appendChild(buildName);
    let buildBy = document.createElement("h5");
    buildBy.innerHTML = `by ${build.fields.author_display_name}`;
    buildNameContainer.appendChild(buildBy);
    buildThumbnail.appendChild(buildNameContainer);
    buildHolder.appendChild(buildThumbnail);

    let roleContainer = document.createElement("div");
    roleContainer.setAttribute("class", "build-role role");
    let roleImage = document.createElement("img");
    roleImage.src = `../../static/styles/images/roles/${build.fields.role}.png`;
    roleContainer.appendChild(roleImage);
    buildHolder.appendChild(roleContainer);

    let statsContainer = document.createElement("div");
    statsContainer.setAttribute("class", "build-stats stats");
    statsContainer.style.color = "white";
    statsContainer.innerHTML = "NOT IMPLEMENTED";
    buildHolder.appendChild(statsContainer);
    let itemsContainer = document.createElement("div");
    itemsContainer.setAttribute("class", "build-items items");
    let scoreContainer = document.createElement("div");
    scoreContainer.setAttribute("class", "build-score score");
    linkContainer.appendChild(buildHolder);
    buildsContainer.appendChild(linkContainer);
    linkContainer.appendChild(buildHolder);
    buildsContainer.appendChild(linkContainer);
  })
}
*/
