var MessageContainer = React.createClass({
  render: function() {
    return (
      <section className="messageContainer">
      <h1>Messages</h1>
      <MessageList />
      <MessageForm />
      </section>
    );
  }
});

var MessageList = React.createClass({
  render: function() {
    return (
      <section className="messageList">
      This is the message list
      </section>
    );
  }
});

var MessageForm = React.createClass({
  render: function() {
    return (
    <section className="messageForm">
    This is the message form
    </section>
  );
  }
});

var Message = React.createClass({
  render: function() {
    return (
      <div className="message">
        <h2 className="messageAuthor">
        {this.props.author}
        </h2>
        {this.props.children}
      </div>
    )
  }
})

ReactDOM.render(
  <MessageContainer />,
  document.getElementById('content')
);
