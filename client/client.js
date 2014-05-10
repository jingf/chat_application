var loggedInUser = null;
var loggedIn = false;


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

Template.loggedIn.loggedIn = function() {
  console.log("template loggedIn ", loggedIn);
  return loggedIn;
};


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
        console.log("email", email);

        var userFound = Sunny.User.find( {email: email} );
        console.log("User found by login is ", userFound);

        if (Sunny.User.find({email: email, password: password})) {
          // TODO: try inserting "user"
          onlineUsers.insert({email: email});

          loggedInUser = Sunny.User.find({email: email, password: password});
          loggedIn = true;
          console.log("loggedIn set to ", loggedIn);
        }

        // // If validation passes, supply the appropriate fields to the
        // // Meteor.loginWithPassword() function.
        // Meteor.loginWithPassword(email, password, function(err){
        //   if (err)
        //     // The user might not have been found, or their passwword
        //     // could be incorrect. Inform the user that 
        //     // login attempt has failed.
        //     console.log("error ", err); 
        //   else
        //     // The user has been logged in.
        //     console.log("Logged in");
        //     // Put user in a collection of online users
        //     onlineUsers.insert({name: username, email: email});
        // });
        
        // Prevent form submission from reloading the page 
        return false; 
      }
  });

Template.logout.events({
  'submit #logout-form' : function(e, t) {
    console.log("Before removing email from onlineUsers");
    
    onlineUsers.remove({email: this.email});
    loggedInUser = null;
    loggedIn = false;
    
    console.log("After removing email from onlineUsers");
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
          var temp = {
                name: username, 
                email: email,
                password: password
            };
          var user = Sunny.User.create(temp);
          console.log("user id ", user.id);

          loggedIn = true;
          console.log("loggedIn ", loggedIn);

          // Equivalent of currentUser
          loggedInUser = user;
          console.log("loggedInUser ", loggedInUser);

          //Add this user's information to onlineUsers collection
          // TODO: try add "user" instead of name and email
          onlineUsers.insert({name: username, email: email}); 
          
          
          // Accounts.createUser({email: email, password : password}, function(err){
          //   if (err) {
          //     // Inform the user that account creation failed
          //     console.log("error ", err);
          //   } else {
          //     // Success. Account has been created and the user
          //     // has logged in successfully. 
          //     // Create User object (?)
          //     console.log("created user");
          //     //onlineUsers.push(email);
          //     onlineUsers.insert({name: username, email: email}); 
          //   }

          // });
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

