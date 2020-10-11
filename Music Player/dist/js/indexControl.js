(function(root){
    function Index(len){
        this.index = 0;
        this.len = len;
    }
    Index.prototype = {
        //取上一首歌的索引
        prev: function(){
            return this.get(-1);    //  切到上一首
        },

        //取下一首歌的索引
        next: function(){
            return this.get(1);     //  切到下一首
        },

        //取索引，参数为+1或-1
        get: function(val){
            this.index = (this.index + val + this.len) % this.len;
            return this.index;
        }
    }

    root.controlIndex = Index;  //把构造函数暴露出去，因为实例对象需要传参，所以不能暴露出去
})(window.player || (window.player = {}));