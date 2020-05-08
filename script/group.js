var SOCKET_LIST = [];
var ENTER_USERS = [];
var initPack = {player : [], bullet : []};
var removePack = {player : [], bullet : []};

module.exports = {
    init : function(type) {
        initPack.player = [];
        initPack.bullet = [];
        removePack.player = [];
        removePack.bullet = [];
    },
    add : function(type, self) {
        if(self !== undefined)
        {
            if(type === 'p'){
                initPack.player.push(self);
            }
            else if(type === 'b') {
                initPack.bullet.push(self);
            }
            else if(type === 's'){
                SOCKET_LIST[self.id] = self;
            }
            else if(type === 'e') {
                ENTER_USERS[self.name] = self.num;
            }
        }
    },
    remove : function(type, id) {
        if(id !== undefined)
        {
            if(type === 'p') { removePack.player.push(id); }
            else if(type === 'b') { removePack.bullet.push(id); }
        }
    },
    compare : function(source) {
        return ENTER_USERS[source] === undefined;
    },
    get_length : function() {
        return SOCKET_LIST.length;
    },
    get_list : function(type) {
        if(type === 's')
            return SOCKET_LIST;
        else if(type === 'e')
            return ENTER_USERS;
        else if(type === 'i')
            return initPack;
        return removePack;
    },
    destroy : function(id) {
        delete SOCKET_LIST[id];
        delete ENTER_USERS[id];
    }
};
