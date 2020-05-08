var socket = io('http://localhost:8000');
var user = document.getElementById('connected');
var chatText = document.getElementById('chat-text');
var chatInput = document.getElementById('chat-input');
var chatForm = document.getElementById('chat-form');
var ctx = document.getElementById('ctx').getContext("2d");
ctx.font = '30px Arial';


var Img = {};
Img.player = new Image();
Img.player.src = '/client/Img/player.png';
Img.bullet = new Image();
Img.bullet.src = '/client/Img/bullet.png';
Img.map = new Image();
Img.map.src = '/client/Img/map.png';


var WIDTH = Img.map.width;
var HEIGHT = Img.map.height;

//sign
var sign_container = document.getElementById('sign-container');
var sign_name = document.getElementById('sign-username');
var sign_password = document.getElementById('sign-password');
var signUp = document.getElementById('sign-signUp');
var signIn = document.getElementById('sign-signIn');

var game_container = document.getElementById('game-container');

signIn.onclick = function() {
    socket.emit('signIn', { username: sign_name.value, password: sign_password.value });
}

signUp.onclick = function() {
    socket.emit('signUp', { username: sign_name.value, password: sign_password.value });
}

socket.on('signUp_Res', data => {
    if(data.success){
        alert('Sign Up sccessul');
    }
    else{
        alert('Sign Up unsccessul');
    }
})

socket.on('signIn_Res', data => {
    if(data.success){
        sign_container.style.display = 'none';
        game_container.style.display = 'inline-block';
    }
    else{
        alert('Sign in unsccessul');
    }
})

var Player = function(initPack){
    var self = {};
    self.id = initPack.id;
    self.number = initPack.number;
    self.x = initPack.x;
    self.y = initPack.y;
    self.hp = initPack.hp;
    self.hpMax = initPack.hpMax;
    self.score = initPack.score;

    self.draw = function(){
        var x = self.x - Player.list[selfId].x + WIDTH * 0.5;
        var y = self.y - Player.list[selfId].y + HEIGHT * 0.5;

        var hpBar = 50 * self.hp / self.hpMax;

        ctx.fillStyle = 'red';
        ctx.fillRect(x - Img.player.width * 0.1 + hpBar, y - Img.player.height * 0.25, hpBar, 4);

        var width = Img.player.width * 0.5;
        var height = Img.player.height * 0.5;

        ctx.drawImage(Img.player, 0, 0, Img.player.width, Img.player.height, x - width / 2, y - height / 2, width, height);

        // ctx.fillText(self.number, self.x, self.y);
        // ctx.fillText(self.score, self.x, self.y - 60);
    };

    Player.list[self.id] = self;
    return self;
};
Player.list = {};

var Bullet = function(initPack){
    var self = {};
    self.id = initPack.id;
    self.x = initPack.x;
    self.y = initPack.y;

    self.draw = function() {
        var width = Img.bullet.width * 0.01;
        var height = Img.bullet.height * 0.01;

        var x = self.x - Player.list[selfId].x + WIDTH * 0.5;
        var y = self.y - Player.list[selfId].y + HEIGHT * 0.5;

        ctx.drawImage(Img.bullet, 0, 0, Img.bullet.width, Img.bullet.height, x - width / 2, y - height / 2, width, height);

        // ctx.fillRect(self.x-5, self.y-5, 10, 10);
    }

    Bullet.list[self.id] = self;
    return self;
};
Bullet.list = {};

var selfId = null;

socket.on('init', (data) => {
    if(data.selfId) selfId = data.selfId;
    for(var i = 0; i < data.player.length; i++){
        new Player(data.player[i]);
    }
    for(var i in data.bullet) {
        new Bullet(data.bullet[i]);
    }
});

socket.on('update', (data) => {
    for(let i = 0; i < data.player.length; i++){
        let pack = data.player[i];
        let p = Player.list[pack.id];
        if(p){
            if(pack.x !== undefined)
                p.x = pack.x;
            if(pack.y !== undefined)
                p.y = pack.y;
            if(pack.hp !== undefined)
                p.hp = pack.hp;
            if(pack.score !== undefined)
                p.score = pack.score;
        }
    }
    for(var i = 0; i < data.bullet.length; i++){
        var pack = data.bullet[i];
        var b = Bullet.list[data.bullet[i].id];
        if(b){
            if(pack.x !== undefined)
                b.x = pack.x;
            if(pack.y !== undefined)
                b.y = pack.y;
        }
    }
});

socket.on('remove', (data) => {
    for(var i = 0; i < data.player.length; i++){
        delete Player.list[data.player[i]];
    }
    for(var i = 0; i < data.bullet.length; i++){
        delete Bullet.list[data.bullet[i]];
    }
})

setInterval(() => {
    if(!selfId) return;
    ctx.clearRect(0, 0, Img.map.width, Img.map.height);
    drawMap();
    drawScore();
    for(var i in Player.list){
        Player.list[i].draw();
    }
    for(var i in Bullet.list){
        Bullet.list[i].draw();
    }
}, 40)

var drawMap = function() {
    var x = WIDTH * 0.5 - Player.list[selfId].x;
    var y = HEIGHT * 0.5 - Player.list[selfId].y;
    ctx.drawImage(Img.map, x, y);
}

var drawScore = function() {
    ctx.fillStyle = 'white';
    ctx.fillText(Player.list[selfId].score, 0, 30);
}

socket.on('addToChat', data => {
    chatText.innerHTML += '<div>' + data + '</div>';
});

socket.on('evalAnswer', data => {
    console.log(data);
});

chatForm.onsubmit = function(e) {
    e.preventDefault();
    if(chatInput.value[0] === '/')
        socket.emit('evalServer', chatInput.valus.slice(1));
    else
        socket.emit('sendMsgToServer', chatInput.value);
    chatInput.value = '';
};

document.onkeydown = function(event) {
    if(event.keyCode === 68) { socket.emit('keyPress', {inputId:'right', state:true}); }
    if(event.keyCode === 65) { socket.emit('keyPress', {inputId:'left', state:true}); }
    if(event.keyCode === 83) { socket.emit('keyPress', {inputId:'down', state:true}); }
    if(event.keyCode === 87) { socket.emit('keyPress', {inputId:'up', state:true}); }
}

document.onkeyup = function(event) {
    if(event.keyCode === 68) { socket.emit('keyPress', {inputId:'right', state:false}); }
    if(event.keyCode === 65) { socket.emit('keyPress', {inputId:'left', state:false}); }
    if(event.keyCode === 83) { socket.emit('keyPress', {inputId:'down', state:false}); }
    if(event.keyCode === 87) { socket.emit('keyPress', {inputId:'up', state:false}); }
}

document.onmousedown = function(event) {
    socket.emit('keyPress', {inputId:'attack', state:true});
}

document.onmouseup = function(event) {
    socket.emit('keyPress', {inputId:'attack', state:false});
}

document.onmousemove = function(event) {
    var x = -250 + event.clientX - 8;
    var y = -250 + event.clientY - 8;
    var angle = Math.atan2(y, x) / Math.PI * 180;
    socket.emit('keyPress', {inputId:'mouseAngle', state:angle});
}