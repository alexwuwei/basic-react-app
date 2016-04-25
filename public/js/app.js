// var React = require('react');
// var ReactDOM = require('react-dom');


var Message = React.createClass({
  rawMarkup: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return { __html: rawMarkup };
  },
  handleUpdate: function(e) {
    //TODO: stuff goes here
  },
  handleDelete: function(e) {
    //TODO: stuff goes here
  },
  render: function() {
    return (
      <section className="message">
      <h2 className="messageAuthor">
      {this.props.author}
      </h2>
      <span dangerouslySetInnerHTML={this.rawMarkup()} />
      <div>
      <button>Update</button>
      <button>Delete</button>
      </div>
      </section>
    )
  }
})

var MessageContainer = React.createClass({
  loadMessagesFromServer: function() {
    $.ajax({
      url: 'http://localhost:3000/api/messages',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
        console.log(data);
        // console.log('data received is: ', data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleMessageSubmit: function(message) {
    var messages = this.state.data;
    message.id = Date.now();
    var newMessages = messages.concat([message]);
    this.setState({data: newMessages});
    $.ajax({
      url: 'http://localhost:3000/api/messages',
      dataType: 'json',
      type: 'POST',
      data: message,
      success: function(data) {
        this.state.data.push(data)
        // this.setState(data);
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({data: messages});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  // handleMessageChange: function(message) {
  //   //TODO: stuff goes here
  //   $.ajax({
  //     url: 'http://localhost:3000/api/messages/' + message._id,
  //     dataType: 'json',
  //     type: 'PUT',
  //     data: message,
  //     success: function(data) {
  //       this.state.data = this.state.data.map(function(dat) {
  //         return (dat._id === data._id) ? data : d;
  //       })
  //       this.setState({this.state.data});
  //     }.bind(this),
  //     error: function(xhr, status, err) {
  //       this.setState({data: messages});
  //       console.error(this.props.url, status, err.toString());
  //     }.bind(this)
  //   });
  // },
  // handleMessageDelete: function(message) {
  //   //TODO: stuff goes here
  //   $.ajax({
  //     url: 'http://localhost:3000/api/messages/' + message._id,
  //     dataType: 'json',
  //     type: 'DELETE',
  //     data: message,
  //     success: function(dat) {
  //       this.setState({data: this.state.data.filter(function(data) {
  //         return data.id !== message._id
  //       })});
  //     }.bind(this),
  //     error: function(xhr, status, err) {
  //       this.setState({data: messages});
  //       console.error(this.props.url, status, err.toString());
  //     }.bind(this)
  //   });
  // },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadMessagesFromServer();
    setInterval(this.loadMessagesFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <section className="messageContainer">
      <h1>Movie Chat</h1>
      <MessageList data={this.state.data} />
      </section>
    );
  }
});

var MessageList = React.createClass({

//this gets rid of the flattenChildren error!!!
  // render: function() {
  //   var messageNodes = this.props.data.forEach(function(message) {
  //   return (
  //     <Message author={message.author} key={message.id}>
  //     {message.text}
  //     </Message>
  //   );
  // })

  render: function() {
    var messageNodes = this.props.data.map(function(message) {
      return (
        //onUpdate={this.props.handleMessageChange} onDelete={this.props.handleMessageDelete} insert this into message below when ready
        <Message author={message.author} >
        {message.text}
        </Message>
      );
    })
    return (
      <section className="messageList">
      {messageNodes}
      </section>
    );
  }
  // getDefaultProps: function() {
  //   return { messages: [] }
  // }
  // render: function() {
  //   var messageNodes = this.props.data.map(function(message) {
  //     return (
  //       <Message author={message.author} key={message.id}>
  //       {message.text}
  //       </Message>
  //     );
  //   })
  //   return (
  //     <section className="messageList">
  //     {messageNodes}
  //     </section>
  //   );
  // }
});

var MessageForm = React.createClass({
  getInitialState: function() {
    return {author: '', text: ''};
  },
  handleAuthorChange: function(e) {
    this.setState({author: e.target.value})
  },
  handleTextChange: function(e) {
    this.setState({text: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var author = this.state.author.trim();
    var text = this.state.text.trim();
    if (!text || !author) {
      return;
    }
    this.props.onMessageSubmit({author: author, text: text});
    this.setState({author: '', text:''});
  },
  render: function() {
    return (
    <form className="messageForm" onSubmit={this.handleSubmit}>
    <input
      type="text"
      className="input-field"
      placeholder="Your name"
      value={this.state.author}
      onChange={this.handleAuthorChange}
      />
    <input
      type="text"
      className="input-field"
      placeholder="Say something!"
      value={this.state.text}
      onChange={this.handleTextChange}
      />
    <input type="submit" value="Post" />
    </form>
  );
  }
});

// var updateMessageForm = React.createClass({
//   getInitialState: function() {
//     return {author: this.props.data.author, text: this.props.data.text};
//   },
//   handleAuthorChange: function(e) {
//     this.setState({author: e.target.value})
//   },
//   handleTextChange: function(e) {
//     this.setState({text: e.target.value});
//   },
//   handleSubmit: function(e) {
//     e.preventDefault();
//     var author = this.state.author.trim();
//     var text = this.state.text.trim();
//     if (!author || !text) return;
//     this.props.submitUpdate({_id: this.props.data._id, author: author, text: text,});
//     this.setState({author: '', text: ''});
//   },
//   render: function() {
//     return (
//       <form className={this.props.shouldHide ? 'hidden' : ''} onSubmit={this.handleSubmit}>
//         <input type="text" placeholder={this.state.author} value={this.state.author} onChange={this.handleAuthorChange}/> <br/>
//         <input type="text" placeholder={this.state.text}value={this.state.text} onChange={this.handleTextChange}/> <br/>
//         <button type="cancel" onClick={this.props.hideForm}>cancel</button>
//         <input type="submit" value="post" />
//       </form>
//   )}
// });


ReactDOM.render(
  <MessageContainer url="http://localhost:3000/api/messages" pollInterval={10000} />,
  document.getElementById('content')
);
