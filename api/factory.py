from flask import Flask
from dotenv import dotenv_values
import logging
import logging.config
import json
from flask_restful import Api
from resources.VoteResource import VoteObjectCrudResource,VoteOptionCrudResource, AdminVoteOptionCrudResource,AdminVoteOptionCrudManageResource
from resources.AuthResource import LoginResource ,RegisterResource
from resources.UserResource import UserResource
import os

def create_app(config_type): 
    app = Flask(__name__)

    # Environment variables setup
    config = None

    if config_type == 'dev':
        config = {
            ** dotenv_values('.env') ,
        }
    else:
        config = {
            ** dotenv_values('.env.prod')
        }

    app.config.update(config)
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = config['SQLALCHEMY_TRACK_MODIFICATIONS'] == 'True'
    app.config['DEBUG'] = config['DEBUG'] == 'True'
    app.config['ENV'] = config_type

    # Log config
    logger_conf_path = config['LOGGER_CONFIG_PATH']

    if not logger_conf_path:
        raise RuntimeError('Logger config path not specified')

    logs_path = os.getcwd() + '/logs/'

    if not os.path.exists(logs_path):
       os.makedirs(logs_path)
        
    with open(logger_conf_path, 'r') as f:
        logger_conf =json.loads(f.read())

    logging.config.dictConfig(logger_conf)

    return app

def create_api(app: Flask) -> Api:
    api = Api(app)
    init_router(api)

    return api

def init_router(api: Api):
    api.add_resource(LoginResource, '/login')
    api.add_resource(RegisterResource, '/register')
    api.add_resource(UserResource, '/user')
    api.add_resource(VoteObjectCrudResource, '/vote')
    api.add_resource(VoteOptionCrudResource, '/vote/option')
    api.add_resource(AdminVoteOptionCrudResource, '/admin/vote/option')
    api.add_resource(AdminVoteOptionCrudManageResource, '/admin/vote/option/manage')

    
