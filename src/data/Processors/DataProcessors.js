import BaseDataProcessor from "./BaseDataProcessor";
import Chat from "../structs/Chat";
// const login = require("facebook-chat-api")

export class FbProcessor extends BaseDataProcessor {
  formatJsonData(input) {
    let json = JSON.parse(input);
    let chat = new Chat(json.title);
    chat.fromJson(json.messages);
    return chat;
  }
  formatHTMLData(input) {
    const messages = Array.from((document.createElement("html").innerHTML = input).querySelector('[role="main"]').children) //parsing facebook html
    messages.forEach(msg=> {
        const sender = msg[0].innerText
        const content = msg[1].children[0].children[1].innerText
        const timestamp = Date.parse(msg[2].innerText)
    })
    debugger
    return input;
  }
  authUser() {
    return null;
  }
}

export class TwitterProcessor extends BaseDataProcessor {}

export class WhatsAppProcessor extends BaseDataProcessor {}

export class InstaProcessor extends BaseDataProcessor {}

export class SMSProcessor extends BaseDataProcessor {}

// export class GroupMeProcessor extends BaseDataProcessor {}

// export class SignalProcessor extends BaseDataProcessor {}

// export class TransmtionProcessor extends BaseDataProcessor {}

// export class HangoutsProcessor extends BaseDataProcessor {}
