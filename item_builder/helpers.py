def get_user(request):
    try:
        username = request.user
    except:
        username = None
    return username

def get_user_id(request):
    try:
        id = request.user.id
    except:
        id = None
    return id

def get_username(request):
    try:
        username = request.user.discord_tag
    except:
        username = None
    return username