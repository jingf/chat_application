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
				/*What we want the end result to be */
				var newRoom = new Chatroom(room_name.value);
				console.log("created newRoom");
				// put this in the chatroom object
				Chatrooms.insert(newRoom);
				console.log("inserted into Chatrooms");
				
				//console.log(Chatrooms.find(chatroomB));
				//console.log(Chatrooms.find(chatroomB).messages);
				
				/* What it was before
				Chatrooms.insert({
					name: room_name.value
				});
				*/

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
				/*What we want the end result to be*/
				// Create new Msg object, insert into Messages collection
				var msg = new Msg(name, message.value);
				// put into Msg object
				Messages.insert(msg);

				// Find and update the room that the message belongs to
				// change to theRoom.messages.push() 
				var theRoom = Chatrooms.findOne( { name: "chatroomH"} );
				Chatrooms.update( 
					{ _id: theRoom._id }, 
					{ $push: { messages: msg } } 
				)
				
				console.log("the room is ", theRoom);
				console.log("the room id is ", theRoom._id);
				
				/* What the code was before*/ 
				// Messages.insert({
				// 	name: name,
				// 	message: message.value,
				// 	time: Date.now(),
				// 	room: null
				// });
				

				document.getElementById('message').value = '';
				message.value = '';
			}
		}
	}
}

var Msg = function(name, message) {
	this.name = name;
	this.message = message;
	this.time = Date.now();
}

var Chatroom = function(name) {
	this.name = name;
	this.messages = []; // empty array
}

// var chatroomE = new Chatroom("chatroomE");
// console.log("created chatroomE");