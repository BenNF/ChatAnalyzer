import Message from "./Message";

export default class Chat {
    constructor(){
        this.messages = []
        this.members = []
    }

    toJson(){
        return this.messages.map(msg => {
            return(msg.toJson())
        })
    }

    fromJson(messagesJson){
        messagesJson.forEach(msg => {
            if (!this.members.includes(msg.sender)){this.members.push(msg.sender)}
            this.messages.push(new Message().fromJson(msg))
        })
    }

    messagesBySender(sender){
        return (this.messages.filter(msg => msg.sender === sender))
    }

    getAverageWordsBySender(){
        let averageWordsBySender = {}
        this.members.forEach(member => {
            averageWordsBySender[member] = this.getAverageWords(this.messagesBySender(member))
        })
        return averageWordsBySender;
    }

    getAverageWords(messages){
        return messages.reduce((acum, curr) => acum +curr.getWordLength())/messages.length
    }
}