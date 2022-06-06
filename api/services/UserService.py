import logging
from uuid import uuid4
from common.responses import  success
from models.User import User
from common.core import encrypt_md5, generate_token
from utils.verify_email import verify_email
from flask_restful import abort

class UserService:
    def register(self, email:str, password:str, username:str,role:str):
        if not verify_email(email):
            abort(400, message='Email is not valid')

        if len(password) < 8:
            abort(400, message='Password must be at least 8 characters')

        if User.query.filter_by(email=email).first() or User.query.filter_by(username=username).first():
            logging.info('User {} already exists'.format(email))
            abort(400, message='User already exists')
            
        if not User.create(email,password, username,role):
            abort(500, message='Failed to create user')
        
        logging.info('User created {}'.format(email))
        
        return success('Registration success', {
                           'email':email
                       }, 201)

    def login(self, username:str, password:str):
        hash_password = encrypt_md5(password)

        user = User.query.filter_by(username=username, password=hash_password).first()

        if not user: 
            abort(400, message='Username or password is not valid')

        token = generate_token({
            'user_id': user.id
        },1)

        user.update(update_login=True)

        logging.info('User logged in {}'.format(username))

        return success('Login success',{
                           'token':token,
                           'exp': 3
                       })
    
    def get_user(self, user_id:str):
        user=User.query.filter_by(id=user_id).first()
        
        return user.json();

