const Entity = require('./Entity.js');
const Bullet = require('./bullet.js');
const Group = require('./group.js');

module.exports = {
     Player: function(id) {
        var self = Entity();
        self.id = id;
        self.number = "" + Math.floor(10 * Math.random());
        self.pressRight = false;
        self.pressLeft = false;
        self.pressUp = false;
        self.pressDown = false;
        self.pressAttack = false;
        self.mouseAngle = 0;
        self.speed = 10;
        self.hp = 10;
        self.hpMax = 10;
        self.score = 0;
    
        var super_update = self.update;
        self.update = function() {
            self.updateSpd();
            super_update();

            if(self.pressAttack) {
                // for(var i = -3; i < 3; i++){ //7방향
                //     self.shootBullet(i * 10 + self.mouseAngle);
                // }
                self.shootBullet(self.mouseAngle);
            }
        }

        self.shootBullet = function(angle) {
            var b = Bullet.Bullet(self.id, angle);
            b.x = self.x;
            b.y = self.y;
        };
    
        self.updateSpd = function() {
            if(self.pressRight) { self.speedX = self.speed; }
            else if(self.pressLeft) { self.speedX = -self.speed; }
            else { self.speedX = 0; }
            
            if(self.pressUp) { self.speedY = -self.speed; }
            else if(self.pressDown) { self.speedY = self.speed; }
            else { self.speedY = 0; }
        }

        self.getInit = function() {
            return {
                id : self.id,
                x : self.x, 
                y : self.y,
                number : self.number,
                hp : self.hp,
                hpMax : self.hpMax,
                score : self.score
            };
        };

        self.getUpdate = function(type) {
            return {
                id : self.id,
                x : self.x, 
                y : self.y,
                hp : self.hp,
                score : self.score
            };
        };

        list[id] = self;
        Group.add('p', self.getInit());
        return self;
    },
    onConnect: function(socket) {
        var player = this.Player(socket.id);
        socket.on('keyPress', data => {
            if(data.inputId === 'left') { player.pressLeft = data.state; }
            if(data.inputId === 'right') { player.pressRight = data.state; }
            if(data.inputId === 'up') { player.pressUp = data.state; }
            if(data.inputId === 'down') { player.pressDown = data.state; }
            if(data.inputId === 'attack') { player.pressAttack = data.state; }
            if(data.inputId === 'mouseAngle') { player.mouseAngle = data.state; }
        });

        socket.emit('init', {
            selfId:socket.id,
            player:this.get_Init(),
            buller:Bullet.get_Init()
        });
    },
    onDisconnect: function(socket) {
        delete list[socket.id];
        Group.remove('p', socket.id);
    },
    update: function() {
        var pack = [];
        for(var i in list){
            var player = list[i];
            player.update();
            pack.push(player.getUpdate());
        }
        return pack;
    },
    getList: function() {
        return list;
    },
    get_Init : function() {
        var players = [];
        for(var i in list)
            players.push(list[i].getInit());
        return players;
    }
    // list: []
};
var list = [];
exports.list = list;