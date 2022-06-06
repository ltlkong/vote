from common.auth import Auth
from services.UserService import UserService
from resources.BaseResource import BaseResource

auth = Auth()

class UserResource(BaseResource):
    def __init__(self):
        super().__init__()
        self.user_service = UserService()

    @auth.verify_token
    def get(self):
        return self.user_service.get_user(str(auth.user_id) )