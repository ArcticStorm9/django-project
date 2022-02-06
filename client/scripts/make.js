var currentItems = [];

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
  hoverHeader.style.color = "var(--gold)";
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
    hoverfield.innerHTML = field3 + " gold";
    hoverfield.style.color = "var(--gold)";
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

  /* STAT CALCULATOR */
const statLookup = {
  p_power: "Physical Power",
  m_power: "Magical Power",
  p_armor: "Physical Armor",
  m_armor: "Magical Armor",
  p_pen: "Physical Pen.",
  m_pen: "Magical Pen.",
  c_chance: "Critical Chance",
  atk_speed: "Attack Speed",
  health: "Maximum Health",
  mana: "Maximum Mana",
  h_regen: "Health Regen",
  m_regen: "Mana Regen",
  lifesteal: "Lifesteal",
  m_lifesteal: "Magical Lifesteal",
  haste: "Ability Haste",
  tenacity: "Tenacity",
  o_vamp: "Omnivamp",
  movespeed: "Move Speed"
};

function parseStats(str) {
  let div = document.createElement("div");
  let parsedStats = JSON.parse(str);
  
  Object.keys(parsedStats).forEach((key) => {
    stat = document.createElement("p");
    if (key in {"c_chance": null, "lifesteal": null, "m_lifesteal": null, "o_vamp": null}) {
      stat.innerHTML = `+${parsedStats[key]}% ${statLookup[key]}`
    }
    else {
      stat.innerHTML = `+${parsedStats[key]} ${statLookup[key]}`
    }
    stat.style.color = "var(--accent)";
    div.appendChild(stat);
  });
  return div;
}
  
function parseStatsToArray(str) {
  if (!str) {
    return [];
  }
  let nl = [];
  Object.keys(JSON.parse(str)).forEach( key => {
    nl.push(key);
  });
  return nl;
}

/* USEFUL MISC FUNCTIONS */
function removeAllChildNodes(parent, e=null) {
  while (parent.lastChild && parent.lastChild.className !== e) {
    parent.removeChild(parent.lastChild);
  }
}
  
function createChildDiv(parent, className, value=null) {
  div = document.createElement("div");
  div.setAttribute("class", className);
  div.innerHTML = value;
  parent.appendChild(div);
}

/* ITEM INTERACTION */
class Item {
  constructor(name, active, passive, cost, stats, uniques) {
    this.name = name;
    this.active = active;
    this.passive = passive;
    this.cost = cost;
    this.stats = JSON.parse(stats);
    this.uniques = uniques.split(", ");
  }
}

function addItem(name, active, passive, cost, stats, uniques) {
  if (checkItem(uniques.split(", "))) {
    let item = new Item(name, active, passive, cost, stats, uniques);
    currentItems.push(item);

    updateCurrent();
  }
}

function checkItem(uniques) {
  if (currentItems.length < 6) {
    for (let i = 0; i < currentItems.length; i++) {
      for (let j = 0; j < currentItems[i].uniques.length; j++) {
        if ( currentItems[i].uniques[j] && uniques.includes(currentItems[i].uniques[j]) ) {
          alert("You cannot stack unique passives");
          return false;
        }
      }
    }
    return true;
  }
  else {
    alert("TOO MANY ITEMS");
    return false;
  }
}

function updateCurrent() {
  console.log(currentItems);
  let inventory = document.querySelector(".current-items");
  let statNums = document.getElementsByClassName("stat-num");

  for (let i = 0; i < statNums.length; i++) {
    statNums[i].innerHTML = "0";
  }
  inventory.innerHTML = "";
  for (let i = 0; i < currentItems.length; i++) {
    inventory.innerHTML += currentItems[i].name + " ";

    calculateStats(currentItems[i].stats);
  }
}

function calculateStats(stats) {
  Object.keys(stats).forEach((key) => {
    let s = document.querySelector(`.${key}`);
    let cur = parseInt(s.innerHTML);
    cur += stats[key];
    s.innerHTML = cur;
  });
}

/* SORTS */
var sorts = [];

function handleSort(sort) {
  if (sorts.includes(sort)) {
    removeSort(sort);
  }
  else {
    addSort(sort);
  }
  refreshSorts();
}

function addSort(sort) {
  sorts.push(sort);
}

function removeSort(sort) {
  for (let i = 0; i < sorts.length; i++) {
    if (sorts[i] == sort) {
      sorts = sorts.splice(i, 1);
      break;
    }
  }
}

/*function refreshSorts() {
  let items = document.getElementsByClassName("item");

  for (let i = 0; i < items.length; i++) {
    let stats = items.querySelector("span");
    stats = JSON.parse(stats);
    Object.keys(stats).forEach((key) => {
      if (sorts.includes(key)) {
        break;
      }
      
    });
  }
}*/