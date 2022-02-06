const data = { 'items': null } // resources
/* user selected hero and role to post once completed*/
var SelectedHero = null;
var SelectedRole = null;
/* user selected items */
var SelectedStarter = [];
var SelectedEarly = [];
var SelectedMid = [];
var SelectedLate = [];
/*used as a key for a switch in the addItem
func so the item select menu can display
the correct prompts.*/
var itemSet = SelectedStarter;

window.addEventListener('load', function () {
  fetch("/items/", {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest', //Necessary to work with request.is_ajax()
          'X-CSRFToken': getCookie('csrftoken'),
      }
  }).then(function (response) {
    return response.json();
  }).then(function (items) {
    data.items = JSON.parse(items);
  }).then(function () {
    let itemContainer = document.querySelector(".item-select-container");
    for (let i = 0; i < data['items'].length; i++) {
      let item = document.createElement("div");
      item.setAttribute('class', 'item');
      item.setAttribute('id', i.toString());
      item.innerHTML = data.items[i].fields.name;

      item.onmouseover = function(ev) {
        showHover(ev, data.items[i].fields.name, null, data.items[i].fields.active, data.items[i].fields.passive, null, null, null, data.items[i].fields.stats)
      };
      item.onmouseout = function(ev) {
        destroyHover()
      };
      item.onmousemove = function(ev) {
        moveHover(ev)
      };
      item.onclick = function(ev) {
        addItem(data.items[i].pk, i)
      };

      itemContainer.appendChild(item);
    }
  });
});

/* HOVER FUNCTIONS */
function showHover(ev, header, desc=null, field1=null, field2=null, field3=null, field4=null, field5=null, stats=null) {
  // grab the coordinates of the event
  let x = ev.clientX;
  let y = ev.clientY;

  // create element and all of it's fields
  let hoverDiv = document.createElement("div");
  hoverDiv.setAttribute("id", "hover");

  let hoverHeader = document.createElement("h2");
  hoverHeader.innerHTML = header;
  hoverDiv.appendChild(hoverHeader);

  if (desc) {
    let hoverDesc = document.createElement("p");
    hoverDesc.innerHTML = desc;
    hoverDiv.appendChild(hoverDesc)
  }
  if (field1) {
    let hoverfield = document.createElement("p");
    hoverfield.innerHTML = field1;
    hoverDiv.appendChild(hoverfield)
  }
  if (field2) {
    let hoverfield = document.createElement("p");
    hoverfield.innerHTML = field2;
    hoverDiv.appendChild(hoverfield)
  }
  if (field3) {
    let hoverfield = document.createElement("p");
    hoverfield.innerHTML = field3;
    hoverDiv.appendChild(hoverfield)
  }
  if (field4) {
    let hoverfield = document.createElement("p");
    hoverfield.innerHTML = field4;
    hoverDiv.appendChild(hoverfield)
  }
  if (field5) {
    let hoverfield = document.createElement("p");
    hoverfield.innerHTML = field5;
    hoverDiv.appendChild(hoverfield)
  }

  if (stats) {
    hoverDiv.appendChild(parseStats(stats));
  }

  hoverDiv.style.height = "auto";
  hoverDiv.style.display = "block";

  // set hover position
  hoverDiv.style.position = "fixed";
  hoverDiv.style.left = `${x + 15}px`;

  document.body.appendChild(hoverDiv);

  // move the hover above the mouse if it is too close to the edge of the window
  if (y + hoverDiv.offsetHeight > window.innerHeight){
    hoverDiv.style.top = `${y - hoverDiv.offsetHeight}px`;
    hoverDiv.style.borderRadius = "1rem 0 1rem 0";
  }
  else {
    hoverDiv.style.top = `${y + 15}px`;
    hoverDiv.style.borderRadius = "0 1rem 0 1rem";
  }
}

// destroy the hover
function destroyHover() {
  let hover = document.getElementById("hover");
  if (hover) {
    hover.remove();
  }
}

// move the hover by getting event x and y and applying it to the hover
function moveHover(ev) {
  // don't execute if hover does not exist
  if (!document.getElementById("hover")) {
    return;
  }

  let x = ev.clientX;
  let y = ev.clientY;
  hoverDiv = document.getElementById("hover");

  hoverDiv.style.left = `${x + 15}px`;
  if (y + hoverDiv.offsetHeight > window.innerHeight){
    hoverDiv.style.top = `${y - hoverDiv.offsetHeight}px`;
    hoverDiv.style.borderRadius = "1rem 0 1rem 0";
  }
  else {
    hoverDiv.style.top = `${y + 15}px`;
    hoverDiv.style.borderRadius = "0 1rem 0 1rem";
  }
}

/* HERO FUNCTION */
function addHero(name) {
  // destroy the active hover
  let hover = document.getElementById("hover");
  hover.remove();

  // store selected hero
  SelectedHero = name;

  // get and hide the hero container
  let hero = document.querySelector('.hero-select-container');
  anime({
    targets: hero,
    height: "0",
    opacity: "0",
    easing: 'easeInOutExpo',
  });
  setTimeout(() => {
    hero.style.display = "none";
  }, 750);
  // get and display the role container
  let role = document.querySelector('.role-select-container');
  role.style.display = "block";
  anime({
    targets: role,
    height: "auto",
    opacity: "1",
  });
  if (hover) {
    hover.remove();
  }

  markIndicator(".hero-n", name, changeHero);
}

/* ROLE FUNCTION */
function addRole(name) {
  // destroy active hover
  let hover = document.getElementById("hover");
  hover.remove();

  // store selected role
  SelectedRole = name;

  // get and hide the role container
  let role = document.querySelector('.role-select-container');
  anime({
    targets: role,
    opacity: "0",
    duration: 500,
    easing: 'easeInOutExpo',
  });
  setTimeout(() => {
    role.style.display = "none";
  }, 500);
  // get and display the item container
  let item = document.querySelector('.item-select-container');
  item.style.display = "block";
  anime({
    targets: item,
    opacity: "1",
    delay: 500,
  });

  // destroy hover if it still exists
  if (hover) {
    hover.remove();
  }

  markIndicator(".role-n", name, changeRole);
}

/* ITEM SELECTION FUNCTIONS */
function addItem(pk, lookup) {
  // get counter element
  let counter = document.querySelector(".counter");
  // do different things, depending on how many items have been added to itemSet
  switch (itemSet.length) {
    case 0:
      // instantiate the accept button if it doesn't exist, add item to itemSet, update counter text
      if (!document.querySelector(".accept")) {
        acceptItems();
      }
      itemSet.push(pk);
      addItemToMenu(lookup);
      counter.innerHTML = String(parseInt(counter.innerHTML.split("/")[0]) + 1) + "/" + counter.innerHTML.split("/")[1]; // This splits the counter text and adds 1 to the first int
      break;
    case 1:
      // add item to itemSet, update counter text
      itemSet.push(pk);
      addItemToMenu(lookup);
      counter.innerHTML = String(parseInt(counter.innerHTML.split("/")[0]) + 1) + "/" + counter.innerHTML.split("/")[1];
      break;
    case 2:
      // if not on starter then alert user, other wise add item to itemSet, update counter text
      if (itemSet != SelectedStarter) {
        alert("You've already selected 2 items.");
        break;
      }
      itemSet.push(pk);
      addItemToMenu(lookup);
      counter.innerHTML = String(parseInt(counter.innerHTML.split("/")[0]) + 1) + "/" + counter.innerHTML.split("/")[1];
      break;
    default:
      // alert user
      alert("You've already selected 3 items.");
  }
}

// add items to the selection menu
function addItemToMenu(lookup) { // lookup is the key of the item in the data.items array
  // get menu and accept
  let selectedMenu = document.querySelector(".selected-items");
  let accept = document.querySelector(".accept");

  // create element and set innerHTML
  let item = document.createElement("div");
  item.setAttribute('class', 'selected-item');
  item.innerHTML = data.items[lookup].fields.name;
  item.onclick = function() {
    removeItem(item, lookup);
  }
  item.onmouseover = function() {
    item.style.color = "red";
  }
  item.onmouseout = function() {
    item.style.color = "white";
  }
  // append to selectedMenu before accept
  selectedMenu.insertBefore(item, accept);
}

function removeItem(itemDiv, lookup) {
  let counter = document.querySelector(".counter");
  itemDiv.remove();
  counter.innerHTML = String(parseInt(counter.innerHTML.split("/")[0]) - 1) + "/" + counter.innerHTML.split("/")[1];

  switch (itemSet) {
    case SelectedStarter:
      for (let i = 0; i < SelectedStarter.length; i++) {
        if (SelectedStarter[i] === data.items[lookup].pk) {
          SelectedStarter.splice(i, 1);
          break;
        }
      }
      break;

    case SelectedEarly:
      for (let i = 0; i < SelectedEarly.length; i++) {
        if (SelectedEarly[i] === data.items[lookup].pk) {
          SelectedEarly.splice(i, 1);
          break;
        }
      }
      break;

    case SelectedMid:
      for (let i = 0; i < SelectedMid.length; i++) {
        if (SelectedMid[i] === data.items[lookup].pk) {
          SelectedMid.splice(i, 1);
          break;
        }
      }
      break;

    case SelectedLate:
      for (let i = 0; i < SelectedLate.length; i++) {
        if (SelectedLate[i] === data.items[lookup].pk) {
          SelectedLate.splice(i, 1);
          break;
        }
      }
      break;

    default:
      console.error;
  }
}

function acceptItems() {
  // get necessary elements
  let selectedMenu = document.querySelector(".selected-items");
  let h1 = document.querySelector(".item-select-container").querySelector("h1");
  let h3 = document.querySelector(".item-select-container").querySelector("h3");
  let counter = document.querySelector(".counter");

  // create the accept button
  let accept = document.createElement("div");
  accept.setAttribute('class', 'accept');
  accept.innerHTML = 'ACCEPT';

  // do something when accept is clicked, depending on state of itemSet global var
  accept.onclick = function (ev) {
    // check that enough items have been chose
    if (itemSet != SelectedStarter && itemSet.length < 2) {
      alert("Please choose 2 items");
      return;
    }
    switch (itemSet) {
      case SelectedStarter:
        // remove children except for counter (whose text is updated), change itemSet to SelectedEarly and header/subheader values.
        removeAllChildNodes(selectedMenu, "counter");
        counter.innerHTML = "0/2";
        itemSet = SelectedEarly;
        h1.innerHTML = "SELECT EARLY ITEMS";
        h3.innerHTML = "the FIRST two items players should build";
        anime({
          targets: h1,
          color: '#FFD700',
          easing: 'spring(1, 80, 10, 0)',
          direction: 'reverse',
          duration: 1000,
        });
        break;
      case SelectedEarly:
        // remove children except for counter (whose text is updated), change itemSet to SelectedMid and header/subheader values.
        removeAllChildNodes(selectedMenu, "counter");
        counter.innerHTML = "0/2";
        itemSet = SelectedMid;
        h1.innerHTML = "SELECT MID ITEMS";
        h3.innerHTML = "the SECOND two items players should build";
        anime({
          targets: h1,
          color: '#FFD700',
          easing: 'spring(1, 80, 10, 0)',
          direction: 'reverse',
          duration: 1000,
        });
        break;
      case SelectedMid:
        // remove children except for counter (whose text is updated), change itemSet to SelectedLate and header/subheader values.
        removeAllChildNodes(selectedMenu, "counter");
        counter.innerHTML = "0/2";
        itemSet = SelectedLate;
        h1.innerHTML = "SELECT LATE ITEMS";
        h3.innerHTML = "the FINAL two items players should build";
        anime({
          targets: h1,
          color: '#FFD700',
          easing: 'spring(1, 80, 10, 0)',
          direction: 'reverse',
          duration: 1000,
        });
        break;
      case SelectedLate:
        // call addMeta function
        addMeta();
        markIndicator(".item-n", null, changeItems);
        break;
      default:
        // errors in case of user manipulation
        console.error("itemSet variable is invalid");
    }
  }
  // append accept button (and it's animations) to the 'selected' menu
  selectedMenu.appendChild(accept);
  anime({
    targets: document.querySelector(".accept"),
    color: '#FFD700',
    loop: true,
    easing: 'linear',
    direction: 'alternate',
  });
}

/* METADATA FUNCTIONS */
function addMeta() {
  let itemContainer = document.querySelector(".item-select-container");
  let metaContainer = document.querySelector(".meta-container");

  itemContainer.style.display = "none";
  metaContainer.style.display = "block";
}

/* POST BUILD FUNCTIONS */
function postBuild() {
  let name = document.querySelector(".title").value;
  let desc = document.querySelector(".desc").value;

  let build = {
    "name": name,
    "hero": SelectedHero,
    "role": SelectedRole,
    "desc": desc,
    "starter_items": SelectedStarter,
    "early_items": SelectedEarly,
    "mid_items": SelectedMid,
    "late_items": SelectedLate,
  }
  if (name &&
    desc &&
    SelectedHero &&
    SelectedRole &&
    SelectedStarter.length &&
    SelectedEarly.length &&
    SelectedMid.length &&
    SelectedLate.length) {
    fetch("/make/", {
        method: 'POST',
        credentials: 'same-origin',
        headers:{
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest', //Necessary to work with request.is_ajax()
            'X-CSRFToken': getCookie('csrftoken'),
    },
        body: JSON.stringify(build) //JavaScript object of data to POST
    }).then(response => {
      if (response.status == 201) {
        return response.json();
      }
      else {
        return null
      }
    }).then(body => {
      if (body) {
        window.onbeforeunload = function() {console.log("redirecting");}
        window.location.replace(`/builds/${body}`);
      }
      else {
        alert("Error posting build");
      }
    });
  }
}

/* INDICATOR FUNCTIONS */
function markIndicator(ind, new_text, callback) {
  let indContainer = document.querySelector(ind);
  let circle = indContainer.querySelector("circle");
  let line = indContainer.querySelector("line");
  let text = indContainer.querySelector("span");

  indContainer.style.cursor = "pointer";
  indContainer.onclick = function() {
    callback();
  }
  indContainer.onmouseover = function() {
     circle.style.stroke = "white";
     text.style.color = "white";
  }
  indContainer.onmouseout = function() {
    circle.style.stroke = null;
    text.style.color = "var(--accent)";
  }

  circle.style.fill = "var(--accent)";
  if (line) {line.style.stroke = "var(--accent)";}
  text.style.color = "var(--accent)";
  if (new_text) {
    text.innerHTML = new_text;
  }
}

function markMetaIndicator() {
  let name = document.querySelector(".title").value;
  let desc = document.querySelector(".desc").value;
  let pub = document.querySelector(".publish-button");

  if (name && desc) {
    markIndicator(".meta-n");
    pub.style.backgroundColor = "var(--accent)";
    pub.style.color = "white";
    pub.style.cursor = "pointer";
    pub.onclick = function() {
      postBuild();
    }
    pub.onmouseover = function() {
      pub.style.backgroundColor = "white";
      pub.style.color = "black";
    }
    pub.onmouseout = function() {
      pub.style.backgroundColor = "var(--accent)";
      pub.style.color = "white";
    }
  }
}

function changeHero() {
  let selects = document.getElementsByClassName("select");
  let heroSelect = document.querySelector(".hero-select-container");
  let roleSelect = document.querySelector(".role-select-container");

  for (let i = 0; i < selects.length; i++) {
    selects[i].style.display = "none";
  }
  heroSelect.style.display = "block";
  anime({
    targets: heroSelect,
    height: "auto",
    opacity: 1,
    easing: "easeInOutExpo",
  })
}

function changeRole() {
  let selects = document.getElementsByClassName("select");
  let roleSelect = document.querySelector(".role-select-container");

  for (let i = 0; i < selects.length; i++) {
    selects[i].style.display = "none";
  }
  roleSelect.style.display = "block";
  anime({
    targets: roleSelect,
    height: "auto",
    opacity: 1,
    easing: "easeInOutExpo",
  })
}

function changeItems() {
  SelectedStarter = [];
  SelectedEarly = [];
  SelectedMid = [];
  SelectedLate = [];

  let selects = document.getElementsByClassName("select");
  let itemSelect = document.querySelector(".item-select-container");
  let itemHeader = itemSelect.querySelector("h1");
  let itemSubHeader = itemSelect.querySelector("h3");
  let selectedItems = document.querySelector(".selected-items");
  let counter = selectedItems.querySelector(".counter");

  for (let i = 0; i < selects.length; i++) {
    selects[i].style.display = "none";
  }
  itemSet = SelectedStarter;
  itemHeader.innerHTML = "SELECT STARTER ITEMS";
  itemSubHeader.innerHTML = "the items that players should buy when the match starts (up to 3)";
  counter.innerHTML = "0/3";
  removeAllChildNodes(selectedItems, "counter");
  itemSelect.style.display = "block";
}

function changeMeta() {
  console.log("cringe");
}

/* ITEM FILTER FUNCTIONS */
function filterStat(stat) {
  let btn = document.querySelector(`.${stat}`);
  btn.style.color = "var(--accent)";
  btn.style.cursor = "default";

  let itemContainer = document.querySelector(".item-select-container").childNodes;
  for (let i = 3; i < itemContainer.length; i++) {
    let l = parseInt(itemContainer[i].id);
    if (l >= 0) {
      if (!parseStatsToArray(data.items[l].fields.stats).includes(stat)) {
        itemContainer[i].style.display = "none";
      }
    }
  }
}

function filterUnique(stat) {
  let btn = stat;
  if (stat == "Crest3" || stat == "Crest1") {
    btn = "crest";
  }
  btn = document.querySelector(`.${btn.toLowerCase()}`);
  btn.style.color = "var(--accent)";
  btn.style.cursor = "default";

  let itemContainer = document.querySelector(".item-select-container").childNodes;
  for (let i = 3; i < itemContainer.length; i++) {
    let l = parseInt(itemContainer[i].id);
    if (l >= 0) {
      let uniques = data.items[l].fields.unique_passive.split(", ");
      if (!uniques.includes(stat)) {
        itemContainer[i].style.display = "none";
      }
    }
  }
}

function filterCrest() {
  switch (itemSet) {
    case SelectedStarter:
      filterUnique("Crest1");
      break;
    default:
      filterUnique("Crest3");
  }
}

function resetFilter() {
  let btn = document.getElementsByClassName("filter-btn");
  for (let i = 0; i<btn.length; i++) {
    btn[i].style.color = null;
    btn[i].style.cursor = null;
  }

  let itemContainer = document.querySelector(".item-select-container").childNodes;
  for (let i = 3; i < itemContainer.length; i++) {
    let l = parseInt(itemContainer[i].id);
    if (l >= 0) {
      itemContainer[i].style.display = "inline-block";
    }
  }
}
