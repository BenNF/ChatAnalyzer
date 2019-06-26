export default class Message {
  constructor(index) {
    this.index = index;
    this.sender = null;
    this.content = null;
    this.timestamp = null;
  }

  fromJson(json) {
    this.sender = json.sender_name;
    this.content = json.content;
    this.timestamp = json.timestamp_ms;
  }

  toJson() {
    return {
      sender_name: this.sender,
      content: this.content,
      timestamp_ms: this.timestamp
    };
  }

  getSentiment() {
    //TODO impliment this
  }

  getWordLength() {
    return this.content.split(" ").length;
  }

  getCharacterLength() {
    return this.content.length;
  }

  getDate() {
    return new Date(this.timestamp).toDateString();
  }
}
