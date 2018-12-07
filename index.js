var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var exphbs = require('express-handlebars');
//var dataUtil = require("./data-util");
var _ = require('underscore');
var expstate = require('express-state');


var app = express();
var mongoose = require('mongoose');
var dotenv = require('dotenv');


var model = require("./Sporting");
dotenv.load();

console.log(process.env.MONGODB);
mongoose.connect(process.env.MONGODB);

mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));
expstate.extend(app);
app.set("state namespace", 'App');

app.get('/', function(req, res){
  var arena_array = [];
  var arena_names = [];
  //var team_array = [];
  var event_array = [];

  model.Arena.find({}, function(err, arenas){
    if (err) throw err;
    arenas.forEach(function(a) {
      arena_names.push(a.name);
      arena_array.push(a);
    });
      model.Events.find({}, function(err, events){
        if (err) throw err;
        event_array = events;

        res.render("full", {
          a_names: arena_names,
          a: arena_array,
          //t: team_array,
          e: event_array
        });
      });
    //});
  });
  //res.send('<p>test</p>');

});

app.get('/api/', function(req, res){
  model.Arena.find({}, function(err, arenas){
    if (err) throw err;
    res.send(arenas);
  });
});

app.get('/api/arenas', function(req, res){
  model.Arena.find({}, function(err, arenas){
    if (err) throw err;
    res.send(arenas);
  });
});

app.get('/all_events', function(req, res){
  var event_array = [];

  model.Events.find({}, function(err, events){
    if (err) throw err;
    event_array = events;

    res.render("all_events", {
      e: event_array
    });
  });
});

app.get('/api/teams', function(req, res){
  model.Team.find({}, function(err, teams){
    if (err) throw err;
    res.send(teams);
  });
});
app.get('/api/events', function(req, res){
  model.Events.find({}, function(err, events){
    if (err) throw err;
    res.send(events);
  });
});

app.post('/arena', function(req, res){
  var arena = new model.Arena({
    name: req.body.name,
    city: req.body.city,
    state: req.body.state,
    country: req.body.country,
    capacity: req.body.capacity
  });

  arena.save(function(err){
    if (err) throw err;
    return res.render("arena_added", {arena: arena});
  });

});

app.post("/events", function(req, res){
  var a_event = new model.Events({
    arenaName: req.body.arena,
    date: req.body.date,
    //teams: teamNames,
    info: req.body.info
  });

  a_event.save(function(err){
    if (err) throw err;
    return res.render("event_added", {a_event: a_event});
  });
});

app.get('/new_arena', function(req, res){
  res.render('arena_form', {});
});

app.get('/new_event', function(req, res){
  var arena_array = [];
  model.Arena.find({}, function(err, arenas){
    if (err) throw err;
    arenas.forEach(function(a) {
      arena_array.push(a.name);
    });
    res.render("event_form", {a: arena_array});
  });
})

app.get('/arenas_MD', function(req, res){
  model.Arena.find({state: "Maryland"}, function(err, arenas){
    if (err) throw err;

    res.render('arenas_MD', {a: arenas});
  });

});

app.get('/arenas_capacity', function(req, res){
  model.Arena.find({}, function(err, arenas){
    if (err) throw err;
    var sortedArenas = _.sortBy(arenas, function(a){ return a.capacity});
    res.render('arenas_capacity', {a: sortedArenas.reverse()});
  });
});

app.get('/arenas_sorted', function(req, res){
  model.Arena.find({}, function(err, arenas){
    if (err) throw err;
    var sorted_arenas = _.sortBy(arenas, function(a){ return a.name});
    res.render('arenas_sorted', {a: sorted_arenas});
  });
});

app.get('/sorted_teams', function(req, res){
  model.Team.find({}, function(err, teams){
    if (err) throw err;
    var sorted_teams =  _.sortBy(teams, function(t){ return t.name});
    res.render('sorted_teams', {t: sorted_teams});
  });
});

/* Add whatever endpoints you need! Remember that your API endpoints must
 * have '/api' prepended to them. Please remember that you need at least 5
 * endpoints for the API, and 5 others.
 */

app.listen(process.env.PORT || 3000, function() {
    console.log('Sporting Events Application listening on port 3000!');
});
