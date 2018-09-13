//Define pointers for main chat window and user input
let chatForm = document.getElementById('chat-form')
let chatLog = document.getElementById('chat-log')

//time array for previously used since functions. Now getting all messages all the time
let timeArray = []

//name for ajax auto generate username function below
let name

//default room
let roomID = "whiteroom"
let room = "White Room"

//fetch string (chat)
let getString = '/chat?' + roomID + '?' + room

//define click event for hidden get button
var event = new Event('click');

//automatically generates a username 
$.ajax({
    url: 'https://randomuser.me/api/',
    dataType: 'json',
    success: function (data) {
        name = data.results[0].name.first;
        name = name.charAt(0).toUpperCase() + name.slice(1)
        let windowsBar = document.getElementById('windowsBar') 
        console.log(name)
        windowsBar.innerHTML += " " + name + " - Instant Message"
    }
});

$(".btn-group button").click(function () {
    roomID = $(this).attr('id');
    room = $(this).text();
    // console.log("just got roomID (" + roomID + ") for room: " + room)
    $(".btn-group button").removeClass('active')
    $("#buttonvalue").addClass('active')

    let selectColor = room.replace(' Room', "")
    let color
    if (selectColor === "Green") {color = "#56d032"}
    if (selectColor === "White") {color = ""}
    if (selectColor === "Pink") {color = "#ffd8fb"}
    console.log(color)
    $("#chat-log").css('background-color',color)
    $("#chat-log").html("")
});

//makes sure that you don't get messages that are more than 24 hours old
let mostRecentMessageAt = new Date(Date.now() - 86400 * 1000).toISOString()

//Gets and displays user location data from ip-api.com
// $.getJSON("http://ip-api.com/json/?callback=?", function (data) {
//     console.log(data);
//     $('#IP_Address').append("Your IP: " + data.query);
//     $('#Country').append("Your Country: " + data.country);
//     $('#City').append("Your City: " + data.city);
// });

//adds an event listener for submit event from input field or enter key
chatForm.addEventListener('submit', (event) => {
    let inputElement = chatForm.querySelector('input[name=body]')
    let message = inputElement.value;
    message = '<b>' + name + ': </b>' + message
    console.log(message)
    //this captures the value from the data form
    params = new URLSearchParams();//conduit between form and fetch
    params.append('body', message)

    //making a post request. server knows there is a body associated with it
    inputElement.value = ""
    fetch(getString, {
        method: 'POST',
        body: params,//params is the data being passed. body is content of whats being sent

        //server responds with a string. there is json in the string. then get a json response back and that becomes messages
    }).then((response) => response.json())
        .then((messages) => {
            //wipes the innerHTML of chatLog
            chatLog.innerHTML = " "

            //reprint ALL messages received from server to chatLog
            for (let note of messages) {
                chatLog.innerHTML += '<br>' + note.body
            }
            // setMostRecentTime(messages)
            $('#chat-log').stop().animate({
                scrollTop: messages.length * 25
            }, 100);
        })
    event.preventDefault();
    // chatLog.scrollTop = chatLog.scrollHeight
    // $("#chat-log").scrollTop($("#chat-log")[0].scrollHeight);



});

//button that gets new messages 
let getLog = document.getElementById('getNewMessages')




getLog.addEventListener('click', (event) => {
    getString = '/chat?' + roomID + '?' + room
    fetch(getString, {
        method: 'GET'
    }).then((response) => response.json())
        .then((messages) => {
            if (messages.length > 0) {
                chatLog.innerHTML = '<br>'
                //goes through every element and creates an invisible array which is put into HTML and then joined together
                chatLog.innerHTML += messages.map((message) => message.body).join('<br>')

                // setMostRecentTime(messages)
            }
            $('#chat-log').stop().animate({
                scrollTop: messages.length * 25
            }, 100);
        })
    event.preventDefault();

})


// Dispatch the event.

alwaysGet()

function alwaysGet() {
    getLog.dispatchEvent(event);
    //do your response
    setTimeout(alwaysGet, 500);
}

// callAjax();

//gets all times for all messages and find most recent
function setMostRecentTime(messages) {
    timeArray = messages.map((message) => message.when)
    timeArray.sort()
    timeArray.reverse()
    mostRecentMessageAt = timeArray[0]
    // getString = '/chat?' + mostRecentMessageAt
}