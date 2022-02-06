AccountsDiv = document.querySelector("#accounts-list");
BuildsDiv = document.querySelector("#builds-list");
HeroesDiv = document.querySelector("#heroes-list");
ItemsDiv = document.querySelector("#items-list");

window.addEventListener('load', function () {
  loadAllFields();
});

function loadAllFields() {
  loadAccounts();
  loadBuilds();
  loadHeroes();
  filterItemsByName();
  loadItems();
}

function loadAccounts() {
  removeAllChildNodes(AccountsDiv);

  accounts.forEach(function(account) {
    var account_element = document.createElement("div");
    account_element.setAttribute("class", "hoverable");

    var account_name = document.createElement("h3");
    account_name.innerHTML = account.fields["discord_tag"];
    account_element.appendChild(account_name);

    var account_overflow = document.createElement("div");
    account_overflow.style.display = "none";
    account_overflow.setAttribute("id", "overflow");

    var account_id = document.createElement("p");
    account_id.innerHTML = account.pk;
    account_id.setAttribute("id", "account-pk");
    account_overflow.appendChild(account_id);

    var account_last_login = document.createElement("p");
    account_last_login.innerHTML = account.fields["last_login"];
    account_overflow.appendChild(account_last_login);

    var account_liked_builds = document.createElement("p");
    account_liked_builds.innerHTML = account.fields["liked_builds"];
    account_overflow.appendChild(account_liked_builds);

    var del_button = document.createElement("button");
    del_button.innerHTML = "Delete";
    del_button.style.display = "inline";
    account_overflow.appendChild(del_button);

    var whitelist_button = document.createElement("button");
    whitelist_button.innerHTML = "Whitelist";
    whitelist_button.style.display = "inline";
    account_overflow.appendChild(whitelist_button);

    del_button.onclick = function() {
      if (confirm("Are you sure you want to delete this account?")) {
        parent = del_button.parentElement;
        pk = parent.querySelector("#account-pk").innerHTML;
        deleteAccount(pk);
      }
    }

    whitelist_button.onclick = function() {
      if (confirm(`Are you sure you want to whitelist ${account.fields["discord_tag"]}? This action can only be undone in the terminal`)) {
        whitelistAccount(account.fields["discord_tag"]);
      }
    }

    account_element.onclick = function() {
      overflow = account_element.querySelector("#overflow");

      if (overflow.style.display == "none") {
        overflow.style.display = "block";
      }
      else if (overflow.style.display == "block") {
        overflow.style.display = "none";
      }
    }

    account_element.appendChild(account_overflow);

    AccountsDiv.appendChild(account_element);
  });
}

function loadBuilds() {
  removeAllChildNodes(BuildsDiv);

  builds.forEach(function(build) {
    var build_element = document.createElement("div");
    build_element.setAttribute("class", "hoverable");

    var build_author_hero = document.createElement("h3");
    build_author_hero.innerHTML = `${build.fields["hero"]} build by ${build.fields["author_display_name"]}`;
    build_element.appendChild(build_author_hero);

    var build_overflow = document.createElement("div");
    build_overflow.style.display = "none";
    build_overflow.setAttribute("id", "overflow");

    if (build.fields["hidden"] == 1) {
      var build_hidden = document.createElement("p");
      build_hidden.innerHTML = "HIDDEN";
      build_overflow.appendChild(build_hidden);
    }

    var build_name = document.createElement("p");
    build_name.innerHTML = build.fields["name"];
    build_overflow.appendChild(build_name);

    var build_date_created = document.createElement("p");
    build_date_created.innerHTML = build.fields["date_created"];
    build_overflow.appendChild(build_date_created);

    var build_score = document.createElement("p");
    build_score.innerHTML = build.fields["score"];
    build_overflow.appendChild(build_score);

    var build_desc = document.createElement("p");
    build_desc.innerHTML = build.fields["desc"];
    build_overflow.appendChild(build_desc);

    var build_items = document.createElement("p");
    build_items.innerHTML = `Starter: ${build.fields["starter_items"]}
    Early: ${build.fields["early_items"]}
    Mid: ${build.fields["mid_items"]}
    Late: ${build.fields["late_items"]}`;
    build_overflow.appendChild(build_items);

    build_element.onclick = function() {
      overflow = build_element.querySelector("#overflow");

      if (overflow.style.display == "none") {
        overflow.style.display = "block";
      }
      else if (overflow.style.display == "block") {
        overflow.style.display = "none";
      }
    }

    build_element.appendChild(build_overflow);

    BuildsDiv.appendChild(build_element);
  });
}

function loadHeroes() {
  removeAllChildNodes(HeroesDiv);

  heroes.forEach(function(hero) {
    var hero_element = document.createElement("div");
    hero_element.setAttribute("class", "hoverable");

    var hero_name = document.createElement("h3");
    hero_name.innerHTML = hero.pk;
    hero_name.setAttribute("id", "hero-pk")
    hero_element.appendChild(hero_name);

    var hero_overflow = document.createElement("div");
    hero_overflow.style.display = "none";
    hero_overflow.setAttribute("id", "overflow");

    var hero_q = document.createElement("p");
    hero_q.innerHTML = hero.fields["Q"];
    hero_overflow.appendChild(hero_q);

    var hero_e = document.createElement("p");
    hero_e.innerHTML = hero.fields["E"];
    hero_overflow.appendChild(hero_e);

    var hero_r = document.createElement("p");
    hero_r.innerHTML = hero.fields["R"];
    hero_overflow.appendChild(hero_r);

    var hero_rmb = document.createElement("p");
    hero_rmb.innerHTML = hero.fields["RMB"];
    hero_overflow.appendChild(hero_rmb);

    var hero_passive = document.createElement("p");
    hero_passive.innerHTML = hero.fields["passive"];
    hero_overflow.appendChild(hero_passive);

    var hero_stats = document.createElement("p");
    hero_stats.innerHTML = hero.fields["stats"];
    hero_overflow.appendChild(hero_stats);

    var hero_desc = document.createElement("p");
    hero_desc.innerHTML = hero.fields["desc"];
    hero_overflow.appendChild(hero_desc);

    var hero_img_src = document.createElement("p");
    hero_img_src.innerHTML = hero.fields["img_src"];
    hero_overflow.appendChild(hero_img_src);

    var edit_button = document.createElement("button");
    edit_button.innerHTML = "Edit";
    edit_button.style.display = "inline";
    hero_overflow.appendChild(edit_button);

    edit_button.onclick = function() {
      parent = edit_button.parentElement;
      grandparent = parent.parentElement;
      pk = hero.pk;
      q = hero.fields["Q"];
      e = hero.fields["E"];
      r = hero.fields["R"];
      rmb = hero.fields["RMB"];
      passive = hero.fields["passive"];
      stats = hero.fields["stats"];
      desc = hero.fields["desc"];
      src = hero.fields["img_src"];
      showHeroEditMenu(pk, q, e, r, rmb, passive, stats, desc, src);
    }

    var del_button = document.createElement("button");
    del_button.innerHTML = "Delete";
    del_button.style.display = "inline";
    hero_overflow.appendChild(del_button);

    del_button.onclick = function() {
      if (confirm("Are you sure you want to delete this hero?")) {
        parent = del_button.parentElement.parentElement;
        pk = parent.querySelector("#hero-pk").innerHTML;
        deleteHero(pk);
      }
    }

    hero_element.onclick = function() {
      overflow = hero_element.querySelector("#overflow");

      if (overflow.style.display == "none") {
        overflow.style.display = "block";
      }
      else if (overflow.style.display == "block") {
        overflow.style.display = "none";
      }
    }

    hero_element.appendChild(hero_overflow)

    HeroesDiv.appendChild(hero_element);
  });
}

function loadItems() {
  removeAllChildNodes(ItemsDiv);

  items.forEach(function(item) {
    var item_element = document.createElement("div");
    item_element.setAttribute("class", "hoverable");

    var item_name = document.createElement("h3");
    item_name.innerHTML = item.fields["name"];
    item_element.appendChild(item_name);

    var item_overflow = document.createElement("div");
    item_overflow.style.display = "none";
    item_overflow.setAttribute("id", "overflow");

    var item_id = document.createElement("p");
    item_id.innerHTML = item.pk;
    item_id.setAttribute("id", "item-pk");
    item_overflow.appendChild(item_id);

    if (item.fields["active"] != "") {
      var item_active = document.createElement("p");
      item_active.innerHTML = `Active: ${item.fields["active"]}`;
      item_overflow.appendChild(item_active);
    }

    if (item.fields["passive"] != "") {
      var item_passive = document.createElement("p");
      item_passive.innerHTML = `Passive: ${item.fields["passive"]}`;
      item_overflow.appendChild(item_passive);
    }

    if (item.fields["unique_passive"] != "") {
      var item_unique = document.createElement("p");
      item_unique.innerHTML = `Unique passive(s): ${item.fields["unique_passive"]}`;
      item_overflow.appendChild(item_unique);
    }

    var item_stats = document.createElement("p");
    item_stats.innerHTML = item.fields["stats"];
    item_overflow.appendChild(item_stats);

    var item_cost = document.createElement("p");
    item_cost.innerHTML = `Cost: ${item.fields["cost"]}`;
    item_overflow.appendChild(item_cost);

    var edit_button = document.createElement("button");
    edit_button.innerHTML = "Edit";
    edit_button.style.display = "inline";
    item_overflow.appendChild(edit_button);

    edit_button.onclick = function() {
      pk = item.pk;
      name = item.fields["name"];
      cost = item.fields["cost"];
      active = item.fields["active"];
      passive = item.fields["passive"];
      stats = item.fields["stats"];
      unique = item.fields["unique_passive"];
      showItemEditMenu(pk, name, cost, active, passive, stats, unique);
    }

    var del_button = document.createElement("button");
    del_button.innerHTML = "Delete";
    del_button.style.display = "inline";
    item_overflow.appendChild(del_button);

    del_button.onclick = function() {
      if (confirm("Are you sure you want to delete this hero?")) {
        parent = del_button.parentElement;
        pk = parent.querySelector("#item-pk").innerHTML;
        deleteItem(pk);
      }
    }

    item_element.onclick = function() {
      overflow = item_element.querySelector("#overflow");

      if (overflow.style.display == "none") {
        overflow.style.display = "block";
      }
      else if (overflow.style.display == "block") {
        overflow.style.display = "none";
      }
    }

    item_element.appendChild(item_overflow);

    ItemsDiv.appendChild(item_element);
  });
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

// ACCOUNTS
function filterAccountsByName() {
  sortByTextKey(accounts, "discord_tag");
  loadAccounts();
}

function whitelistAccount(id) {
  fetch("/admin/", {
      method: 'POST',
      credentials: 'same-origin',
      headers:{
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest', //Necessary to work with request.is_ajax()
          'X-CSRFToken': getCookie('csrftoken'),
          'X-Resource': "accounts",
  },
      body: JSON.stringify(id) //JavaScript object of data to POST
  }).then(response => {
    return response.json();
  }).then(data => {
    if (data["Status"] == "Success") {
      location.reload();
    }
    else {
      alert("Error");
    }
  });
}

function filterAccountsByPk() {
  sortByIntKey(accounts, "pk");
  loadAccounts();
}

// ITEMS
function filterItemsByCost() {
  filterItemsByName();
  sortByIntKey(items, "cost");
  loadItems();
}

function filterItemsByName() {
  sortByTextKey(items, "name");
  loadItems();
}

function filterItemsByPk() {
  sortByIntKey(items, "pk");
  loadItems();
}

function postItem() {
  name = document.getElementById("item-name").value;
  cost = document.getElementById("item-cost").value;
  active = document.getElementById("item-active").value;
  passive = document.getElementById("item-passive").value;
  stats = document.getElementById("item-stats").value;
  uniques = document.getElementById("item-unique-passive").value;

  item = {
    'name': name,
    'cost': cost,
    'active': active,
    'passive': passive,
    'stats': stats,
    'uniques': uniques,
  }

  fetch("/admin/", {
      method: 'POST',
      credentials: 'same-origin',
      headers:{
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest', //Necessary to work with request.is_ajax()
          'X-CSRFToken': getCookie('csrftoken'),
          'X-Resource': "items",
  },
      body: JSON.stringify(item) //JavaScript object of data to POST
  }).then(response => {
    return response.json();
  }).then(function (response) {
    if (response.status == 201) {
      location.reload();
    }
    else {
      alert("An error occured");
    }
  });
}

function deleteItem(pk) {
  console.log(pk);
  item = {
    "item-id": pk,
  }
  fetch("/admin/", {
      method: 'DELETE',
      credentials: 'same-origin',
      headers:{
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest', //Necessary to work with request.is_ajax()
          'X-CSRFToken': getCookie('csrftoken'),
          'X-Resource': "items",
      },
      body: JSON.stringify(item)
  }).then(function (response) {
    if (response.status == 200) {
      location.reload();
    }
    else {
      alert("An error occured");
    }
  });
}

function putItem() {
  id = document.getElementById("item-id").innerHTML;
  name = document.getElementById("edit-item-name").value;
  cost = document.getElementById("edit-item-cost").value;
  active = document.getElementById("edit-item-active").value;
  passive = document.getElementById("edit-item-passive").value;
  stats = document.getElementById("edit-item-stats").value;
  uniques = document.getElementById("edit-item-unique-passive").value;

  item = {
    'id': id,
    'name': name,
    'cost': cost,
    'active': active,
    'passive': passive,
    'stats': stats,
    'uniques': uniques,
  }

  fetch("/admin/", {
      method: 'PUT',
      credentials: 'same-origin',
      headers:{
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest', //Necessary to work with request.is_ajax()
          'X-CSRFToken': getCookie('csrftoken'),
          'X-Resource': "items",
  },
      body: JSON.stringify(item) //JavaScript object of data to POST
  }).then(function (response) {
    if (response.status == 200) {
      location.reload();
    }
    else {
      alert("An error occured");
    }
  });
}

function showItemCreateMenu(elt) {
  createMenu = document.querySelector("#create-item");

  if (createMenu.style.display == "none") {
    elt.innerHTML = "Hide creation menu";
    createMenu.style.display = "block";
  }
  else if (createMenu.style.display == "block") {
    elt.innerHTML = "Show creation menu";
    createMenu.style.display = "none";
  }
}

function showItemEditMenu(pk, name, cost, active, passive, stats, unique) {
  editMenu = document.querySelector("#edit-item");
  editMenu.style.display = "block";

  document.querySelector("#item-id").innerHTML = pk;
  document.querySelector("#edit-item-name").value = name;
  document.querySelector("#edit-item-cost").value = cost;
  document.querySelector("#edit-item-active").value = active;
  document.querySelector("#edit-item-passive").value = passive;
  document.querySelector("#edit-item-stats").value = stats;
  document.querySelector("#edit-item-unique-passive").value = unique;
}

// HEROES
function postHero() {
  name = document.getElementById("hero-name").value;
  q = document.getElementById("hero-q").value;
  e = document.getElementById("hero-e").value;
  r = document.getElementById("hero-r").value;
  rmb = document.getElementById("hero-rmb").value;
  passive = document.getElementById("hero-passive").value;
  stats = document.getElementById("hero-stats").value;
  desc = document.getElementById("hero-desc").value;
  src = document.getElementById("hero-src").value;

  hero = {
    'name': name,
    'Q': q,
    'E': e,
    'R': r,
    'RMB': rmb,
    'passive': passive,
    'stats': stats,
    'desc': desc,
    'img_src': src,
  }

  fetch("/admin/", {
      method: 'POST',
      credentials: 'same-origin',
      headers:{
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest', //Necessary to work with request.is_ajax()
          'X-CSRFToken': getCookie('csrftoken'),
          'X-Resource': "heroes",
  },
      body: JSON.stringify(hero) //JavaScript object of data to POST
  }).then(function (response) {
    if (response.status == 201) {
      location.reload();
    }
    else {
      alert("An error occured");
    }
  });
}

function deleteHero(pk) {
  hero = {
    "hero-name": pk,
  }
  fetch("/admin/", {
      method: 'DELETE',
      credentials: 'same-origin',
      headers:{
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest', //Necessary to work with request.is_ajax()
          'X-CSRFToken': getCookie('csrftoken'),
          'X-Resource': "heroes",
      },
      body: JSON.stringify(hero)
  }).then(function (response) {
    if (response.status == 200) {
      location.reload();
    }
    else {
      alert("An error occured");
    }
  });
}

function putHero() {
  name = document.getElementById("edit-hero-name").innerHTML;
  q = document.getElementById("edit-hero-q").value;
  e = document.getElementById("edit-hero-e").value;
  r = document.getElementById("edit-hero-r").value;
  rmb = document.getElementById("edit-hero-rmb").value;
  passive = document.getElementById("edit-hero-passive").value;
  stats = document.getElementById("edit-hero-stats").value;
  desc = document.getElementById("edit-hero-desc").value;
  src = document.getElementById("edit-hero-src").value;

  hero = {
    'name': name,
    'Q': q,
    'E': e,
    'R': r,
    'RMB': rmb,
    'passive': passive,
    'stats': stats,
    'desc': desc,
    'img_src': src,
  }

  fetch("/admin/", {
      method: 'PUT',
      credentials: 'same-origin',
      headers:{
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest', //Necessary to work with request.is_ajax()
          'X-CSRFToken': getCookie('csrftoken'),
          'X-Resource': "heroes",
  },
      body: JSON.stringify(hero) //JavaScript object of data to POST
  }).then(function (response) {
    if (response.status == 200) {
      location.reload();
    }
    else {
      alert("An error occured");
    }
  });
}

function showHeroCreateMenu(elt) {
  createMenu = document.querySelector("#create-hero");

  if (createMenu.style.display == "none") {
    elt.innerHTML = "Hide creation menu";
    createMenu.style.display = "block";
  }
  else if (createMenu.style.display == "block") {
    elt.innerHTML = "Show creation menu";
    createMenu.style.display = "none";
  }
}

function showHeroEditMenu(pk, q, e, r, rmb, passive, stats, desc, src) {
  editMenu = document.querySelector("#edit-hero");
  editMenu.style.display = "block";

  document.querySelector("#edit-hero-name").innerHTML = pk;
  document.querySelector("#edit-hero-q").value = q;
  document.querySelector("#edit-hero-e").value = e;
  document.querySelector("#edit-hero-r").value = r;
  document.querySelector("#edit-hero-rmb").value = rmb;
  document.querySelector("#edit-hero-passive").value = passive;
  document.querySelector("#edit-hero-stats").value = stats;
  document.querySelector("#edit-hero-desc").value = desc;
  document.querySelector("#edit-hero-src").value = src;
}

function deleteAccount(pk) {
  console.log(`Deleting ${pk}. . .`);
}