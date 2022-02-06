from django.db import models
from django.utils import timezone
from .managers import DiscordUserAuthManager

class DiscordUser(models.Model):

    objects = DiscordUserAuthManager()

    id = models.BigIntegerField(primary_key=True)
    discord_tag = models.CharField(max_length=100)
    avatar = models.CharField(max_length=100)
    public_flags = models.IntegerField()
    flags = models.IntegerField()
    locale = models.CharField(max_length=100)
    mfa_enabled = models.BooleanField()
    last_login = models.DateTimeField(null=True)
    liked_builds = models.JSONField(default=list)
    is_whitelisted = models.BooleanField(default=False)
    is_banned = models.BooleanField(default=False)

    def is_authenticated(self, request):
        return True


class Heroes(models.Model):

    name = models.CharField(max_length=25, primary_key=True)
    img_src = models.CharField(max_length=50)
    desc = models.TextField()
    Q = models.CharField(max_length=250, default="")
    E = models.CharField(max_length=250, default="")
    R = models.CharField(max_length=250, default="")
    RMB = models.CharField(max_length=250, default="")
    passive = models.CharField(max_length=250, default="")
    stats = models.TextField()


class Builds(models.Model):

    name = models.CharField(max_length=25)
    hero = models.ForeignKey(Heroes, on_delete=models.CASCADE)
    role = models.CharField(max_length=10, default="")
    desc = models.CharField(max_length=250)
    starter_items = models.JSONField()
    early_items = models.JSONField()
    mid_items = models.JSONField()
    late_items = models.JSONField()
    author = models.ForeignKey(DiscordUser, on_delete=models.CASCADE)
    author_display_name = models.CharField(max_length=25, default="User")
    date_created = models.DateTimeField(default=timezone.now)
    score = models.IntegerField(default=0)
    hidden = models.BooleanField(default=False)


class Items(models.Model):

    name = models.CharField(max_length=25)
    cost = models.IntegerField()
    active = models.TextField()
    passive = models.TextField()
    stats = models.TextField()
    unique_passive = models.CharField(max_length=75)
