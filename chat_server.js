const http = require('http');
const fs = require('fs');
const mime = require('mime-types');
const urlParser = require('url');
const Assistant = require('./assistant');
const House = require('./lib/house');
const port = process.env.PORT || 5000;

http.createServer(handleRequest).listen(port);
// console.log(process.env.Authors)
console.log("Listening on port: " + port);

let house = new House()
let roomID = "whiteroom"
let room = "White Room"

function handleRequest(request, response) {
    console.log('request.url is ' + request.url);

    let assistant = new Assistant(request, response);
    let path = assistant.path

    console.log("PATH IS " + path)

    roomID = request.url.split('?')[1]
    room = request.url.split('?')[2]

    // let since = request.url.split('?')[1]
    let since = undefined
    // console.log("since is: ")
    // console.log(since)

    let data
    let messages
    let message
    try {
        if (path === '/') {
            console.log("Hi from / path")
            roomID = "whiteroom"
            room = "White Room"
            assistant.sendFile('index.html');
            house.roomWithId(roomID, room)
            console.log("just set up roomID " + roomID + " and room " + room)

        } else if (path === '/chat') {
            // assistant.sendFile('index.html');
            house.roomWithId(roomID, room);
            // console.log('Parsing the post...')
            console.log("just got roomID (" + roomID + ") for room: " + room)
            if (assistant.request.method === 'GET') {
                // console.log("HELLO FROM GET!")
                console.log("Hello from GET. here is data:")
                data = house.getMessagesInRoom(roomID,since)
                data = JSON.stringify(data);
                console.log(data)
                let type = mime.lookup('json')
                assistant.finishResponse(type, data)

            } else {

                assistant.parsePostParams((params) => {
                    console.log("hi from POST on server. Here's the message I have: ")
                    let message = {
                        name: 'Anonymous',
                        body: params.body,
                        when: new Date().toISOString()
                    }
                    console.log(message)
                    messages = house.sendMessageToRoom(roomID, message)

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
        assistant.sendError(404, "Error: " + error)
    }

}