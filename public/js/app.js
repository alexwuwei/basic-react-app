var MessageContainer = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  loadMessagesFromServer: function() {
    $.ajax({
      url: 'http://localhost:3000/api/messages',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
        console.log(data);
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
        this.setState({data: this.state.data})
        // this.setState(data);
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({data: messages});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleMessageChange: function(message) {
    $.ajax({
      url: 'http://localhost:3000/api/messages/' + message._id,
      dataType: 'json',
      type: 'PUT',
      data: message,
      success: function(data) {
        this.state.data = this.state.data.map(function(dat) {
          return (dat._id === data._id) ? data : d;
        });
        this.setState({data: this.state.data});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({data: messages});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleMessageDelete: function(message) {
    $.ajax({
      url: 'http://localhost:3000/api/messages/' + message._id,
      dataType: 'json',
      type: 'DELETE',
      // data: message,
      success: function(dat) {
        this.setState({data: this.state.data.filter(function(data) {
          return data.id !== message._id
        })});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({data: messages});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function() {
    this.loadMessagesFromServer();
    setInterval(this.loadMessagesFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <section className="messageContainer">
      <h1>Movie Chat</h1>
      <MessageForm onMessageSubmit={this.handleMessageSubmit}/>
      <MessageList data={this.state.data} handleMessageChange={this.handleMessageChange} handleMessageDelete={this.handleMessageDelete} />
      </section>
    );
  }
});

var MessageList = React.createClass({
  render: function() {
    var messageNodes = this.props.data.map(function(message) {
      return (
        <Message author={message.author} text={message.text}
        id={message._id} onUpdate={this.props.handleMessageChange} onDelete={this.props.handleMessageDelete} >
        {message.text}
        </Message>
      );
    }.bind(this));
    return (
      <section className="messageList" >
      {messageNodes}
      </section>
    )}
});

var Message = React.createClass({
  getInitialState: function() {
    return {hideUpdateForm: true};
  },
  // rawMarkup: function() {
  //   var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
  //   return { __html: rawMarkup };
  // },
  del: function(e) {
    this.props.onDelete(this.props.message)
  },
  showForm: function () {
    console.log('update button hit');
    this.setState({hideUpdateForm: false});
  },
  hideForm: function() {
    this.setState({hideUpdateForm: true});
  },
  render: function() {
    return (
      <section className="message">
      <h2 className="messageAuthor">
      {this.props.author}
      </h2>
      <p>{this.props.text}</p>
      <div>
      <button onClick={this.showForm}>Update</button>
      <button onClick={this.del}>Delete</button>
      <UpdateMessageForm hide={this.hideForm} submitUpdate={this.props.onUpdate}
      hideForm={this.hideForm} shouldHide={this.state.hideUpdateForm} message={this.props} author={this.props.author} text={this.props.text} id={this.props._id}/>
      </div>
      </section>
    )
  }
})
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

var UpdateMessageForm = React.createClass({
  getInitialState: function() {
    console.log(this.props);
    return {author: this.props.author, text: this.props.text};
  },
  cancel: function(e) {
    e.preventDefault();
    this.setState({author: this.props.message.author, text: this.props.message.text})
    this.props.hide();
  },
  handleAuthorChange: function(e) {
    this.setState({author: e.target.value})
  },
  handleTextChange: function(e) {
    this.setState({text: e.target.value})
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var author = this.state.author.trim();
    var text = this.state.text.trim();
    console.log(this.props);
    console.log(this.state);
    if (!author || !text) return;
    this.props.submitUpdate({_id: this.props._id, author: author, text: text});
    this.setState({author: '', text: ''})
  },
  render: function() {
    return (
      <form className={this.props.shouldHide ? 'hidden' : ''} onSubmit={this.handleSubmit}>
      <input type="text" placeholder="New Name"  onChange={this.handleAuthorChange} /> <br/>
      <input type="text" placeholder="New Message"  onChange={this.handleTextChange} /> <br/>
      <button type="cancel" onClick={this.cancel}>Cancel</button>
      <input type="submit" value="post" onClick={this.handleSubmit} />
      </form>
    )}
});

ReactDOM.render(
  <MessageContainer url="http://localhost:3000/api/messages" pollInterval={10000} />,
  document.getElementById('content')
);
