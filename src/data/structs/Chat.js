import Message from "./Message";


export default class Chat {
  constructor(title) {
    this.messages = [];
    this.members = [];
    this.title = title;
  }
  append(msg) {
    this.messages.push(msg);
    if (!this.members.includes(msg.sender)) {
      this.members.push(msg.sender);
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
      },
      common: {
        words: this.getMostCommonWords(msgs, 10),
        emoji: this.getMostCommonEmojis(msgs, 3)
      }
    };
  }
  
  //TODO could this function be better? it seems inefficient and a bit too long
  getMostCommonWords(msgs, count) {
    const ignoredWords = [
      "the",
      "some",
      "few",
      "he",
      "him",
      "his",
      "she",
      "her",
      "hers",
      "they",
      "their",
      "theirs",
      "was",
      "yes",
      "for",
      'that',
      'this',
      'have',
      'had',
      'has',
      'and',
      "that's",
      "i'm",
      "it's",
      'get',
      'like',
      'just',
      'your',
      "you're",
      "yeah",
      'not',
      'are',
      'but',
      "don't",
      'lol',
      'now',
      "out",
      'where',
      'what',
      'why',
      'how',
      'when',
      'now',
      'got',
      'gonna',
      'good',
      "you",
      'can',
      "i'll",
      "there",
      'ill'
    ];
    const frequency = {};
    const mostUsedWords = {
      values: {},
      min: { key: "default", value: -1 }
    };

    const words = msgs
      .map(msg => {
        return msg.getWordList();
      })
      .flat()
      .filter(word => !ignoredWords.includes(word.toLowerCase()) && word.length >= 3); //filtered and flattened word list

    words.forEach(word => {
      if (frequency[word]) {
        frequency[word]++;
      } else {
        frequency[word] = 1;
      }
    });

    const updateMin = () => {
      //update the current minimum value
      Object.keys(mostUsedWords["values"]).forEach(key => {
        if (
          mostUsedWords["values"][key] < mostUsedWords["min"].value ||
          mostUsedWords["min"].value === -1
        ) {
          mostUsedWords["min"].key = key;
          mostUsedWords["min"].value = mostUsedWords["values"][key];
        }
      });
    };

    Object.keys(frequency).forEach(key => {
      if (Object.keys(mostUsedWords["values"]).length < count) {
        mostUsedWords["values"][key] = frequency[key];
        updateMin();
      } else {
        if (frequency[key] > mostUsedWords["min"].value) {
          const deleteKey = mostUsedWords["min"].key;
          delete mostUsedWords["values"][deleteKey]; //delete key in values of smallest element
          mostUsedWords["values"][key] = frequency[key]; //add the value
          mostUsedWords["min"].key = "removed";
          mostUsedWords["min"].value = -1;

          updateMin();
        }
      }
    });
    return mostUsedWords.values;
  }

  getMostCommonEmojis(msgs, cout) {
   
    return [];
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
