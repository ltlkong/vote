from datetime import datetime
from models.VOption import VOption
from common.core import Model, db, encrypt_md5
from datetime import datetime
from uuid import uuid4
from models.User import User


class VObject(Model):
    __tablename__='vote_object'
    id = db.Column(db.Integer(), primary_key=True)

    title=db.Column(db.String(100), nullable=False)
    content = db.Column(db.String(500), nullable=False)
    public_id = db.Column(db.String(100), unique=True, nullable=False)

    user_id = db.Column(db.String(100), db.ForeignKey('user.id'))
    end_date = db.Column(db.DateTime, nullable=True)
    status=db.Column(db.String(50), default='active')

    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.now)


    @staticmethod
    def create(title,content,end_date,user_id):

        vobject=VObject(title=title,content=content, end_date=datetime.strptime(end_date,'%Y-%m-%d'), user_id=user_id,public_id=str(uuid4())[:100])

        try:
            db.session.add(vobject)
            db.session.commit()
        except Exception as e:
            db.session.rollback()

            return False

        return vobject.public_id

    def json(self):
        return {
            'id':self.public_id,
            'title':self.title,
            'content':self.content,
            'end_date':str(self.end_date),
            'started_at':str(self.created_at),
            'options': list(map(lambda s: s.json(), VOption.query.filter_by(vote_object_id=self.id))),
            'start_by':User.query.filter_by(id=self.user_id).first().username,
        }


        

