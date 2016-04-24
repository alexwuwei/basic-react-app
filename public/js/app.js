// // const marked = require('marked');
//
// var MessageContainer = React.createClass({
//   render: function() {
//     return (
//       <section className="messageContainer">
//       <h1>Messages</h1>
//       <MessageList data={this.props.data} />
//       <MessageForm />
//       </section>
//     );
//   }
// });
//
// var MessageList = React.createClass({
//   render: function() {
//     var messageNodes = this.props.data.map(function(message) {
//       return (
//         <Message author={message.author} key={message.id}>
//         {message.text}
//         </Message>
//       );
//     });
//     return (
//       <section className="messageList">
//       // <Message author="bob" >This is a message</Message>
//       // <Message author="mary" >This is another message</Message>
//       {messageNodes}
//       </section>
//     );
//   }
// });
//
// var MessageForm = React.createClass({
//   render: function() {
//     return (
//     <section className="messageForm">
//     This is the message form
//     </section>
//   );
//   }
// });
//
// var data = [
//   {id: 1, author: 'bob', text: 'hello'},
//   {id: 2, author: 'bill', text: 'something'}
// ];
//
// var Message = React.createClass({
//   //raw markdown stuff left out on purpose.
//   render: function() {
//     return (
//       <div className="message">
//         <h2 className="messageAuthor">
//         {this.props.author}
//         </h2>
//         {marked(this.props.children).toString()}
//       </div>
//     )
//   }
// })
//
// ReactDOM.render(
//   <MessageContainer data={data} />,
//   document.getElementById('content')
// );

// const marked = require('marked');

var MessageContainer = React.createClass({
  loadMessagesFromServer: function() {
    $.ajax({
      url: 'http://localhost:3000/api/messages',
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data})
        console.log('data received is: ', data);
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
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({data: messages});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
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
      <h1>Messages</h1>
      <MessageList data={this.state.data} />
      <MessageForm onMessageSubmit={this.handleMessageSubmit}/>
      </section>
    );
  }
});

var MessageList = React.createClass({
  render: function() {
    var messageNodes = this.props.data.map(function(message) {
      return (
        <Message author={message.author} key={message.id}>
        {message.text}
        </Message>
      );
    });
    return (
      <section className="messageList">
      // <Message author="bob" >This is a message</Message>
      // <Message author="mary" >This is another message</Message>
      {messageNodes}
      </section>
    );
  }
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

var data = [
  {id: 1, author: 'bob', text: 'hello'},
  {id: 2, author: 'bill', text: 'something'}
];

var Message = React.createClass({
  rawMarkup: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return { __html: rawMarkup };
  },
  render: function() {
    return (
      <section className="message">
        <h2 className="messageAuthor">
        {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
      </section>
    )
  }
})

ReactDOM.render(
  <MessageContainer url="http://localhost:3000/api/messages" pollInterval={10000} />,
  document.getElementById('content')
);
