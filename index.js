let chatForm = document.getElementById('chat-form')
let chatLog = document.getElementById('chat-log')
let timeArray = []

$.getJSON("http://ip-api.com/json/?callback=?", function (data) {
    console.log(data);
    $('#IP_Address').append("Your IP: " + data.query);
    $('#Country').append("Your Country: " + data.country);
    $('#City').append("Your City: " + data.city);
});

chatForm.addEventListener('submit', (event) => {
    let inputElement = chatForm.querySelector('input[name=body]')
    let message = inputElement.value;
    params = new URLSearchParams();
    params.append('body', message)

    inputElement.value = ""
    fetch('/chat', {
        method: 'POST',
        body: params,

    }).then((response) => response.json())
        .then((messages) => {
            chatLog.innerHTML += '<br>' + message
        })
    event.preventDefault();

});

let getLog = document.getElementById('getAllNow')
let mostRecentMessageAt = new Date(Date.now() - 86400 * 1000).toISOString()
let gotStatus = false

let getString = '/chat'

getLog.addEventListener('click', (event) => {

    fetch(getString, {
        method: 'GET'
    }).then((response) => response.json())
        .then((messages) => {
            if (messages.length > 0) {
                chatLog.innerHTML += '<br>'
                chatLog.innerHTML += messages.map((message) => message.body).join('<br>')
                for (let i = 0; i < messages.length; i++) {
                    timeArray.push(messages[i].when)
                }
                timeArray.sort()
                timeArray.reverse()
                mostRecentMessageAt = timeArray[0]
                gotStatus = true
                getString = '/chat?' + mostRecentMessageAt
            }

        })
    event.preventDefault();

})