from django.contrib import admin
from .models import DiscordUser, Heroes, Builds, Items
import os.path
import json

item_fin = open(os.path.dirname(__file__) + '/../data/items.json', 'r')
hero_fin = open(os.path.dirname(__file__) + '/../data/heroes.json', 'r')
items = json.load(item_fin)
heroes = json.load(hero_fin)

def initialize_db():
    insert_heroes()

    insert_items()
    fix_items(Items.objects.all())

def get_admins():
    admins = [195625118007951360, 314162628400250900]
    return admins

def get_whitelist():
    return [
        "'Tis I, Bear.#1793",
        "♔ Intharth ♔#8677",
        "3rd place player#0742",
        "4rcheniX#4628",
        "5n1perhol1c#8669",
        "Adri_7#4923",
        "Apex#1743",
        "ArcticStorm9#6506",
        "Arkokin#5080",
        "Arzi#3129",
        "Blackhaz#3704",
        "Bloodmordius#3819",
        "BlueJ#3508",
        "BobaTheFATT#9999",
        "Clearcast#7628",
        "Colorwolfy#3806",
        "corrocorro#9416",
        "CptnR3dbeard#1780",
        "Crazy-K#0362",
        "CynicUK#5758",
        "Darunya#3564",
        "Deicide#4507",
        "Demonde#0945",
        "DemonicTrail#0906",
        "Denders-NL#9371",
        "Eldritch Reign#6470",
        "Flashorade#9400",
        "Forsaken Mythos#8512",
        "Foxforylation#2860",
        "Fringe#6055",
        "GGabi#2510",
        "H0resT#2423",
        "iCameron#6349",
        "importjg#2029",
        "Ish#6835",
        "Jaymeight#0040",
        "JohnnieVersace#3763",
        "JTGooden#3493",
        "JuliLatina#9406",
        "Kalo#0001",
        "Kemanorel#0316",
        "Kharma#5527",
        "Kieran#2472",
        "KingOfProgramz#2401",
        "Knightbird#7964",
        "Malixz#3370",
        "Mansour#4833",
        "Mojoz#4920",
        "mort#2724",
        "mr.meds#6534",
        "MyTech9#6563",
        "Narendur#7541",
        "Nate_Holmes#8469",
        "Neft#3015",
        "NickEagle#3640",
        "NovaBunny#5516",
        "OakOwl#9384",
        "PrimeKnight#9197",
        "RadioSilence#3473",
        "Ragnar#9805",
        "Rei 王#1938",
        "rgsace#0001",
        "Ruba.#6059",
        "RulerSP#3754",
        "RyanHen#7466",
        "Saint Belphegor#2427",
        "salamander#3074",
        "SAM#6676",
        "Savvy#9636",
        "Scadoopydoopy#4349",
        "Sense#2439",
        "SergeantSmokie#5665",
        "Seth Lynch#5026",
        "Shynn#1522",
        "Snitch#3765",
        "SNZ#1332",
        "Spark#7800",
        "Tang#4790",
        "Teriander#4597",
        "The Hakon#1337",
        "TheRedPandalorian#3713",
        "Tokflyt#2317",
        "Traaan#3715",
        "Tygastripe#1719",
        "Vatax#4015",
        "Vigginn#9196",
        "Weeoew#9081",
        "wireangel#8439",
        "wrldE#2544",
        "Xinu#0001"
    ]

def print_heroes():
    for hero in heroes:
        print(hero["name"], hero["img_src"], hero["desc"], hero["Q"], hero["E"], hero["R"], hero["RMB"], hero["passive"], hero["stats"])

def insert_heroes():
    for hero in heroes:
        new = Heroes(name=hero["name"], img_src=hero["img_src"], desc=hero["desc"], Q=hero["Q"], E=hero["E"], R=hero["R"], RMB=hero["RMB"], passive=hero["passive"], stats=hero["stats"])
        new.save()

def print_items():
    for item in items:
        if not item['active']:
            active = ""
        else:
            active = item['active']

        if not item['passive']:
            passive = ""
        else:
            passive = item['passive']

        if not item['cost']:
            cost = 0
        else:
            cost = item['cost']
        stats = str(item['stats'])
        try:
            if len(item['unique-passive']) <= 0:
                uniques = ""
            else:
                uniques = item['unique-passive'][0]
                for i in range(1, len(item['unique-passive'])):
                    uniques += ", " + item['unique-passive'][i]
        except KeyError:
            uniques = ""
        print(item['name'], cost, active, passive, stats, uniques)

def insert_items():
    for item in items:
        if not item['active']:
            active = ""
        else:
            active = item['active']

        if not item['passive']:
            passive = ""
        else:
            passive = item['passive']

        if not item['cost']:
            cost = 0
        else:
            cost = item['cost']
        stats = str(item['stats'])
        try:
            if len(item['unique-passive']) <= 0:
                uniques = ""
            else:
                uniques = item['unique-passive'][0]
                for i in range(1, len(item['unique-passive'])):
                    uniques += ", " + item['unique-passive'][i]
        except KeyError:
            uniques = ""
        insert_single_item(item['name'], cost, active, passive, stats, uniques)

def insert_single_item(item_name, item_cost, item_active, item_passive, item_stats, item_unique_passive):
    item = Items(name=item_name, cost=item_cost, active=item_active, passive=item_passive, stats=item_stats, unique_passive=item_unique_passive)
    item.save()

def fix_items(items):
    for item in items:
        old = item.stats
        new = parse_old(old)
        item.stats = new
        item.save()

def parse_old(old):
    old = list(old)
    for i in range(len(old)):
        if old[i] == "'":
            old[i] = '"'
    old = to_string(old)
    return old

def to_string(arr):
    word = ""
    for char in arr:
        word += char
    return word
