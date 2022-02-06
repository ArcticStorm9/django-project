var statBlock = null;

window.addEventListener('load', () => {
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
  }).then(function (data) {
    const items = data;
  });

  let statArea = document.querySelector("#stat-area");
  statBlock = new StatBlock(statArea);

  itemsCollection = document.getElementsByClassName("item");
  Array.from(itemsCollection).forEach((item) => {
    id = item.className.split(" ")[1];
    loadItem(item, parseInt(id, 10));
  })
});

function loadItem(instance, id) {
  // Find item with matching pk
  let index = items.findIndex((elt, i) => {
    return elt.pk === id;
  });

  let itemInfo = items[index].fields;
  let itemName = document.createElement("div");
  itemName.style.textAlign = "center";
  itemName.innerHTML = itemInfo.name;
  instance.appendChild(itemName);
  let instanceChild = document.createElement("div");
  instanceChild.setAttribute("class", "item-info");
  instanceChild.style.display = "none"
  Object.keys(itemInfo).forEach((key) => {
    if (itemInfo[key]) {
      let attr = document.createElement("p");
      switch (key) {
        case "name":
          attr = document.createElement("h4");
          attr.innerHTML = itemInfo[key];
          attr.style.textAlign = "center";
          attr.style.marginBottom = "0.5rem";
          instanceChild.appendChild(attr);
          break;
        case "cost":
          attr.innerHTML = itemInfo[key] + " gold";
          attr.setAttribute("class", "item-attribute cost");
          attr.style.color = "gold";
          attr.style.textAlign = "center";
          attr.style.marginBottom = "0.25rem";
          instanceChild.appendChild(attr);
          break;
        case "active":
          attr.innerHTML = itemInfo[key];
          attr.setAttribute("class", "item-attribute");
          instanceChild.appendChild(attr);
          break;
        case "passive":
          attr.innerHTML = itemInfo[key];
          attr.setAttribute("class", "item-attribute");
          instanceChild.appendChild(attr);
          break;
        case "stats":
          instanceChild.appendChild(parseStats(itemInfo[key]));
          statBlock.parseAddStats(itemInfo[key]);
          statBlock.updateBody();
          break;
        default:
          break;
      }
    }
  });
  instanceChild.style.position = "relative";
  instanceChild.style.top = "155px";
  instanceChild.style.backgroundColor = "black";
  instance.appendChild(instanceChild);
}

function showHover(instance, id) {
  attr = instance.getElementsByClassName("item-info")[0];
  attr.style.display = "block";
  if (attr.getBoundingClientRect().bottom > window.innerHeight) {
    attr.style.top = `-${5 + attr.getBoundingClientRect().height}px`;
  }
}

function hideHover(instance) {
  attr = instance.getElementsByClassName("item-info")[0];
  attr.style.display = "none";
}
