module.exports = class Room {
    
    constructor(room, name) {
        if (!room) {
            throw ('room id required');
        }
        else if (room.match(/[A-Z]/g) || room.match(/\W+/g) || room.match(/[[:blank:]]/g)) {
            throw('room id must contain only lowercase letters')
        }
        else {
            this.id = room
            
        }

        if (!name) {
            this.name = room.charAt(0).toUpperCase() + room.substr(1)
        }
        else {
            this.name = name
        }

        this.messages = []

    }
    
    sendMessage(message) {
        return this.messages.push(message)
    }

    messageCount(){
        return this.messages.length;
    }

    messagesSince(sinceDate){
        let data = []
        for (let i = 0; i < this.messages.length; i++) {
            if (this.messages[i].when > sinceDate)
                data.push(this.messages[i])
        }
        return data;
    }


}