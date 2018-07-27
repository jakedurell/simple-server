const http = require('http');
const fs = require('fs');
const mime = require('mime-types');
const urlParser = require('url');
const Assistant = require('./assistant');
const House = require('./lib/house');
const port = process.env.PORT || 5000;

http.createServer(handleRequest).listen(port);
console.log(process.env.Authors)
console.log("Listening on port: " + port);

let house = new House()

function handleRequest(request, response) {
    console.log('request.url is ' + request.url);

    let assistant = new Assistant(request, response);
    let path = assistant.path

    let since = request.url.split('?')[1]
    console.log("since is: ")
    console.log(since)

    let data
    let messages
    let message
    try {
        if (path === '/') {
            assistant.sendFile('index.html');
            house.roomWithId("amaze", "Amazing")
            console.log("just set up room amaze")
            
        } else if (path === '/chat') {
            console.log('Parsing the post...')

            if (assistant.request.method === 'GET') {
                console.log("HELLO FROM GET!")
                if (since === undefined) {
                    console.log("Hello from since = undefined")
                    data = house.getMessagesInRoom("amaze")
                    data = JSON.stringify(data);
                }
                else {
                    console.log("Hello from since = else")
                    data = house.getMessagesInRoom("amaze", since)
                    data = JSON.stringify(data);
                    console.log(data)
                }
                console.log("Hello from after since tests")
                console.log(data) 

                let type = mime.lookup('json')
                assistant.finishResponse(type, data)



            } else {

                assistant.parsePostParams((params) => {
                    let message = {
                        name: 'Anonymous',
                        body: params.body,
                        when: new Date().toISOString()
                    }
                    messages = house.sendMessageToRoom("amaze", message)
                    console.log(messages)
                    // messages.push(message);
                    // console.log({ message });
                    // console.log({ messages });
                    let data = JSON.stringify(messages);
                    let type = mime.lookup('json')
                    assistant.finishResponse(type, data)
                });
            }
        }


        else {
            let filename = path.slice(1)
            assistant.sendFile(filename)
        }

    }
    catch (error) {
        console.log(error)
        assistant.sendError(404, "Error: " + error.toISOString())
    }

}