from datetime import datetime
from common.core import Model, db, encrypt_md5
from datetime import datetime
from uuid import uuid4

class UserStatus:
    ACTIVE = 'active'
    DEACTIVE = 'deactive'
    BANNED = 'banned'



class User(Model):
    __tablename__='user'
    id = db.Column(db.String(100), primary_key=True)

    username=db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(50), nullable=False)
    role=db.Column(db.String(50), nullable=False)
    status= db.Column(db.String(50), nullable=False, default=UserStatus.ACTIVE)

    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
    last_login_at = db.Column(db.DateTime, nullable=True, default=datetime.now)

    @staticmethod
    def create(email:str, password:str, username:str, role:str):
        hash_password = encrypt_md5(password)

        user=User(id=str(uuid4())[:100],email=email, password=hash_password, username=username, role=role)

        try:
            db.session.add(user)
            db.session.commit()
        except Exception as e:
            db.session.rollback()

            return False

        return True

    def update(self,  email=None, password=None, update_login=False):
        if email:
            self.email=email
        if password:
            self.password = encrypt_md5(password)
        if update_login:
            self.last_login_at = datetime.now()

        self.updated_at=datetime.now()

        try:
            db.session.commit()
        except Exception as e:
            return False
        return True
    def json(self):
        return {
            'email':self.email,
            'username':self.username,
            'role':self.role,
        }


        

