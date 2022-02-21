var express = require('express');
var googlehome = require('./google-home-notifier');
var app = express();
const serverPort = 8091; // default port

app.get('/google-home-notifier', function (req, res) {

  console.log(req.query);

  var text = req.query.text;
  var ip = req.query.ip;
  var level = 0.5;
  if (req.query.level) {
    level = parseFloat(req.query.level);
  }

  var language = 'ja'; // default language code
  if (req.query.language) {
    language = req.query.language;
  }

  googlehome.ip(ip, language)

  if (text) {
    try {
      if (text.startsWith('http')){
        var mp3_url = text;
        googlehome.play(mp3_url, level, function(notifyRes) {
          console.log(notifyRes);
          res.send('device will play sound from url: ' + mp3_url + '\n');
        });
      } else {
        googlehome.notify(text, level, function(notifyRes) {
          console.log(notifyRes);
          res.send('device will say: ' + text + '\n');
        });
      }
    } catch(err) {
      console.log(err);
      res.sendStatus(500);
      res.send(err);
    }
  }else{
    res.send('Please GET "ip=x.x.x.x&level=0.5&text=Hello+Google+Home"');
  }
})

app.listen(serverPort, function () {
})
