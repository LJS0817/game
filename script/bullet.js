const Entity = require('./Entity.js');
const Player = require('./player.js');
const Group = require('./group.js');

module.exports = {
    Bullet: function(parent, angle) {
        var self = Entity();
        self.id = Math.random();
        self.parent = parent;
        self.speedX = Math.cos(angle/180*Math.PI) * 10;
        self.speedY = Math.sin(angle/180*Math.PI) * 10;
        
        self.time = 0;
        self.enable = true;
        var super_update = self.update;
        self.update = function() {
            if(self.time++ > 100) { self.enable = false; }
            super_update();

            for(var i in Player.list) {
                var p = Player.list[i];
                if(self.getDistance(p) < 32 && self.parent !== p.id){
                    p.hp -= 1;
                    
                    if(p.hp <= 0) {
                        p.hp = p.hpMax;
                        p.x = Math.random() * 500;
                        p.y = Math.random() * 500;

                        var shooter = Player.list[self.parent];
                        if(shooter)
                            shooter.score += 1;
                    }

                    self.enable = false;
                }
            }
        };

        list[self.id] = self;
        Group.add('b', self.getInit());
        return self;
    },
    update: function() {
        var pack = [];
        for(var i in list){
            var bullet = list[i];
            bullet.update();
            if(!bullet.enable)
            {
                delete list[i];
                Group.remove('b', bullet.id);
            }
            else
                pack.push(bullet.getUpdate());
        }
        return pack;
    },
    get_Init : function() {
        var bullets = [];
        for(var i in list)
            bullets.push(list[i].getInit());
        return bullets;
    }
};
var list = [];