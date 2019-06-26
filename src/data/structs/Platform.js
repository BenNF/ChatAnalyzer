import Chat from "./Chat";

export default class Platform{
    constructor(){
        this.chats = {}
    }

    populate(platformJson){
        Object.keys(platformJson).forEach(key => {
            this.chats[key] = new Chat().fromJson(platformJson[key])
        })
    }
}