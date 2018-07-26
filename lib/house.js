let Room = require('./room.js')

module.exports = class House {
    constructor() {
        this.allRooms = [];
    }

    roomWithId(roomId, name) {
        let roomFound = this.allRooms.find((room) => {
            return room.id === roomId;
        })

        if (roomFound) {

            return roomFound
        }
        else {
            let newRoom = new Room(roomId, name)
            this.allRooms.push(newRoom)
            return newRoom
        }

    }

    allRoomIds() {
        return this.allRooms.map(obj => obj.id);
        
    }


    sendMessageToRoom(roomId, message) {
        let theRoom = this.roomWithId(roomId);
        return theRoom.sendMessage(message);
        
    }

    getMessagesInRoom(roomId, since){
        let theRoom = this.roomWithId(roomId);
        return theRoom.messagesSince(since)
    }

}



//CLC DIAGRAM
//CLASS RESPONSIBILITIES COLLABERATORs 







