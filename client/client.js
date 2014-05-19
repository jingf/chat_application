/* ---------------- Templates --------------- */

//syntax: Template.<template-name>.<template-variable>
// Return all messages from db and sort based on time
Template.messages.messages = function() {
  return Messages.find({}, {sort: {time: -1 }});
};

Template.messages.Msg = function() {
  return Sunny.Msg.all({sort: {time: -1 }});
};

Template.messages.ChatRoom = function() {
  return Sunny.ChatRoom.all({sort: {time: -1 }});
};

Template.messages.RoomMessages = function() {
  return this.messages;
};

Template.onlineUsers.onlineUsersArray = function() {
  var onlineUsersArray = onlineUsers.find().fetch();
  return onlineUsersArray;
}; 

Template.loggedInTemplate.userID = function() {
  return Session.get("userID");
}


Template.messages.helpers({
  fmtTime: function(time) {
    var d = new Date(time);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString();
  }
});

Template.room.events = {
  'keydown input#room_name': function(event) {
    if (event.which == 13) {
      var $room = $(event.target);
      var roomName = $room.val();
      if (roomName != '') {
        var newRoom = Sunny.ChatRoom.create({name: roomName});
        $room.val('');
      }
    }
  }
};

// Callback for all events triggered within the "input" template
// Allows us to write messages directly in the app
Template.input.events = {
  'keydown input.message': function(event) {
    if (event.which == 13) { // 13 is enter key
      var $msg = $(event.target);
      var msgText = $msg.val();
      if (msgText != '') {
        var theRoom = this;
        Sunny.SendMsg.trigger({room: theRoom, msgText: msgText});
        $msg.val('');
      }
    }
  }
};

Template.login.events({
    'submit #login-form' : function(e, t){
        e.preventDefault();
        // retrieve the input field values
        // TODO: switch to JQuery
        var email = t.find('#login-email').value;
        var password = t.find('#login-password').value;
        // Trim and validate fields.... 
        email = trimInput(email);
        // Find the user in the Sunny.User database
        var userFound = Sunny.User.find( {email: email, password: password} );

        if (userFound) {
          // TODO: try inserting "user"
          onlineUsers.insert({_id: userFound[0].id, email: email});
          // Set the session variable userID so that sys realizes 
          // user is logged in 
          Session.set("userID", userFound[0].id);
        }
        
        // Prevent form submission from reloading the page 
        return false; 
      }
  });

Template.logout.events({
  'submit #logout-form' : function(e, t) {
    onlineUsers.remove(Session.get("userID"));
    Session.set("userID", null);
  }
});

Template.register.events({
    'submit #register-form' : function(e, t) {
        e.preventDefault();
        // retrieve the input field values
        // TODO: switch to JQuery
        var username = t.find('#account-username').value;
        var email = t.find('#account-email').value;
        var password = t.find('#account-password').value;

        // Trim and validate the input
        username = trimInput(username);
        email = trimInput(email);
        console.log(username, email, status);

        // If validation passes, create a user (Sunny object)
        if ( isValidPassword( password )) {
          var user = Sunny.User.create({
                name: username, 
                email: email,
                password: password
            });
          // Set session variable userID so sys realizes 
          // user is logged in
          Session.set("userID", user.id);

          //Add this user's information to onlineUsers collection
          // TODO: try add "user" instead of name and email
          onlineUsers.insert({_id: Session.get("userID"), name: username, email: email, status: "free"}); 
        }

      return false;
    }
  });


// helper - trims whitespace
var trimInput = function(val) {
    return val.replace(/^\s*|\s*$/g, "");
}

// helper - validates password
// return true if password is at least 6 characters long
// otherwise, return false
var isValidPassword = function(val, field) {
    if (val.length >= 6) {
      return true;
    } else {
      // Session.set('displayMessage', 'Error &amp; Too short.')
      console.log("password too short");
      return false; 
    }
  }

