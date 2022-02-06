from django.contrib.auth import models

class DiscordUserAuthManager(models.UserManager):

    def create_new_discord_user(self, user):
        discord_tag = '%s#%s' % (user['username'], user['discriminator'])
        if user['avatar']:
            user_avatar = user['avatar']
        else:
            user_avatar = ""
        new_user = self.create(
            id = user['id'],
            avatar = user_avatar,
            public_flags = user['public_flags'],
            flags = user['flags'],
            locale = user['locale'],
            mfa_enabled = user['mfa_enabled'],
            discord_tag = discord_tag
        )
        return new_user
