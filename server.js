const serverLess = require('serverless-http');
const express = require('express');
const app = express();
const http = require('http').Server(app);
//const mongo = require('mongojs');
var db = null; //mongo('localhost:27017/myGame', ['account', 'progress']);

//user require
const Player = require('./script/player.js');
const Bullet = require('./script/bullet.js');
const Group = require('./script/group.js');

//end
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});


app.use('/public', express.static(__dirname + '/public'));
app.use('/client', express.static(__dirname + '/client'));

app.use('/.netlify/functionsapi', express.Router());

modules.exports.handler = serverLess(app);

// http.listen(process.env.PORT || 8000, () => {

// });


const io = require('socket.io')(http);


var isValidPassword = function(data, id, cb) {
    return cb(true);
    // db.account.find({username:data.username, password:data.password}, (err, res) => {
    //     if(res.length > 0 && Group.compare(data.username)){
    //         cb(true);
    //         Group.add('e', {name : data.username, num : id});
    //     }
    //     else {
    //         cb(false);
    //     }
    // });
    
};

var isUsernameTaken = function(data, cb) {
    return cb(false);
    // db.account.find({username:data.username}, (err, res) => {
    //     if(res.length > 0){
    //         cb(true);
    //     }
    //     else {
    //         cb(false);
    //     }
    // });
}
;
var addUser = function(data, cb) {
    return cb();
    // db.account.insert({username:data.username, password:data.password}, (err) => {
    //     cb();
    // });
};

var DEBUG = true;

io.on('connection', socket => {
    //initialize
    socket.id = Math.random();
    Group.add('s', socket);
    socket.on('signIn', (data) => {
        isValidPassword(data, socket.id, (res) => {
            if(res){
                Player.onConnect(socket);
                socket.emit('signIn_Res', { success : true, player : Group.get_length() });
            }
            else{
                socket.emit('signIn_Res', { success : false });
            }
        })
    });
    socket.on('signUp', (data) => {
        isUsernameTaken(data, (res) => {
            if(res){
                socket.emit('signUp_Res', { success : false });
            }
            else{
                addUser(data, () => {
                    socket.emit('signUp_Res', { success : true });
                });
            }
        });
    });
    //end
   socket.on('disconnect', () => {
    Group.destroy(socket.id);
    Player.onDisconnect(socket);
   });

   //chat
   socket.on('sendMsgToServer', msg => {
    var Name = ("" + socket.id).slice(2, 7);
    for(var i in Group.get_list('s')){
        Group.get_list('s')[i].emit('addToChat', Name + ': ' + msg);
    }
   });
   socket.on('evalServer', msg => {
       if(!DEBUG) { return; }
    var res = eval(data);
    socket.emit('evalAnswer', res);
   });
});



setInterval(() => {
    var pack = {
        player:Player.update(),
        bullet:Bullet.update()
    };
    // console.log(Group.get_list('i').player.hp);
    for(var i in Group.get_list('s')) {
        var socket = Group.get_list('s')[i];
        socket.emit('init', Group.get_list('i'));
        socket.emit('update', pack);
        socket.emit('remove', Group.get_list('tttt'));
    }
    Group.init();
},1000/25);

