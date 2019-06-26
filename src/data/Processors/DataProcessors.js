import BaseDataProcessor from "./BaseDataProcessor";
import Chat from "../structs/Chat";
// const login = require("facebook-chat-api")

export class FbProcessor extends BaseDataProcessor {
}

export class WhatsAppProcessor extends BaseDataProcessor {}

export class InstaProcessor extends BaseDataProcessor {}

export class GroupMeProcessor extends BaseDataProcessor {}

export class SignalProcessor extends BaseDataProcessor {}

export class TransmtionProcessor extends BaseDataProcessor {}

export class HangoutsProcessor extends BaseDataProcessor {}

export class CSVProcessor extends BaseDataProcessor {
    formatData(CSV){
    }
}
export class JSONProcessor extends BaseDataProcessor {
    formatData(input){
        let json = JSON.parse(input)
        let chat = new Chat(json.title)
        chat.fromJson(json.messages)
        return chat
    }
}

