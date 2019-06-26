import Message from "./Message";
import { summarizers } from "istanbul-lib-report";

export default class Chat {
    constructor(title){
        this.messages = []
        this.members = []
        this.title = title
    }

    toJson(){
        return this.messages.map(msg => {
            return(msg.toJson())
        })
    }

    fromJson(messagesJson){
        messagesJson.forEach((msg,i) => {
            let message = new Message(i)
            message.fromJson(msg)
            if (!this.members.includes(message.sender)){this.members.push(message.sender)}
            this.messages.push(message)
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

    getAverageWords(messages=this.messages){
        return this.getTotalWords(messages)/messages.length
    }

    getTotalWords(messages=this.messages){
        return messages.reduce((acum, curr) => acum +curr.getWordLength())
    }

    getTotalCharacters(messages=this.messages){
        return 
    }

    getTotalMessages(messages=this.messages){
        return messages.length
    }
}