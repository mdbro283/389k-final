var mongoose = require('mongoose');

var arenaSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  country: {
    type: String
  },
  capacity: {
    type: Number
  }
});

var Arena = mongoose.model("Arena", arenaSchema);

var teamSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  }
});

var Team = mongoose.model("Team", teamSchema);

var eventSchema = new mongoose.Schema({
  date: {
    type: Date
  },
  arenaName: {
    type: String
  },
  teams: {
    type: [String]
  },
  info: {
    type: String
  }
});

var Events = mongoose.model("Event", eventSchema);


module.exports = { Arena: Arena, Events: Events, Team: Team };
