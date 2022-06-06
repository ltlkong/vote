from common.auth import Auth
from services.UserService import UserService
from resources.BaseResource import BaseResource

auth = Auth()

class BaseAuthResource(BaseResource):
    def __init__(self):
        super().__init__()
        self.user_service = UserService()

class LoginResource(BaseAuthResource):
    # Login
    def post(self):
        self.parser.add_argument('username',type=str,location='json',required=True, help='Username is required')
        self.parser.add_argument('password',type=str,location='json',required=True, help='Password is required')
        received_data = self.parser.parse_args(strict=True)

        username=received_data['username']
        password = received_data['password']

        return self.user_service.login(username, password)

class RegisterResource(BaseAuthResource):
    # Register a new user
    def post(self):
        self.parser.add_argument('username',type=str,location='json',required=True, help='Username is required')
        self.parser.add_argument('email',type=str,location='json',required=True, help='Email is required')
        self.parser.add_argument('password',type=str,location='json',required=True, help='Password is required')
        self.parser.add_argument('master_key',type=str,location='json',required=False)
        received_data = self.parser.parse_args(strict=True)

        username = received_data['username']
        email = received_data['email']
        password = received_data['password']
        master_key = received_data['master_key']

        if(master_key and master_key == 'abc'):
            return self.user_service.register(email, password, username, 'admin')

        return self.user_service.register(email, password, username, 'user')
