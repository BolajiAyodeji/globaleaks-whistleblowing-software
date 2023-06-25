# -*- coding: UTF-8
import os
import shutil

from globaleaks.db.migrations.update import MigrationBase
from globaleaks.models import Model
from globaleaks.models.enums import _Enum, EnumUserRole
from globaleaks.models.properties import *
from globaleaks.settings import Settings
from globaleaks.utils.utility import datetime_never, datetime_now, datetime_null


class EnumMessageType(_Enum):
    whistleblower = 0
    receiver = 1


class Message_v_64(Model):
    __tablename__ = 'message'

    id = Column(UnicodeText(36), primary_key=True, default=uuid4)
    creation_date = Column(DateTime, default=datetime_now, nullable=False)
    receivertip_id = Column(UnicodeText(36), nullable=False, index=True)
    content = Column(UnicodeText, nullable=False)
    type = Column(Enum(EnumMessageType), nullable=False)
    new = Column(Boolean, default=True, nullable=False)


class InternalTip_v_64(Model):
    __tablename__ = 'internaltip'

    id = Column(UnicodeText(36), primary_key=True, default=uuid4)
    tid = Column(Integer, default=1, nullable=False)
    creation_date = Column(DateTime, default=datetime_now, nullable=False)
    update_date = Column(DateTime, default=datetime_now, nullable=False)
    context_id = Column(UnicodeText(36), nullable=False)
    progressive = Column(Integer, default=0, nullable=False)
    tor = Column(Boolean, default=False, nullable=False)
    mobile = Column(Boolean, default=False, nullable=False)
    score = Column(Integer, default=0, nullable=False)
    expiration_date = Column(DateTime, default=datetime_never, nullable=False)
    reminder_date = Column(DateTime, default=datetime_never, nullable=False)
    enable_two_way_comments = Column(Boolean, default=True, nullable=False)
    enable_attachments = Column(Boolean, default=True, nullable=False)
    enable_whistleblower_identity = Column(Boolean, default=False, nullable=False)
    important = Column(Boolean, default=False, nullable=False)
    label = Column(UnicodeText, default='', nullable=False)
    last_access = Column(DateTime, default=datetime_now, nullable=False)
    status = Column(UnicodeText(36), nullable=True)
    substatus = Column(UnicodeText(36), nullable=True)
    receipt_hash = Column(UnicodeText(128), nullable=False)
    crypto_prv_key = Column(UnicodeText(84), default='', nullable=False)
    crypto_pub_key = Column(UnicodeText(56), default='', nullable=False)
    crypto_tip_pub_key = Column(UnicodeText(56), default='', nullable=False)
    crypto_tip_prv_key = Column(UnicodeText(84), default='', nullable=False)
    crypto_files_pub_key = Column(UnicodeText(56), default='', nullable=False)


class ReceiverTip_v_64(Model):
    __tablename__ = 'receivertip'

    id = Column(UnicodeText(36), primary_key=True, default=uuid4)
    internaltip_id = Column(UnicodeText(36), nullable=False)
    receiver_id = Column(UnicodeText(36), nullable=False, index=True)
    access_date = Column(DateTime, default=datetime_null, nullable=False)
    last_access = Column(DateTime, default=datetime_null, nullable=False)
    last_notification = Column(DateTime, default=datetime_null, nullable=False)
    new = Column(Boolean, default=True, nullable=False)
    enable_notifications = Column(Boolean, default=True, nullable=False)
    crypto_tip_prv_key = Column(UnicodeText(84), default='', nullable=False)
    crypto_files_prv_key = Column(UnicodeText(84), default='', nullable=False)


class User_v_64(Model):
    __tablename__ = 'user'

    id = Column(UnicodeText(36), primary_key=True, default=uuid4)
    tid = Column(Integer, default=1, nullable=False)
    creation_date = Column(DateTime, default=datetime_now, nullable=False)
    username = Column(UnicodeText, default='', nullable=False)
    salt = Column(UnicodeText(24), default='', nullable=False)
    hash_alg = Column(UnicodeText, default='ARGON2', nullable=False)
    password = Column(UnicodeText, default='', nullable=False)
    name = Column(UnicodeText, default='', nullable=False)
    description = Column(JSON, default=dict, nullable=False)
    public_name = Column(UnicodeText, default='', nullable=False)
    role = Column(Enum(EnumUserRole), default='receiver', nullable=False)
    enabled = Column(Boolean, default=True, nullable=False)
    last_login = Column(DateTime, default=datetime_null, nullable=False)
    mail_address = Column(UnicodeText, default='', nullable=False)
    language = Column(UnicodeText(12), nullable=False)
    password_change_needed = Column(Boolean, default=True, nullable=False)
    password_change_date = Column(DateTime, default=datetime_null, nullable=False)
    crypto_prv_key = Column(UnicodeText(84), default='', nullable=False)
    crypto_pub_key = Column(UnicodeText(56), default='', nullable=False)
    crypto_rec_key = Column(UnicodeText(80), default='', nullable=False)
    crypto_bkp_key = Column(UnicodeText(84), default='', nullable=False)
    crypto_escrow_prv_key = Column(UnicodeText(84), default='', nullable=False)
    crypto_escrow_bkp1_key = Column(UnicodeText(84), default='', nullable=False)
    crypto_escrow_bkp2_key = Column(UnicodeText(84), default='', nullable=False)
    change_email_address = Column(UnicodeText, default='', nullable=False)
    change_email_token = Column(UnicodeText, unique=True, nullable=True)
    change_email_date = Column(DateTime, default=datetime_null, nullable=False)
    notification = Column(Boolean, default=True, nullable=False)
    forcefully_selected = Column(Boolean, default=False, nullable=False)
    can_delete_submission = Column(Boolean, default=False, nullable=False)
    can_postpone_expiration = Column(Boolean, default=True, nullable=False)
    can_grant_access_to_reports = Column(Boolean, default=False, nullable=False)
    can_edit_general_settings = Column(Boolean, default=False, nullable=False)
    readonly = Column(Boolean, default=False, nullable=False)
    two_factor_secret = Column(UnicodeText(32), default='', nullable=False)
    reminder_date = Column(DateTime, default=datetime_null, nullable=False)
    pgp_key_fingerprint = Column(UnicodeText, default='', nullable=False)
    pgp_key_public = Column(UnicodeText, default='', nullable=False)
    pgp_key_expiration = Column(DateTime, default=datetime_null, nullable=False)
    clicked_recovery_key = Column(Boolean, default=False, nullable=False)


class MigrationScript(MigrationBase):
    def migrate_InternalTip(self):
        for old_obj in self.session_old.query(self.model_from['InternalTip']):
            new_obj = self.model_to['InternalTip']()
            for key in new_obj.__mapper__.column_attrs.keys():
                if key == 'crypto_tip_prv_key1':
                    setattr(new_obj, key, getattr(old_obj, 'crypto_tip_prv_key'))
                elif key == 'crypto_tip_pub_key1':
                    setattr(new_obj, key, getattr(old_obj, 'crypto_files_pub_key'))
                elif key == 'crypto_tip_pub_key2':
                    setattr(new_obj, key, getattr(old_obj, 'crypto_files_pub_key'))
                else:
                    setattr(new_obj, key, getattr(old_obj, key))

            self.session_new.add(new_obj)

    def migrate_ReceiverTip(self):
        for old_obj in self.session_old.query(self.model_from['ReceiverTip']):
            new_obj = self.model_to['ReceiverTip']()
            for key in new_obj.__mapper__.column_attrs.keys():
                if key == 'crypto_tip_prv_key1':
                    setattr(new_obj, key, getattr(old_obj, 'crypto_tip_prv_key'))
                elif key == 'crypto_tip_prv_key2':
                    setattr(new_obj, key, getattr(old_obj, 'crypto_files_prv_key'))
                else:
                    setattr(new_obj, key, getattr(old_obj, key))

            self.session_new.add(new_obj)


    def migrate_User(self):
        for old_obj in self.session_old.query(self.model_from['User']):
            new_obj = self.model_to['User']()
            for key in new_obj.__mapper__.column_attrs.keys():
                if key == 'hash':
                    setattr(new_obj, key, getattr(old_obj, 'password'))
                else:
                    setattr(new_obj, key, getattr(old_obj, key))

            self.session_new.add(new_obj)

    def epilogue(self):
        m = self.model_from['Message']
        i = self.model_from['InternalTip']
        r = self.model_from['ReceiverTip']
        for m, i, r in self.session_old.query(m, r, i) \
                                       .filter(m.receivertip_id == r.id, \
                                               r.internaltip_id == i.id):
            new_obj = self.model_to['Comment']()
            for key in new_obj.__mapper__.column_attrs.keys():
                if key == 'internaltip_id':
                    setattr(new_obj, key, i.id)
                elif key == 'author_id':
                    if m.type == 'receiver':
                        setattr(new_obj, key, r.id)
                else:
                    setattr(new_obj, key, getattr(m, key))

            self.session_new.add(new_obj)
            self.entries_count['Comment'] += 1


        for old_obj in self.session_old.query(self.model_from['Tenant']):
            try:
                srcpath = os.path.abspath(os.path.join(Settings.working_path, 'scripts', str(old_obj.id)))
                if not os.path.exists(srcpath):
                    continue

                new_obj = self.model_to['File']()
                new_obj.tid = old_obj.id
                new_obj.id = uuid4()
                new_obj.name = 'script'
                dstpath = os.path.abspath(os.path.join(Settings.files_path, new_obj.id))
                shutil.move(srcpath, dstpath)
                self.session_new.add(new_obj)
                self.entries_count['File'] += 1
            except:
                pass

        try:
            shutil.rmtree(os.path.abspath(os.path.join(Settings.working_path, 'scripts')))
        except:
            pass
