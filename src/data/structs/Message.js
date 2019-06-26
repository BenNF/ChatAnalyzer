export default class Message {
    constructor({sender, contents, timestamp}){
        this.sender = sender
        this.content = contents
        this.timestamp = timestamp
    }

    fromJson(json){
        this.sender = json.sender
        this.content = json.content
        this.timestamp = json.timestamp
    }
    
    toJson(){
        return {
            sender: this.sender,
            content: this.content,
            timestamp: this.timestamp
        }
    }

    getSentiment() {
        //TODO impliment this 
    }
    
    getWordLength() {
        return (this.content.split(" ").length)
    }

    getCharacterLength(){
        return this.content.length
    }

}