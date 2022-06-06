from datetime import datetime
from common.core import Model, db, encrypt_md5
from datetime import datetime
from uuid import uuid4
from models.Vote import Vote


class VOption(Model):
    __tablename__='vote_option'
    id = db.Column(db.Integer(), primary_key=True)

    content = db.Column(db.String(500), nullable=False)
    vote_object_id = db.Column(db.Integer(), db.ForeignKey('vote_object.id'))

    vote=db.Column(db.Integer, default=0, nullable=False)


    @staticmethod
    def create(content:str, vote_object_id:int):
        voption=VOption(content=content, vote_object_id=vote_object_id)

        try:
            db.session.add(voption)
            db.session.commit()
        except Exception as e:
            db.session.rollback()

            return False

        return True
    def update(self,vote=None, increase_vote=False):
        if increase_vote:
            self.vote = self.vote +1
        else:
            self.vote=vote
        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()

            return False

        return True

    def json(self):
        return {
            'id': self.id,
            'content':self.content,
            'vote':Vote.query.filter_by(vote_option_id=self.id).count(),
        }


        

