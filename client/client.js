/** Templates **/

//syntax: Template.<template-name>.<template-variable>
// Return all messages from db and sort based on time
Template.messages.messages = function() {
	return Messages.find({}, {sort: {time: -1 }});
}

Template.room.events = {
	'keydown input#room_name': function(event) {
		if (event.which == 13) {
			// Need to take care of chat rooms with the same name
			var room_name = document.getElementById('room_name');

			if (room_name.value != '') {
				Chatrooms.insert({
					name: room_name.value
				});

				document.getElementById('room_name').value = '';
				room_name.value = '';
			}
		}
	}
}

// Callback for all events triggered within the "input" template
// Allows us to write messages directly in the app
Template.input.events = {
	// syntax: event selector
	'keydown input#message': function(event) {
		if (event.which == 13) { // 13 is enter key
			if (Meteor.user())
				var name = Meteor.user().emails[0].address;
			else
				var name = "Anonymous";
			
			var message = document.getElementById('message');

			if (message.value != '') {
				/* What we want the end result to be
				var msg = new Msg({name: name, message: message.value});
				room.messages += msg;
				*/
				// What it is currently
				Messages.insert({
					name: name,
					message: message.value,
					time: Date.now(),
					room: null
				});

				document.getElementById('message').value = '';
				message.value = '';
			}
		}
	}
}