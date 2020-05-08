module.exports = function() {
    var self = {
        x:250,
        y:250,
        speedX:0,
        speedY:0,
        id:'',
    };
    self.update = function() {
        self.updatePosition();
    };
    self.updatePosition = function() { 
        self.x += self.speedX;
        self.y += self.speedY;
    };
    self.getDistance = function(pt){
        return Math.sqrt(Math.pow(self.x-pt.x,2) + Math.pow(self.y-pt.y,2));
    };
    self.getInit = function() {
        return {
            id : self.id,
            x : self.x, 
            y : self.y
        };
    };
    self.getUpdate = function() {
        return {
            id : self.id,
            x : self.x, 
            y : self.y
        };
    };
    return self;
};
