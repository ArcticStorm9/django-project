from django.shortcuts import render, redirect
from django.core import serializers
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseForbidden, HttpRequest, JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.views.generic.detail import DetailView
from django.views.generic.list import ListView
from .models import Heroes, Builds, Items, DiscordUser
from .admin import get_admins, get_whitelist
from .helpers import *
import requests
import json

# sudo /etc/init.d/mysql start

def home(request):
    context = {
        'user': get_user(request),
    }
    return render(request, 'item_builder/home.html', context)

@login_required(login_url='/auth/login')
def items(request):
    items = serializers.serialize('json', Items.objects.order_by('cost'))
    return JsonResponse(items, safe=False)

@login_required(login_url='/auth/login')
def heroes(request):
    heroes = serializers.serialize('json', Heroes.objects.all())
    return JsonResponse(heroes, safe=False)

class BuildListView(ListView):
    model = Builds
    context_object_name = "builds"
    ordering = ['-score']
    paginate_by = 10  # if pagination is desired

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['username'] = get_username(self.request)
        context['heroes'] = Heroes.objects.all()
        return context

@login_required(login_url='/auth/login')
def get_authenticated_user(request):
    if request.user.discord_tag in get_whitelist():
        request.user.is_whitelisted = True
        request.user.save()
    return redirect('home-page')

def builder(request):
    #if not request.user.is_whitelisted:
    #    return redirect("https://www.youtube.com/watch?v=dQw4w9WgXcQ")

    if request.method == 'GET':

        context = {
            'user': get_user(request),
            'heroes': Heroes.objects.order_by('name'),
            'items': Items.objects.order_by('cost'),
        }
        return render(request, 'item_builder/make.html', context)

    elif request.method == 'POST':
        build_author = request.user
        display_name = request.user.discord_tag.split("#")[0]
        build_data = json.load(request)
        if len(Heroes.objects.filter(name=build_data["hero"])) == 0:
            return HttpResponseBadRequest("Specified hero does not exist!")
        else:
            build_hero = Heroes.objects.filter(name=build_data["hero"]).first()

        try:
            build_name = build_data["name"]
            build_role = build_data["role"]
            build_desc = build_data["desc"]
            build_starter_items = build_data["starter_items"]
            build_early_items = build_data["early_items"]
            build_mid_items = build_data["mid_items"]
            build_late_items = build_data["late_items"]
        except KeyError:
            return HttpResponseBadRequest("One of the required fields had no values.")

        if len(Builds.objects.filter(author=build_author)) > 50:
            return HttpResponseBadRequest("You've already made 50 builds!")

        build = Builds(name=build_name, hero=build_hero, role=build_role, desc=build_desc, starter_items=build_starter_items, early_items=build_early_items, mid_items=build_mid_items, late_items=build_late_items, author=build_author, author_display_name=display_name)
        build.save()
        return HttpResponse(str(build.id), status=201)

class BuildDetailView(DetailView):
    model = Builds
    template_name = 'item_builder/builds_detail.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['items'] = serializers.serialize("json", Items.objects.all())
        context['user'] = get_user(self.request)
        return context

@login_required(login_url='/auth/login')
def user_builds(request):
    if not request.user.is_whitelisted:
        return redirect("https://www.youtube.com/watch?v=dQw4w9WgXcQ")

    heroes = serializers.serialize("json", Heroes.objects.all())
    items = serializers.serialize("json", Items.objects.all())
    context = {
        'user': get_user(request),
        'builds': Builds.objects.filter(author=request.user),
        'heroes': heroes,
        'items': items,
    }
    return render(request, 'item_builder/user_builds.html', context)

def admin(request):
    userId = get_user_id(request)
    username = get_username(request)
    if userId and (userId in get_admins()):
        if request.method == 'GET':
            context = {
                'username': get_username(request),
                'accounts': serializers.serialize("json", DiscordUser.objects.all()),
                'builds': serializers.serialize("json", Builds.objects.all()),
                'heroes': serializers.serialize("json", Heroes.objects.all()),
                'items': serializers.serialize("json", Items.objects.all()),
            }
            return render(request, 'item_builder/admin.html', context)

        elif request.method == 'POST':
            if "X-Resource" not in request.headers:
                print("Error accessing resource")
                return JsonResponse({"Status": "Error, bad request"})
            if request.headers["X-Resource"] == "heroes":
                hero_data = json.load(request)

                hero_name = hero_data['name']
                hero_q = hero_data['Q']
                hero_e = hero_data['E']
                hero_r = hero_data['R']
                hero_rmb = hero_data['RMB']
                hero_passive = hero_data['passive']
                hero_stats = hero_data['stats']
                hero_desc = hero_data['desc']
                hero_img_src = hero_data['img_src']

                hero = Heroes(name=hero_name, img_src=hero_img_src, desc=hero_desc, Q=hero_q, E=hero_e, R=hero_r, RMB=hero_rmb, passive=hero_passive, stats=hero_stats)
                hero.save()
                print("%s just added" % username, hero_name, "to the db")
                return HttpResponse("Success", status=201)
            elif request.headers["X-Resource"] == "items":
                item_data = json.load(request)

                item_name = item_data['name']
                item_cost = item_data['cost']
                item_active = item_data['active']
                item_passive = item_data['passive']
                item_stats = item_data['stats']
                item_uniques = item_data['uniques']

                item = Items(name=item_name, cost=item_cost, active=item_active, passive=item_passive, stats=item_stats, unique_passive=item_uniques)
                item.save()
                print("%s just added" % username, item_name, "to the db")
                return HttpResponse("Success", status=201)
            elif request.headers["X-Resource"] == "accounts":
                account_name = json.load(request)
                user = DiscordUser.objects.filter(discord_tag=account_name).first()
                user.is_whitelisted = True
                user.save()
                print("%s just whitelisted" % username, account_name)
                return HttpResponse("Success", status=201)

        elif request.method == 'DELETE':
            if "X-Resource" not in request.headers:
                print("Error accessing resource")
                return HttpResponseBadRequest("Specified resource does not exist!")
            if request.headers["X-Resource"] == "heroes":
                hero_name = json.load(request)['hero-name']
                hero = Heroes.objects.filter(name=hero_name).first()
                hero.delete()
                print("%s just deleted" % username, hero_name, "from the db")
                return HttpResponse("Success")
            elif request.headers["X-Resource"] == "items":
                item_id = json.load(request)['item-id']
                item = Items.objects.filter(id=item_id).first()
                item.delete()
                print("%s just deleted" % username, item_id, "from the db")
                return HttpResponse("Success")

        elif request.method == 'PUT':
            if "X-Resource" not in request.headers:
                print("Error accessing resource")
                return HttpResponseBadRequest("Specified resource does not exist!")
            if request.headers["X-Resource"] == "heroes":
                hero_data = json.load(request)

                hero_name = hero_data['name']
                hero_q = hero_data['Q']
                hero_e = hero_data['E']
                hero_r = hero_data['R']
                hero_rmb = hero_data['RMB']
                hero_passive = hero_data['passive']
                hero_stats = hero_data['stats']
                hero_desc = hero_data['desc']
                hero_img_src = hero_data['img_src']

                hero = Heroes.objects.filter(name=hero_name).first()
                hero.Q = hero_q
                hero.E = hero_e
                hero.R = hero_r
                hero.RMB = hero_rmb
                hero.passive = hero_passive
                hero.stats = hero_stats
                hero.desc = hero_desc
                hero.img_src = hero_img_src
                hero.save()
                print("%s just edited" % username, hero_name)
                return HttpResponse("Success")
            elif request.headers["X-Resource"] == "items":
                item_data = json.load(request)

                item_pk = item_data["id"]
                item_name = item_data['name']
                item_cost = item_data['cost']
                item_active = item_data['active']
                item_passive = item_data['passive']
                item_stats = item_data['stats']
                item_uniques = item_data['uniques']

                item = Items.objects.filter(id=item_pk).first()
                item.name = item_name
                item.cost = int(item_cost)
                item.active = item_active
                item.passive = item_passive
                item.stats = item_stats
                item.unique_passive = item_uniques
                item.save()
                print("%s just edited" % username, item_name)
                return HttpResponse("Success")
    else:
        return redirect("/")

# DISCORD BULLSHITTERY

auth_url_discord: str = "https://discord.com/api/oauth2/authorize?client_id=848402837875720252&redirect_uri=https%3A%2F%2Fpredbuilder.com%2Fauth%2Flogin%2Fredirect&response_type=code&scope=identify"

def discord_login(request):
    context = {
        'username': get_username(request),
        'auth_url': auth_url_discord,
    }
    return render(request, 'item_builder/signin.html', context)

def discord_logout(request):
    logout(request)
    return redirect("/")

def discord_login_redirect(request):
    code = request.GET.get('code')
    user = exchange_code(code)
    discord_user = authenticate(request, user=user)
    try:
        discord_user = list(discord_user).pop()
    except:
        discord_user = discord_user
    login(request, discord_user)
    return redirect("/auth/user")

def exchange_code(code):
    data = {
        "client_id": "848402837875720252",
        "client_secret": "pzyfCd3yNfGBTWhe_e_aC_HGHtdklUA6",
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": "https://predbuilder.com/auth/login/redirect",
        "scope": "identify"
    }
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    response = requests.post("https://discord.com/api/oauth2/token", data, headers)
    credentials = response.json()
    access_token = credentials['access_token']
    response = requests.get("https://discord.com/api/v6/users/@me", headers={
        'Authorization': 'Bearer %s' % access_token
    })
    user = response.json()
    return user
