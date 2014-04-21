/** Templates **/

//syntax: Template.<template-name>.<template-variable>
// Return all messages from db and sort based on time
Template.messages.messages = function() {
  return Messages.find({}, {sort: {time: -1 }});
};

Template.messages.Msg = function() {
  return Sunny.Msg.all({sort: {time: -1 }});
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
      var $room = $('#room_name');
      if ($room.val() != '') {
        var newRoom = Sunny.ChatRoom.create({name: $room.val()});
        $room.val('');
      }
    }
  }
};

// Callback for all events triggered within the "input" template
// Allows us to write messages directly in the app
Template.input.events = {
  'keydown input#message': function(event) {
    if (event.which == 13) { // 13 is enter key
      var $msg = $("#message");
      if ($msg.val() != '') {
        var theRoom = Sunny.ChatRoom.findOne({name: "my room"});
        Sunny.SendMsg.trigger({room: theRoom, msgText: $msg.val()});
        $msg.val('');
      }
    }
  }
};
