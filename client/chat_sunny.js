/* ------------- record signatures ------------- */

var AuthUser = Red.Constr.record("AuthUser", Red.Model.Record);
var User = Red.Constr.record("User", AuthUser);
var Msg = Red.Constr.record("Msg", Red.Model.Record);
var ChatRoom = Red.Constr.record("ChatRoom", Red.Model.Record);
var WebClient = Red.Constr.record("WebClient", Red.Model.Record);
var WebServer = Red.Constr.record("WebServer", Red.Model.Record);
var AuthClient = Red.Constr.record("AuthClient", WebClient);
var AuthServer = Red.Constr.record("AuthServer", WebServer);
var Client = Red.Constr.record("Client", AuthClient);
var Server = Red.Constr.record("Server", AuthServer);

/* ------------- event signatures ------------- */

var ClientConnected = Red.Constr.event("ClientConnected", Red.Model.Event);
var ClientDisconnected = Red.Constr.event("ClientDisconnected", Red.Model.Event);
var Register = Red.Constr.event("Register", Red.Model.Event);
var SignIn = Red.Constr.event("SignIn", Red.Model.Event);
var SignOut = Red.Constr.event("SignOut", Red.Model.Event);
var Unregister = Red.Constr.event("Unregister", Red.Model.Event);
var CreateRecord = Red.Constr.event("CreateRecord", Red.Model.Event);
var CreateRecordAndLink = Red.Constr.event("CreateRecordAndLink", CreateRecord);
var LinkToRecord = Red.Constr.event("LinkToRecord", Red.Model.Event);
var UpdateRecord = Red.Constr.event("UpdateRecord", Red.Model.Event);
var DeleteRecord = Red.Constr.event("DeleteRecord", Red.Model.Event);
var DeleteRecords = Red.Constr.event("DeleteRecords", Red.Model.Event);
var CreateRoom = Red.Constr.event("CreateRoom", Red.Model.Event);
var JoinRoom = Red.Constr.event("JoinRoom", Red.Model.Event);
var SendMsg = Red.Constr.event("SendMsg", Red.Model.Event);

/* ------------- record meta ------------- */

AuthUser.meta = new Red.Model.RecordMeta({
    "__repr__": new Meteor.Collection('AuthUser'),
    "name": "RedLib::Web::Auth::AuthUser",
    "relative_name": "AuthUser",
    "sigCls": AuthUser,
    "placeholder": false,
    "extra": {},
    "subsigs": [User],
    "parentSig": null,
    "fields": [
      new Red.Model.Field({
        "name": "name",
        "type": "String",
        "parent": AuthUser,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": false,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": true
      }),
      new Red.Model.Field({
        "name": "email",
        "type": "String",
        "parent": AuthUser,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": false,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": true
      }),
      new Red.Model.Field({
        "name": "password_salt",
        "type": "String",
        "parent": AuthUser,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": false,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": true
      }),
      new Red.Model.Field({
        "name": "password_hash",
        "type": "String",
        "parent": AuthUser,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": false,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": true
      }),
      new Red.Model.Field({
        "name": "remember_token",
        "type": "String",
        "parent": AuthUser,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": false,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": true
      }),
      new Red.Model.Field({
        "name": "password",
        "type": "String",
        "parent": AuthUser,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": true
      })
    ],
    "inv_fields": [new Red.Model.Field({
      "name": "auth_clients_as_user",
      "type": AuthClient,
      "parent": AuthUser,
      "default": null,
      "synth": true,
      "belongsToParent": false,
      "transient": false,
      "ordering": false,
      "inv": function(){ return AuthClient.meta.fields[0];},
      "multiplicity": "lone",
      "scalar": true,
      "primitive": false
    })]
  });

User.meta = new Red.Model.RecordMeta({
    "__repr__": new Meteor.Collection('User'),
    "name": "User",
    "relative_name": "User",
    "sigCls": User,
    "placeholder": false,
    "extra": {},
    "subsigs": [],
    "parentSig": null,
    "fields": [new Red.Model.Field({
      "name": "status",
      "type": "String",
      "parent": User,
      "default": null,
      "synth": false,
      "belongsToParent": false,
      "transient": false,
      "ordering": false,
      "inv": null,
      "multiplicity": "lone",
      "scalar": true,
      "primitive": true
    })],
    "inv_fields": [
      new Red.Model.Field({
        "name": "msgs_as_sender",
        "type": Msg,
        "parent": User,
        "default": null,
        "synth": true,
        "belongsToParent": false,
        "transient": false,
        "ordering": false,
        "inv": function(){ return Msg.meta.fields[1];},
        "multiplicity": "lone",
        "scalar": true,
        "primitive": false
      }),
      new Red.Model.Field({
        "name": "chat_rooms_as_member",
        "type": ChatRoom,
        "parent": User,
        "default": null,
        "synth": true,
        "belongsToParent": false,
        "transient": false,
        "ordering": false,
        "inv": function(){ return ChatRoom.meta.fields[1];},
        "multiplicity": "lone",
        "scalar": true,
        "primitive": false
      }),
      new Red.Model.Field({
        "name": "clients_as_user",
        "type": Client,
        "parent": User,
        "default": null,
        "synth": true,
        "belongsToParent": false,
        "transient": false,
        "ordering": false,
        "inv": function(){ return Client.meta.fields[0];},
        "multiplicity": "lone",
        "scalar": true,
        "primitive": false
      })
    ]
  });

Msg.meta = new Red.Model.RecordMeta({
    "__repr__": new Meteor.Collection('Msg'),
    "name": "Msg",
    "relative_name": "Msg",
    "sigCls": Msg,
    "placeholder": false,
    "extra": {},
    "subsigs": [],
    "parentSig": null,
    "fields": [
      new Red.Model.Field({
        "name": "text",
        "type": "Text",
        "parent": Msg,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": false,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": true
      }),
      new Red.Model.Field({
        "name": "sender",
        "type": User,
        "parent": Msg,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": false,
        "ordering": false,
        "inv": function(){ return User.meta.inv_fields[0];},
        "multiplicity": "lone",
        "scalar": true,
        "primitive": false
      }),
      new Red.Model.Field({
        "name": "time",
        "type": "Date",
        "parent": Msg,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": false,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": true
      })
    ],
    "inv_fields": [new Red.Model.Field({
      "name": "chat_room_as_message",
      "type": ChatRoom,
      "parent": Msg,
      "default": null,
      "synth": true,
      "belongsToParent": false,
      "transient": false,
      "ordering": false,
      "inv": function(){ return ChatRoom.meta.fields[2];},
      "multiplicity": "lone",
      "scalar": true,
      "primitive": false
    })]
  });

ChatRoom.meta = new Red.Model.RecordMeta({
    "__repr__": new Meteor.Collection('ChatRoom'),
    "name": "ChatRoom",
    "relative_name": "ChatRoom",
    "sigCls": ChatRoom,
    "placeholder": false,
    "extra": {},
    "subsigs": [],
    "parentSig": null,
    "fields": [
      new Red.Model.Field({
        "name": "name",
        "type": "String",
        "parent": ChatRoom,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": false,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": true
      }),
      new Red.Model.Field({
        "name": "members",
        "type": User,
        "parent": ChatRoom,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": false,
        "ordering": false,
        "inv": function(){ return User.meta.inv_fields[1];},
        "multiplicity": "set",
        "scalar": false,
        "primitive": false
      }),
      new Red.Model.Field({
        "name": "messages",
        "type": Msg,
        "parent": ChatRoom,
        "default": null,
        "synth": false,
        "belongsToParent": true,
        "transient": false,
        "ordering": false,
        "inv": function(){ return Msg.meta.inv_fields[0];},
        "multiplicity": "set",
        "scalar": false,
        "primitive": false
      })
    ],
    "inv_fields": [new Red.Model.Field({
      "name": "server_as_room",
      "type": Server,
      "parent": ChatRoom,
      "default": null,
      "synth": true,
      "belongsToParent": false,
      "transient": false,
      "ordering": false,
      "inv": function(){ return Server.meta.fields[0];},
      "multiplicity": "lone",
      "scalar": true,
      "primitive": false
    })]
  });


/* ------------- event meta ------------- */

ClientConnected.meta = new Red.Model.EventMeta({
    "__repr__": new Meteor.Collection('ClientConnected'),
    "name": "RedLib::Web::ClientConnected",
    "relative_name": "ClientConnected",
    "sigCls": ClientConnected,
    "placeholder": false,
    "extra": {},
    "subsigs": [],
    "parentSig": null,
    "from": function(){ return ClientConnected.meta.fields[0];},
    "to": function(){ return ClientConnected.meta.fields[1];},
    "fields": [
      new Red.Model.Field({
        "name": "client",
        "type": WebClient,
        "parent": ClientConnected,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": false
      }),
      new Red.Model.Field({
        "name": "server",
        "type": WebServer,
        "parent": ClientConnected,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": false
      })
    ],
    "inv_fields": []
  });

ClientDisconnected.meta = new Red.Model.EventMeta({
    "__repr__": new Meteor.Collection('ClientDisconnected'),
    "name": "RedLib::Web::ClientDisconnected",
    "relative_name": "ClientDisconnected",
    "sigCls": ClientDisconnected,
    "placeholder": false,
    "extra": {},
    "subsigs": [],
    "parentSig": null,
    "from": function(){ return ClientDisconnected.meta.fields[0];},
    "to": function(){ return ClientDisconnected.meta.fields[1];},
    "fields": [
      new Red.Model.Field({
        "name": "client",
        "type": WebClient,
        "parent": ClientDisconnected,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": false
      }),
      new Red.Model.Field({
        "name": "server",
        "type": WebServer,
        "parent": ClientDisconnected,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": false
      })
    ],
    "inv_fields": []
  });

Register.meta = new Red.Model.EventMeta({
    "__repr__": new Meteor.Collection('Register'),
    "name": "RedLib::Web::Auth::Register",
    "relative_name": "Register",
    "sigCls": Register,
    "placeholder": false,
    "extra": {},
    "subsigs": [],
    "parentSig": null,
    "from": function(){ return Register.meta.fields[0];},
    "to": function(){ return Register.meta.fields[4];},
    "fields": [
      new Red.Model.Field({
        "name": "client",
        "type": AuthClient,
        "parent": Register,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": false
      }),
      new Red.Model.Field({
        "name": "name",
        "type": "String",
        "parent": Register,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": true
      }),
      new Red.Model.Field({
        "name": "email",
        "type": "String",
        "parent": Register,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": true
      }),
      new Red.Model.Field({
        "name": "password",
        "type": "String",
        "parent": Register,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": true
      }),
      new Red.Model.Field({
        "name": "to",
        "type": Red.Model.Record,
        "parent": Register,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": false
      })
    ],
    "inv_fields": []
  });

SignIn.meta = new Red.Model.EventMeta({
    "__repr__": new Meteor.Collection('SignIn'),
    "name": "RedLib::Web::Auth::SignIn",
    "relative_name": "SignIn",
    "sigCls": SignIn,
    "placeholder": false,
    "extra": {},
    "subsigs": [],
    "parentSig": null,
    "from": function(){ return SignIn.meta.fields[0];},
    "to": function(){ return SignIn.meta.fields[3];},
    "fields": [
      new Red.Model.Field({
        "name": "client",
        "type": AuthClient,
        "parent": SignIn,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": false
      }),
      new Red.Model.Field({
        "name": "email",
        "type": "String",
        "parent": SignIn,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": true
      }),
      new Red.Model.Field({
        "name": "password",
        "type": "String",
        "parent": SignIn,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": true
      }),
      new Red.Model.Field({
        "name": "to",
        "type": Red.Model.Record,
        "parent": SignIn,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": false
      })
    ],
    "inv_fields": []
  });

SignOut.meta = new Red.Model.EventMeta({
    "__repr__": new Meteor.Collection('SignOut'),
    "name": "RedLib::Web::Auth::SignOut",
    "relative_name": "SignOut",
    "sigCls": SignOut,
    "placeholder": false,
    "extra": {},
    "subsigs": [],
    "parentSig": null,
    "from": function(){ return SignOut.meta.fields[0];},
    "to": function(){ return SignOut.meta.fields[1];},
    "fields": [
      new Red.Model.Field({
        "name": "client",
        "type": AuthClient,
        "parent": SignOut,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": false
      }),
      new Red.Model.Field({
        "name": "server",
        "type": WebServer,
        "parent": SignOut,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": false
      })
    ],
    "inv_fields": []
  });

Unregister.meta = new Red.Model.EventMeta({
    "__repr__": new Meteor.Collection('Unregister'),
    "name": "RedLib::Web::Auth::Unregister",
    "relative_name": "Unregister",
    "sigCls": Unregister,
    "placeholder": false,
    "extra": {},
    "subsigs": [],
    "parentSig": null,
    "from": function(){ return Unregister.meta.fields[0];},
    "to": function(){ return Unregister.meta.fields[1];},
    "fields": [
      new Red.Model.Field({
        "name": "client",
        "type": AuthClient,
        "parent": Unregister,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": false
      }),
      new Red.Model.Field({
        "name": "to",
        "type": Red.Model.Record,
        "parent": Unregister,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": false
      })
    ],
    "inv_fields": []
  });

CreateRecord.meta = new Red.Model.EventMeta({
    "__repr__": new Meteor.Collection('CreateRecord'),
    "name": "RedLib::Crud::CreateRecord",
    "relative_name": "CreateRecord",
    "sigCls": CreateRecord,
    "placeholder": false,
    "extra": {},
    "subsigs": [CreateRecordAndLink],
    "parentSig": null,
    "from": function(){ return CreateRecord.meta.fields[2];},
    "to": function(){ return CreateRecord.meta.fields[3];},
    "fields": [
      new Red.Model.Field({
        "name": "className",
        "type": "String",
        "parent": CreateRecord,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": true
      }),
      new Red.Model.Field({
        "name": "saveRecord",
        "type": "Boolean",
        "parent": CreateRecord,
        "default": true,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": true
      }),
      new Red.Model.Field({
        "name": "from",
        "type": Red.Model.Record,
        "parent": CreateRecord,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": false
      }),
      new Red.Model.Field({
        "name": "to",
        "type": Red.Model.Record,
        "parent": CreateRecord,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": false
      })
    ],
    "inv_fields": []
  });

CreateRecordAndLink.meta = new Red.Model.EventMeta({
    "__repr__": new Meteor.Collection('CreateRecordAndLink'),
    "name": "RedLib::Crud::CreateRecordAndLink",
    "relative_name": "CreateRecordAndLink",
    "sigCls": CreateRecordAndLink,
    "placeholder": false,
    "extra": {},
    "subsigs": [],
    "parentSig": null,
    "from": function(){ return CreateRecord.meta.fields[2];},
    "to": function(){ return CreateRecord.meta.fields[3];},
    "fields": [
      new Red.Model.Field({
        "name": "target",
        "type": Red.Model.Record,
        "parent": CreateRecordAndLink,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": false
      }),
      new Red.Model.Field({
        "name": "fieldName",
        "type": "String",
        "parent": CreateRecordAndLink,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": true
      }),
      new Red.Model.Field({
        "name": "from",
        "type": Red.Model.Record,
        "parent": CreateRecordAndLink,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": false
      }),
      new Red.Model.Field({
        "name": "to",
        "type": Red.Model.Record,
        "parent": CreateRecordAndLink,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": false
      })
    ],
    "inv_fields": []
  });

LinkToRecord.meta = new Red.Model.EventMeta({
    "__repr__": new Meteor.Collection('LinkToRecord'),
    "name": "RedLib::Crud::LinkToRecord",
    "relative_name": "LinkToRecord",
    "sigCls": LinkToRecord,
    "placeholder": false,
    "extra": {},
    "subsigs": [],
    "parentSig": null,
    "from": function(){ return LinkToRecord.meta.fields[4];},
    "to": function(){ return LinkToRecord.meta.fields[5];},
    "fields": [
      new Red.Model.Field({
        "name": "target",
        "type": Red.Model.Record,
        "parent": LinkToRecord,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": false
      }),
      new Red.Model.Field({
        "name": "fieldName",
        "type": "String",
        "parent": LinkToRecord,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": true
      }),
      new Red.Model.Field({
        "name": "fieldValue",
        "type": "\"********** DEPENDENT ********\"",
        "parent": LinkToRecord,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "set",
        "scalar": false,
        "primitive": false
      }),
      new Red.Model.Field({
        "name": "saveTarget",
        "type": "Boolean",
        "parent": LinkToRecord,
        "default": true,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": true
      }),
      new Red.Model.Field({
        "name": "from",
        "type": Red.Model.Record,
        "parent": LinkToRecord,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": false
      }),
      new Red.Model.Field({
        "name": "to",
        "type": Red.Model.Record,
        "parent": LinkToRecord,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": false
      })
    ],
    "inv_fields": []
  });

UpdateRecord.meta = new Red.Model.EventMeta({
    "__repr__": new Meteor.Collection('UpdateRecord'),
    "name": "RedLib::Crud::UpdateRecord",
    "relative_name": "UpdateRecord",
    "sigCls": UpdateRecord,
    "placeholder": false,
    "extra": {},
    "subsigs": [],
    "parentSig": null,
    "from": function(){ return UpdateRecord.meta.fields[3];},
    "to": function(){ return UpdateRecord.meta.fields[4];},
    "fields": [
      new Red.Model.Field({
        "name": "target",
        "type": Red.Model.Record,
        "parent": UpdateRecord,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": false
      }),
      new Red.Model.Field({
        "name": "params",
        "type": "Hash",
        "parent": UpdateRecord,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": false
      }),
      new Red.Model.Field({
        "name": "saveTarget",
        "type": "Boolean",
        "parent": UpdateRecord,
        "default": true,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": true
      }),
      new Red.Model.Field({
        "name": "from",
        "type": Red.Model.Record,
        "parent": UpdateRecord,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": false
      }),
      new Red.Model.Field({
        "name": "to",
        "type": Red.Model.Record,
        "parent": UpdateRecord,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": false
      })
    ],
    "inv_fields": []
  });

DeleteRecord.meta = new Red.Model.EventMeta({
    "__repr__": new Meteor.Collection('DeleteRecord'),
    "name": "RedLib::Crud::DeleteRecord",
    "relative_name": "DeleteRecord",
    "sigCls": DeleteRecord,
    "placeholder": false,
    "extra": {},
    "subsigs": [],
    "parentSig": null,
    "from": function(){ return DeleteRecord.meta.fields[1];},
    "to": function(){ return DeleteRecord.meta.fields[2];},
    "fields": [
      new Red.Model.Field({
        "name": "target",
        "type": Red.Model.Record,
        "parent": DeleteRecord,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": false
      }),
      new Red.Model.Field({
        "name": "from",
        "type": Red.Model.Record,
        "parent": DeleteRecord,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": false
      }),
      new Red.Model.Field({
        "name": "to",
        "type": Red.Model.Record,
        "parent": DeleteRecord,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": false
      })
    ],
    "inv_fields": []
  });

DeleteRecords.meta = new Red.Model.EventMeta({
    "__repr__": new Meteor.Collection('DeleteRecords'),
    "name": "RedLib::Crud::DeleteRecords",
    "relative_name": "DeleteRecords",
    "sigCls": DeleteRecords,
    "placeholder": false,
    "extra": {},
    "subsigs": [],
    "parentSig": null,
    "from": function(){ return DeleteRecords.meta.fields[1];},
    "to": function(){ return DeleteRecords.meta.fields[2];},
    "fields": [
      new Red.Model.Field({
        "name": "targets",
        "type": Red.Model.Record,
        "parent": DeleteRecords,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "set",
        "scalar": false,
        "primitive": false
      }),
      new Red.Model.Field({
        "name": "from",
        "type": Red.Model.Record,
        "parent": DeleteRecords,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": false
      }),
      new Red.Model.Field({
        "name": "to",
        "type": Red.Model.Record,
        "parent": DeleteRecords,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": false
      })
    ],
    "inv_fields": []
  });

CreateRoom.meta = new Red.Model.EventMeta({
    "__repr__": new Meteor.Collection('CreateRoom'),
    "name": "CreateRoom",
    "relative_name": "CreateRoom",
    "sigCls": CreateRoom,
    "placeholder": false,
    "extra": {},
    "subsigs": [],
    "parentSig": null,
    "from": function(){ return CreateRoom.meta.fields[0];},
    "to": function(){ return CreateRoom.meta.fields[1];},
    "fields": [
      new Red.Model.Field({
        "name": "client",
        "type": Client,
        "parent": CreateRoom,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": false
      }),
      new Red.Model.Field({
        "name": "serv",
        "type": Server,
        "parent": CreateRoom,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": false
      }),
      new Red.Model.Field({
        "name": "roomName",
        "type": "String",
        "parent": CreateRoom,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": true
      })
    ],
    "inv_fields": []
  });

JoinRoom.meta = new Red.Model.EventMeta({
    "__repr__": new Meteor.Collection('JoinRoom'),
    "name": "JoinRoom",
    "relative_name": "JoinRoom",
    "sigCls": JoinRoom,
    "placeholder": false,
    "extra": {},
    "subsigs": [],
    "parentSig": null,
    "from": function(){ return JoinRoom.meta.fields[0];},
    "to": function(){ return JoinRoom.meta.fields[1];},
    "fields": [
      new Red.Model.Field({
        "name": "client",
        "type": Client,
        "parent": JoinRoom,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": false
      }),
      new Red.Model.Field({
        "name": "serv",
        "type": Server,
        "parent": JoinRoom,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": false
      }),
      new Red.Model.Field({
        "name": "room",
        "type": ChatRoom,
        "parent": JoinRoom,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": false
      })
    ],
    "inv_fields": []
  });

SendMsg.meta = new Red.Model.EventMeta({
    "__repr__": new Meteor.Collection('SendMsg'),
    "name": "SendMsg",
    "relative_name": "SendMsg",
    "sigCls": SendMsg,
    "placeholder": false,
    "extra": {},
    "subsigs": [],
    "parentSig": null,
    "from": function(){ return SendMsg.meta.fields[0];},
    "to": function(){ return SendMsg.meta.fields[1];},
    "fields": [
      new Red.Model.Field({
        "name": "client",
        "type": Client,
        "parent": SendMsg,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": false
      }),
      new Red.Model.Field({
        "name": "serv",
        "type": Server,
        "parent": SendMsg,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": false
      }),
      new Red.Model.Field({
        "name": "room",
        "type": ChatRoom,
        "parent": SendMsg,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": false
      }),
      new Red.Model.Field({
        "name": "msgText",
        "type": "String",
        "parent": SendMsg,
        "default": null,
        "synth": false,
        "belongsToParent": false,
        "transient": true,
        "ordering": false,
        "inv": null,
        "multiplicity": "lone",
        "scalar": true,
        "primitive": true
      })
    ],
    "inv_fields": []
  });


/* ------------- event handlers ------------- */

SendMsg.meta.ensures = function() {
  var sender = Meteor.user() ? Meteor.user().emails[0].address : "Anonymous";
  var msg = Msg.create({sender: sender, text: this.msgText, time: Date.now()});
  if (this.room !== undefined) {
    this.room.messages.push(msg);
  }
  // TODO: add msg to room
  return msg;
};

Red.initApp();
