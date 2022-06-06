from datetime import datetime
from common.core import Model, db, encrypt_md5
from datetime import datetime
from uuid import uuid4
import logging
from models.User import User


class Vote(Model):
    __tablename__='vote'
    id = db.Column(db.Integer(), primary_key=True)

    vote_object_id = db.Column(db.Integer(), db.ForeignKey('vote_object.id'))
    vote_option_id=db.Column(db.Integer(), db.ForeignKey('vote_option.id'))
    vote_option=db.relationship('VOption', backref='vote_option', lazy=True)
    user_id=db.Column(db.String(100), db.ForeignKey('user.id'))


    @staticmethod
    def create(user_id:str, vote_object_id:int, vote_option_id:int):
        vote=Vote(user_id=user_id, vote_object_id=vote_object_id, vote_option_id=vote_option_id)
        logging.info(user_id, vote_object_id, vote_option_id)

        try:
            db.session.add(vote)
            db.session.commit()
        except Exception as e:
            db.session.rollback()

            return False

        return True


    def json(self):
        return {
            'id': self.id,
            'user': User.query.filter_by(id=self.user_id).first().username,
            'option':self.vote_option.content,
            'option_id':self.vote_option_id,
        }


        

