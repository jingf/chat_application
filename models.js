/** Models **/
// let's not use these
// Messages = new Meteor.Collection('messages');
// Chatrooms = new Meteor.Collection('chatrooms');

onlineUsers = new Meteor.Collection("onlineUsers");


if (Meteor.isServer) {

  // chat_sunny is going to create these on the client
  Msg = new Meteor.Collection('Msg');
  ChatRoom = new Meteor.Collection('ChatRoom');
  User = new Meteor.Collection('User');
  AuthUser = new Meteor.Collection('AuthUser');
  
} else {

  /* ------------- Sunny events ------------- */
  //TODO: this should also exist on the server, but it's fine for now
  Sunny.SendMsg.meta.requires = function() {
    if (!Meteor.user())
      return "must log in first!";
    return null; 
  };
  Sunny.SendMsg.meta.ensures = function() {
    var msg = Sunny.Msg.create({
      sender: Meteor.user().emails[0].address,
      text: this.msgText,
      time: Date.now()
    });
    this.room.messages.push(msg);
    return msg;
  };



}