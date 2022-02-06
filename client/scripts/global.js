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

function userMenu() {
	let menu = document.getElementsByClassName("menu-container")[0];
	if (menu.offsetHeight == 0) {
		anime({
			targets: menu,
			height: '12rem'
		});
	}
	else {
		anime({
			targets: menu,
			height: '0',
			easing: 'easeInOutExpo'
		});
	}
}

function miscMenu() {
	let menu = document.getElementsByClassName("menu-container")[1];
	if (menu.offsetHeight == 0) {
		anime({
			targets: menu,
			height: '12rem'
		});
	}
	else {
		anime({
			targets: menu,
			height: '0',
			easing: 'easeInOutExpo'
		});
	}
}

function sortByIntKey(obj, key) {
	if (key != "pk") {
		obj.sort(function (a, b) {
			return a.fields[key] - b.fields[key];
		});
	} else {
		obj.sort(function (a, b) {
			return a.pk - b.pk;
		});
	}
}

function sortByTextKey(obj, key) {
	obj.sort(function (a, b) {
		var nameA = a.fields[key].toUpperCase(); // ignore upper and lowercase
		var nameB = b.fields[key].toUpperCase(); // ignore upper and lowercase
		if (nameA < nameB) {
			return -1;
		}
		if (nameA > nameB) {
			return 1;
		}
		// names must be equal
		return 0;
	});
}

class StatBlock {
	constructor(parent) {
		this.stats = {
			"p_power": 0,
		  "m_power": 0,
		  "p_armor": 0,
		  "m_armor": 0,
		  "p_pen": 0,
		  "m_pen": 0,
		  "c_chance": 0,
		  "atk_speed": 0,
		  "health": 0,
		  "mana": 0,
		  "h_regen": 0,
		  "m_regen": 0,
		  "lifesteal": 0,
		  "m_lifesteal": 0,
		  "haste": 0,
		  "tenacity": 0,
		  "o_vamp": 0,
			"movespeed": 0
		};
		this.statBody = this.createBody();
		this.renderBody(parent);
	}

	createBody() {
		let statBody = document.createElement("div");
		statBody.setAttribute("class", "stat-body");
		return statBody;
	}

	renderBody(parent) {
		let lGray = "#141314";

		let pPower = document.createElement("div");
		pPower.setAttribute("class", "stat p_power");
		createChildDiv(pPower, "name", "Physical Power");
		createChildDiv(pPower, "value", this.stats["p_power"]);
		this.statBody.appendChild(pPower);

		let mPower = document.createElement("div");
		mPower.setAttribute("class", "stat m_power");
		mPower.style.color = lGray;
		createChildDiv(mPower, "name", "Magical Power");
		createChildDiv(mPower, "value", this.stats["m_power"]);
		this.statBody.appendChild(mPower);

		let pArmor = document.createElement("div");
		pArmor.setAttribute("class", "stat p_armor");
		createChildDiv(pArmor, "name", "Physical Armor");
		createChildDiv(pArmor, "value", this.stats["p_armor"]);
		this.statBody.appendChild(pArmor);

		let mArmor = document.createElement("div");
		mArmor.setAttribute("class", "stat m_armor");
		mArmor.style.color = lGray;
		createChildDiv(mArmor, "name", "Magical Armor");
		createChildDiv(mArmor, "value", this.stats["m_armor"]);
		this.statBody.appendChild(mArmor);

		let pPen = document.createElement("div");
		pPen.setAttribute("class", "stat p_pen");
		createChildDiv(pPen, "name", "Physical Pen.");
		createChildDiv(pPen, "value", this.stats["p_pen"]);
		this.statBody.appendChild(pPen);

		let mPen = document.createElement("div");
		mPen.setAttribute("class", "stat m_pen");
		mPen.style.color = lGray;
		createChildDiv(mPen, "name", "Magical Pen.");
		createChildDiv(mPen, "value", this.stats["m_pen"]);
		this.statBody.appendChild(mPen);

		let cChance = document.createElement("div");
		cChance.setAttribute("class", "stat c_chance");
		createChildDiv(cChance, "name", "Critical Chance");
		createChildDiv(cChance, "value", this.stats["c_chance"]);
		this.statBody.appendChild(cChance);

		let atkSpeed = document.createElement("div");
		atkSpeed.setAttribute("class", "stat atk_speed");
		atkSpeed.style.color = lGray;
		createChildDiv(atkSpeed, "name", "Attack Speed");
		createChildDiv(atkSpeed, "value", this.stats["atk_speed"]);
		this.statBody.appendChild(atkSpeed);

		let health = document.createElement("div");
		health.setAttribute("class", "stat health");
		createChildDiv(health, "name", "Max Health");
		createChildDiv(health, "value", this.stats["health"]);
		this.statBody.appendChild(health);

		let mana = document.createElement("div");
		mana.setAttribute("class", "stat mana");
		mana.style.color = lGray;
		createChildDiv(mana, "name", "Max Mana");
		createChildDiv(mana, "value", this.stats["mana"]);
		this.statBody.appendChild(mana);

		let hRegen = document.createElement("div");
		hRegen.setAttribute("class", "stat h_regen");
		createChildDiv(hRegen, "name", "Health Regen.");
		createChildDiv(hRegen, "value", this.stats["h_regen"]);
		this.statBody.appendChild(hRegen);

		let mRegen = document.createElement("div");
		mRegen.setAttribute("class", "stat m_regen");
		mRegen.style.color = lGray;
		createChildDiv(mRegen, "name", "Mana Regen.");
		createChildDiv(mRegen, "value", this.stats["m_regen"]);
		this.statBody.appendChild(mRegen);

		let lifesteal = document.createElement("div");
		lifesteal.setAttribute("class", "stat lifesteal");
		createChildDiv(lifesteal, "name", "Lifesteal");
		createChildDiv(lifesteal, "value", this.stats["lifesteal"]);
		this.statBody.appendChild(lifesteal);

		let mLifesteal = document.createElement("div");
		mLifesteal.setAttribute("class", "stat m_lifesteal");
		mLifesteal.style.color = lGray;
		createChildDiv(mLifesteal, "name", "Magical Lifesteal");
		createChildDiv(mLifesteal, "value", this.stats["m_lifesteal"]);
		this.statBody.appendChild(mLifesteal);

		let haste = document.createElement("div");
		haste.setAttribute("class", "stat haste");
		createChildDiv(haste, "name", "Ability Haste");
		createChildDiv(haste, "value", this.stats["haste"]);
		this.statBody.appendChild(haste);

		let tenacity = document.createElement("div");
		tenacity.setAttribute("class", "stat tenacity");
		tenacity.style.color = lGray;
		createChildDiv(tenacity, "name", "Tenacity");
		createChildDiv(tenacity, "value", this.stats["tenacity"]);
		this.statBody.appendChild(tenacity);

		let oVamp = document.createElement("div");
		oVamp.setAttribute("class", "stat o_vamp");
		createChildDiv(oVamp, "name", "Omni-Vamp");
		createChildDiv(oVamp, "value", this.stats["o_vamp"]);
		this.statBody.appendChild(oVamp);

		let mSpeed = document.createElement("div");
		mSpeed.setAttribute("class", "stat movespeed");
		mSpeed.style.color = lGray;
		createChildDiv(mSpeed, "name", "Move Speed");
		createChildDiv(mSpeed, "value", this.stats["movespeed"]);
		this.statBody.appendChild(mSpeed);

		parent.appendChild(this.statBody);
	}

	updateBody() {
		let stats = this.statBody.getElementsByClassName("stat");

		Array.from(stats).forEach((stat) => {
			let value = stat.querySelector(".value");
			let statKey = stat.className.split(" ")[1];
			value.innerHTML = this.stats[statKey];
		});
	}

	zeroStats() {
		Object.keys(this.stats).forEach((key) => {
			this.stats[key] = 0;
		});
	}

	setStat(statKey, value) {
		this.stats[statKey] = value;
	}

	addStat(statKey, value) {
		this.stats[statKey] += value;
	}

	minusStat(statKey, value) {
		this.stats[statKey] -= value;
	}

	parseAddStats(str) {
		let parsedStats = JSON.parse(str);

		Object.keys(parsedStats).forEach((key) => {
			this.stats[key] += parsedStats[key];
		});
	}

	parseMinusStats(str) {
		let parsedStats = JSON.parse(str);

		Object.keys(parsedStats).forEach((key) => {
			this.stats[key] -= parsedStats[key];
		});
	}
}

function createChildDiv(parent, className, value=null) {
	div = document.createElement("div");
	div.setAttribute("class", className);
	div.innerHTML = value;
	parent.appendChild(div);
}

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

function getCookie(name) {
      let cookieValue = null;
      if (document.cookie && document.cookie !== '') {
          const cookies = document.cookie.split(';');
          for (let i = 0; i < cookies.length; i++) {
              const cookie = cookies[i].trim();
              // Does this cookie string begin with the name we want?
              if (cookie.substring(0, name.length + 1) === (name + '=')) {
                  cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                  break;
              }
          }
      }
      return cookieValue;
}

function removeAllChildNodes(parent, e=null) {
  while (parent.lastChild && parent.lastChild.className !== e) {
    parent.removeChild(parent.lastChild);
  }
}
