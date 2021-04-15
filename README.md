# websocket-poc

A basic implementation of client/server full-duplex communication via web sockets.

This can be tested using two different terminals:

In terminal 1:

```
node websocketServer.js
```

This will launch the server process, listening on port 8080.

In terminal 2:

```
node websocketClient.js
```

This will create the client process that connects to the server on port 8080.

Once connected, the client sends the command **StartFileGeneration** that will begin a long-running file generation simulation on the server side. In reality, the server is not generating any files as this is just proof of concept. But a simple timer runs and simulates generating a file every 10 seconds.

Upon each simulated file generation, a message is sent to the client providing a status update, and the name of the simulated file.

Once the server is "finished" (see var **simulationMinutes**), it sends a message of type **complete** to the client, along with the total number of files generated. When the client receives a message of type **complete** it disconnects from the server.

If the client disconnects, the server stops its work:

```
connection.on('close', function (reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        StopSimulatingWork();
    });
```

Websockets provide the following benefits over standard HTTP operations:

- Full duplex communications, allowing the server to send messages to the client, as well as client to server. HTTP only allows for half duplex communications, requiring the client to constantly ping the server or remote resource.
- Less overhead. HTTP requests require moderate overhead per request. Websockets require moderate overhead to establish the connection, then minimal overhead per message.

## When should I use websockets vs. HTTP?

This blog addresses exactly this question: https://blogs.windows.com/windowsdeveloper/2016/03/14/when-to-use-a-http-call-instead-of-a-websocket-or-http-2-0/

TL;DR:
Websockets can be better when:

- _"... a client wants ongoing updates about the state of the resource, WebSockets are generally a good fit. WebSockets are a particularly good fit when the client cannot anticipate when a change will occur and changes are likely to happen in the short term."_
- _"... a client needs to react quickly to a change (especially one it cannot predict), a WebSocket may be best. Consider a chat application that allows multiple users to chat in real-time."_
- Using High-Frequency messages with small payloads. _"The WebSocket protocol offers a persistent connection to exchange messages. This means that individual messages don’t incur any additional tax to establish the transport. Taxes such as establishing SSL, content negotiation, and exchange of bulky headers are imposed only once when the connection is established._

HTTP can be a better fit when:

- _"... A client wants the current state of a resource and does not want or require ongoing updates.Example: A football fan wants to check the result of a game. If the game were from last week, the game result would be stable and additional updates very unlikely. In that case, HTTP would be a sound choice. Not so, however, if the game were currently in progress."_
- Requesting Highly Cacheable Resources. _"Resources benefit from caching when the representation of a resource changes rarely or multiple clients are expected to retrieve the resource."_
- Idempotency and safety. _"HTTP methods have well-known idempotency and safety properties. A request is “idempotent” if it can be issued multiple times without resulting in unique outcomes... This property is the key to enabling caching (or pre-fetching)."_
- Synchronized Events. _"The request-response pattern is well suited to operations that require synchronization or that must act in a serialized fashion. The HTTP response represents a definitive conclusion to a specific request, allowing subsequent actions to be gated on it. In WebSockets, this detail is left up to the messaging layer design."_

Start with HTTP in mind:

_As a starting place, we suggest assuming your API should be traditional HTTP by default unless the guidance in this blog can convince you that WebSockets would truly be the better choice._
