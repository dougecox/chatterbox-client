// YOUR CODE HERE:

var app = {

	friends: [],

	// message : {
	//   username: 'shawndrost',
	//   text: 'trololo',
	//   roomname: '4chan'
	//   },

  init: function (message) {

    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
      type: 'POST',
      contentType: 'application/json',
      
      success: function (data) {
        console.log('initialized');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('not initialized', data);
      }
    });
  },

  send: function (message) {
    $.ajax({
      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }, //END OF SEND

  fetch: function () {
    $.ajax({
      url: undefined,
      type: 'GET',
    });
  },

  clearMessages: function() {
    $('#chats').empty();
  },

  renderMessage: function (message) {
    var addChat = $('<div></div>');
    var addUsername = $('<div class="username" data-username=' + message.username.split(' ').join("") + '></div>');
    var context = this;
    addUsername.on('click', function() {
      	context.handleUsernameClick(message.username)
      	console.log(this);
      });
    addChat.text(message.text);
    
    //if ( !$('#main').find('#username') ) {
    	addUsername.text(message.username);
    	addUsername.attr('id', message.username.split(' ').join(""));
    	$('#main').append(addUsername);
    //}
    $('#chats').append(message.username).append(addChat);
    //if (!$(#main).message.user)
      //append user to main
  },

  renderRoom: function(message) {
    if ( !$('#roomSelect') ) {
      var roomSelect = $('<div></div>');
      roomSelect.attr('id', 'roomSelector');
      $('#chats').append(roomSelect);
    }
    var addRoom = $('<div></div>');
    addRoom.text(message.roomname);
    $('#roomSelect').append(addRoom);
  },

  handleUsernameClick:  function (username) {
  	app.friends.push(username);
      // $('#main').on('click', function() {
      // 	app.friends.push(message.username)
      // 	console.log('hi');
      // });
      // called: false
  }
};

