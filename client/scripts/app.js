// YOUR CODE HERE:

var app = {

	server: 'http://parse.sfm8.hackreactor.com/chatterbox/classes/messages',
  username: 'anonymous',
  roomname: 'lobby',
  lastMessageId: 0,
  friends: {},
  messages: [],

  init: function () {
     // Get username
    app.username = window.location.search.substr(10);

    // Cache jQuery selectors
    app.$message = $('#message');
    app.$chats = $('#chats');
    app.$roomSelect = $('#roomSelect');
    app.$send = $('#send');

    // Add listeners
    app.$chats.on('click', '.username', app.handleUsernameClick);
    app.$send.on('submit', app.handleSubmit);
    app.$roomSelect.on('change', app.handleRoomChange);

    // Fetch previous messages
    app.startSpinner();
    app.fetch(false);

    // Poll for new messages
    setInterval(function() {
      app.fetch(true);
    }, 3000);
  
  },

  send: function (message) {

    $.ajax({
      url: app.server,
      type: 'POST',
      data: message,
      //contentType: 'application/json',
      success: function (data) {
        app.$message.val('');
        app.fetch();
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }, //END OF SEND

  fetch: function (animate) {
    $.ajax({
      url: app.server,
      type: 'GET',
      data: { order: '-createdAt' },
      contentType: 'application/json',
      success: function(data) {
        // Don't bother if we have nothing to work with
        if (!data.results || !data.results.length) { return; }

        // Store messages for caching later
        app.messages = data.results;

        // Get the last message
        var mostRecentMessage = data.results[data.results.length - 1];

        // Only bother updating the DOM if we have a new message
        if (mostRecentMessage.objectId !== app.lastMessageId) {
          // Update the UI with the fetched rooms
          app.renderRoomList(data.results);

//Update the UI with the fetched messages
          app.renderMessages(data.results, animate);

          // Store the ID of the most recent message
          app.lastMessageId = mostRecentMessage.objectId;
        }
      },
      error: function(error) {
        console.error('chatterbox: Failed to fetch messages', error);
      }
    });
  },

  clearMessages: function () {
    $('#chats').html('');
  },

    renderMessages: function(messages, animate) {
    // Clear existing messages`
    app.clearMessages();
    app.stopSpinner();
    if (Array.isArray(messages)) {
      // Add all fetched messages that are in our current room
      messages
        .filter(function(message) {
          return message.roomname === app.roomname ||
                 app.roomname === 'lobby' && !message.roomname;
        })
        .forEach(app.renderMessage);
    }

    // Make it scroll to the top
    if (animate) {
      $('body').animate({scrollTop: '0px'}, 'fast');
    }
  },

  renderMessage: function (message) {
    if (!message.roomname) {
      message.roomname = 'lobby';
    }

    var addChat =  $('<span class="chat"/>');
    var addUsername = $('<div class="username" data-username=' + message.username.split(' ').join("") + '></div>');
    var context = this;
    addUsername.on('click', function() {
      	context.handleUsernameClick(message.username)
      	console.log(this);
      });
    addChat.on('click', function() {
      context.handleSubmit();
    });
    
    //if ( !$('#main').find('#username') ) {
    	addUsername.text(message.username).attr('data-username', message.username).attr('data-roomname', message.roomname).appendTo(addChat);
    	// $('#main').append(addUsername);

    if (app.friends[message.username] === true) {
      $username.addClass('friend');
    }

    var $message = $('<br><span/>');
    $message.text(message.text).appendTo(addChat)


      $('#chats').append(addChat);
    //}
    // $('#chats').append(message.username).append(addChat);
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

  handleUsernameClick:  function (event) {

    var username = $(event.target).data('username');

    if (username !== undefined) { 
      app.friends[username] = true;
    }
    
    var selector = '[data-username="' + username.replace(/"/g, '\\\"') + '"]';

    var $usernames = $(selector).toggleClass('friend');

      // $('#main').on('click', function() {
      // 	app.friends.push(message.username)
      // 	console.log('hi');
      // });
      // called: false
  },

  handleSubmit: function (event) {
    var message = {
      username: app.username,
      text: app.$message.val(),
      roomname: app.roomname || 'lobby'
    }
    app.send(message);

    event.preventDefault();
    // var button = $('.send')
    // var textInput = $('#chatbox').val();
    // var addMessage = $('<div id="message">' + textInput + '</div>');
    // $('#chats').append('Me:').append(addMessage);
  },
  
  renderRoomList: function(messages) {
    app.$roomSelect.html('<option value="__newRoom">New room...</option>');

    if (messages) {
      var rooms = {};
      messages.forEach(function(message) {
        var roomname = message.roomname;
        if (roomname && !rooms[roomname]) {
          // Add the room to the select menu
          app.renderRoom(roomname);

          // Store that we've added this room already
          rooms[roomname] = true;
        }
      });
    }

    // Select the menu option
    app.$roomSelect.val(app.roomname);
  },

  renderRoom: function(roomname) {
    // Prevent XSS by escaping with DOM methods
    var $option = $('<option/>').val(roomname).text(roomname);

    // Add to select
    app.$roomSelect.append($option);
  },

   startSpinner: function() {
    $('.spinner img').show();
    $('form input[type=submit]').attr('disabled', 'true');
  },

  stopSpinner: function() {
    $('.spinner img').fadeOut('fast');
    $('form input[type=submit]').attr('disabled', null);
  }
};

