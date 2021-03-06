export default class Message {
  constructor(sender=null, content=null, timestamp=null) {
    this.sender = sender;
    this.content = content;
    this.timestamp = timestamp;
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

  getWordList(){
    if(this.content){
      let words = this.content.split(" ")
      words = words.map(word => {
        word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()"]/g,"")
        word = word.toLowerCase()
        return word //regex to remove punctuation
      });
      return words
    }
    return []
  }

  getWordLength() {
    if(this.content ){
      return this.getWordList().length;
    }
    return 0;
  }

  getCharacterLength() {
    if (this.content){
      return this.content.length;
    }
    return 0
  }

  getDate() {
    if(this.timestamp){
      return new Date(this.timestamp).toDateString();
    }
    return new Date(0).toDateString()
  }
  getHourIndex(){
    if(this.timestamp){
      const hourOffset = this.timestamp - Date.parse(this.getDate()) 
      return Math.round(((hourOffset/1000)/60)/60) 
    }
  }
}
