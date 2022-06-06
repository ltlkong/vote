import logging
from models.VOption import VOption
from common.auth import Auth
from resources.BaseResource import BaseResource
from models.VObject import VObject
from models.User import User
from models.Vote import Vote
from flask_restful import abort
from datetime import datetime
from common.core import db

auth = Auth()

class VoteObjectCrudResource(BaseResource):
    def __init__(self):
        super().__init__()

    def get(self):
        self.parser.add_argument('username',type=str,location='args')
        self.parser.add_argument('public_id',type=str,location='args')
        received_data = self.parser.parse_args(strict=True)

        username = received_data['username']

        if username:
            user = User.query.filter_by(username=username).first()
            vobjects = VObject.query.filter_by(user_id=user.id)
        elif received_data['public_id']:
            vobjects = VObject.query.filter_by(public_id=received_data['public_id'])
        else:
            vobjects = VObject.query

        vobjects=vobjects.filter(VObject.end_date > datetime.now())

        return list(map(lambda s: s.json(), vobjects))


    @auth.verify_token
    def post(self):
        self.parser.add_argument('title',type=str,location='json',required=True, help='Title is required')
        self.parser.add_argument('content',type=str,location='json',required=True, help='Content is required')
        self.parser.add_argument('end_date',type=str,location='json',required=True, help='End date is required')

        received_data = self.parser.parse_args(strict=True)

        content=received_data['content']
        title=received_data['title']
        end_date=received_data['end_date']

        return VObject.create(title,content, end_date, auth.user_id)
    
class VoteOptionCrudResource(BaseResource):
    @auth.verify_token
    def post(self):
        self.parser.add_argument('content',type=str,location='json',required=True, help='Content is required')
        self.parser.add_argument('vote_object_id',type=str,location='json',required=True, help='Vote object is required')
        received_data = self.parser.parse_args(strict=True)

        content=received_data['content']
        vote_object_id=received_data['vote_object_id']

        vobject = VObject.query.filter_by(public_id=vote_object_id, user_id=auth.user_id).first()

        if vobject:
            return VOption.create(content,vobject.id)

        abort(400)
    
    @auth.verify_token
    def put(self):
        self.parser.add_argument('vote_option_id',type=str,location='json',required=True, help='Vote is required')
        received_data = self.parser.parse_args(strict=True)

        vote_option_id=received_data['vote_option_id']
    
        voption = VOption.query.filter_by(id=int(vote_option_id)).first();

        if Vote.query.filter_by(vote_object_id=voption.vote_object_id, user_id=auth.user_id).first():
            abort(400,message='You have already voted')
        
        if VObject.query.filter_by(id=voption.vote_object_id, user_id=auth.user_id).first():
            abort(400,message='You cannot vote for your own option')

        return Vote.create(auth.user_id, voption.vote_object_id, voption.id)

class AdminVoteOptionCrudResource(BaseResource):
    @auth.verify_token
    def get(self):
        self.parser.add_argument('vote_object_id',type=str,location='args',required=True, help='Vote is required')
        received_data = self.parser.parse_args(strict=True)
        
        vobject = VObject.query.filter_by(public_id=received_data['vote_object_id']).first()
        votes =Vote.query.filter_by(vote_object_id=vobject.id)

        return list(map(lambda s: s.json(), votes))


    @auth.verify_token
    def put(self):
        self.parser.add_argument('vote_option_id',type=str,location='json',required=True, help='Vote is required')
        self.parser.add_argument('vote',type=str,location='json',required=True, help='Vote is required')
        received_data = self.parser.parse_args(strict=True)

        if auth.user.role != 'admin':
            abort(403)

        vote_option_id=received_data['vote_option_id']
        vote=received_data['vote']
    
        voption = VOption.query.filter_by(id=int(vote_option_id)).first();

        return voption.update(vote=int(vote))
    
    @auth.verify_token
    def delete(self):
        self.parser.add_argument('vote_id',type=str,location='json',required=True, help='Vote is required')
        received_data = self.parser.parse_args(strict=True)

        if auth.user.role != 'admin':
            abort(403)

        vote_id=received_data['vote_id']
    
        Vote.query.filter_by(id=vote_id).delete()
        db.session.commit()

        return True
        


