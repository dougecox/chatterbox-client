// YOUR CODE HERE:

var app = {

	// message : {
	//   username: 'shawndrost',
	//   text: 'trololo',
	//   roomname: '4chan'
	//   },

  init: function (data) {

    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
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
    addChat.text(message.text);
    $('#chats').append(addChat);
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

  handleUsernameClick: {
    restore: function () {
      $(this).append('');
    }
  }
};

