class Events {
  constructor() {
    this.events = {};
  }

  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  trigger(eventName) {
    const callbacks = this.events[eventName];
    if (callbacks) {
      callbacks.forEach((callback) => callback());
      this.logEventToMongo(eventName); // Log to MongoDB
      this.logEventToFile(eventName); // Log to app.log
    }
  }

  off(eventName) {
    delete this.events[eventName];
  }

  // Log event to MongoDB
  logEventToMongo(eventName) {
    // Connect to MongoDB (replace with your MongoDB connection details)
    const MongoClient = require('mongodb').MongoClient;
    const uri = "mongodb://your_mongo_uri";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
      const collection = client.db("your_database_name").collection("events");
      collection.insertOne({ event: eventName, triggerTime: new Date() })
        .then(() => console.log("Event logged to MongoDB"))
        .catch(err => console.error("Error logging to MongoDB:", err));
      client.close();
    });
  }

  // Log event to app.log
  logEventToFile(eventName) {
    const fs = require('fs');
    fs.appendFile('app.log', `${eventName} --> ${new Date().toISOString()}\n`, (err) => {
      if (err) console.error(err);
    });
  }
}
