var Client = require('castv2-client').Client;
var DefaultMediaReceiver = require('castv2-client').DefaultMediaReceiver;
var deviceAddress;
var language;

var ip = function(ip, lang = 'en') {
  deviceAddress = ip;
  language = lang;
  return this;
}

var googleTTS = require('google-tts-api');

var notify = function(message, level, callback) {
  getSpeechUrl(message, deviceAddress, level, function(res) {
    callback(res);
  });
};

var play = function(mp3_url, level, callback) {
  getPlayUrl(mp3_url, deviceAddress, level, function(res) {
    callback(res);
  });
};

var getSpeechUrl = function(text, host, level, callback) {
  googleTTS(text, language, 1).then(function (url) {
    onDeviceUp(host, url, level, function(res){
      callback(res)
    });
  }).catch(function (err) {
    console.error(err.stack);
  });
};

var getPlayUrl = function(url, host, level, callback) {
    onDeviceUp(host, url, level, function(res){
      callback(res)
    });
};

var onDeviceUp = function(host, url, level, callback) {
  var client = new Client();
  client.connect(host, function() {
    client.setVolume({ level }, function(err, newVol) { });
    client.launch(DefaultMediaReceiver, function(err, player) {

      var media = {
        contentId: url,
        contentType: 'audio/mp3',
        streamType: 'BUFFERED' // or LIVE
      };
      player.load(media, { autoplay: true }, function(err, status) {
        client.close();
        callback('Device notified');
      });
    });
  });

  client.on('error', function(err) {
    console.log('Error: %s', err.message);
    client.close();
    callback('error');
  });
};

exports.ip = ip;
exports.notify = notify;
exports.play = play;
