/** Models **/
// let's not use these
// Messages = new Meteor.Collection('messages');
// Chatrooms = new Meteor.Collection('chatrooms');

if (Meteor.isServer) {
  // chat_sunny is going to create these on the client
  Msg = new Meteor.Collection('Msg');
  ChatRoom = new Meteor.Collection('ChatRoom');
}