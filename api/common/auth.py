from flask_sqlalchemy import SQLAlchemy
from flask_restful import reqparse, abort
from hashlib import md5
from functools import wraps
from flask import  current_app
import jwt
import logging
from http import HTTPStatus
from models.User import User

class Auth:
    def __init__(self):
        self.user_id = None
        self.user = None
        self.parser = reqparse.RequestParser()

    def verify_token(self,f):
        @wraps(f)
        def decorator(*args, **kwargs):
            # Getting token from header
            self.parser.add_argument('Authorization', str, location='headers', help='Token is required')
            received_data = self.parser.parse_args()

            token = received_data['Authorization']

            # Decoding token
            try:
                data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
                self.user_id = data['user_id']

                self.user=User.query.filter_by(id=self.user_id).first();

            except jwt.ExpiredSignatureError as e:
                abort(HTTPStatus.UNAUTHORIZED, message='Token expired')
            except Exception as e:
                logging.error('Something went wrong while verify_token {}'.format(str(e)))

                abort(HTTPStatus.UNAUTHORIZED, message='Invalid token')

            return f(*args, **kwargs)

        return decorator