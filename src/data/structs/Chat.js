import Message from "./Message";
import { summarizers } from "istanbul-lib-report";

export default class Chat {
  constructor(title) {
    this.messages = [];
    this.members = [];
    this.title = title;
  }
  append(msg){
    this.messages.push(msg)
    if (!this.members.includes(msg.sender )){
      this.members.push(msg.sender)
    }
  }

  toJson() {
    return this.messages.map(msg => {
      return msg.toJson();
    });
  }

  fromJson(messagesJson) {
    messagesJson.forEach((msg, i) => {
      let message = new Message(i);
      message.fromJson(msg);
      if (!this.members.includes(message.sender)) {
        this.members.push(message.sender);
      }
      this.messages.push(message);
    });
  }

  getMessagesBySender(sender) {
    return this.messages.filter(msg => msg.sender === sender);
  }

  getMetricsBySender(sender) {
    const msgs = this.getMessagesBySender(sender);
    return {
      title: sender,
      total: {
        words: this.getTotalWords(msgs),
        messages: this.getTotalMessages(msgs),
        days: this.getTotalDays(msgs),
        chars: this.getTotalCharacters(msgs)
      },
      average: {
        words: this.getAverageWords(msgs),
        messages: this.getAveragesMessagesPerDay(msgs),
        chars: this.getAverageChars(msgs)
      }
    };
  }

  getAverageWords(messages = this.messages) {
    return (
      Math.round((this.getTotalWords(messages) / messages.length) * 100) / 100
    );
  }

  getAverageChars(messages = this.messages) {
    return (
      Math.round((this.getTotalCharacters(messages) / messages.length) * 100) /
      100
    );
  }

  getAveragesMessagesPerDay(messages = this.messages) {
    return (
      Math.round(
        (this.getTotalMessages(messages) / this.getTotalDays(messages)) * 100
      ) / 100
    );
  }

  getTotalWords(messages = this.messages) {
    return messages.reduce((acum, curr) => acum + curr.getWordLength(), 0);
  }

  getTotalCharacters(messages = this.messages) {
    return messages.reduce((acum, curr) => acum + curr.getCharacterLength(), 0);
  }

  getTotalMessages(messages = this.messages) {
    return messages.length;
  }

  getTotalDays(messages = this.messages) {
    const days = messages.map(msg => msg.getDate());
    return new Set(days).size;
  }
}
