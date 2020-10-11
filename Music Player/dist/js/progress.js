(function(root){
    function Progress(){
        this.durTime = 0;
        this.frameId = null;
        this.startTime = 0;
        this.lastPercent = 0;
        this.init();
    }
    Progress.prototype = {
        init : function(){
            this.getDom();
        },
        getDom : function(){
            this.curTime = document.querySelector('.curTime');
            this.circle = document.querySelector('.circle');
            this.frontBg = document.querySelector('.frontBg');
            this.totalTime = document.querySelector('.totalTime');
        },
        renderAllTime : function(time){
            this.durTime = time;
            time = this.formaTime(time);

            this.totalTime.innerHTML = time;
        },
        formaTime : function(time){
            time = Math.floor(time);
            var m = Math.floor(time/60);
            var s = time%60;
            m = m < 10 ? '0' + m : m;
            s = s < 10 ? '0' + s : s;
            return m + ':' + s;
        },
        //移动进度条
        move : function(per){
            var This = this;
            cancelAnimationFrame(this.frameId);
            this.lastPercent = per === undefined ? this.lastPercent : per;
            this.startTime = new Date().getTime();
            function frame(){
                var curTime = new Date().getTime();
                var per = This.lastPercent + (curTime - This.startTime)/(This.durTime*1000);
                if(per <= 1){
                    This.update(per);
                }
                else{
                    cancelAnimationFrame(This.frameId);
                }
                This.frameId = requestAnimationFrame(frame);
            }
            frame();

        },
        //移动进度条
        update : function(per){
            //更新左边的时间
            var time = this.formaTime(per * this.durTime) ;    
            this.curTime.innerHTML = time;
            
            //更新进度条的位置
            this.frontBg.style.width = per * 100 + '%';

            //更新圆点的位置
            var l = per * this.circle.parentNode.offsetWidth;
            
            this.circle.style.transform = 'translateX(' + l + 'px)';

            
        },
        //暂停进度条
        stop : function(){
            cancelAnimationFrame(this.frameId);
            var stopTime = new Date().getTime();
            this.lastPercent += (stopTime - this.startTime)/(this.durTime*1000);
        },
    }

    function instanceProgress(){
        return new Progress();
    }
    
    function Drag(obj){
        this.obj = obj;
        this.startPointX = 0;
        this.startLeft = 0;
        this.percent = 0;
    }
    Drag.prototype = {
        init: function(){
            var This = this;
            this.obj.style.transform = 'translateX(0)';
            this.obj.addEventListener('touchstart', function(ev){
                This.startPointX = ev.changedTouches[0].pageX;
                This.startLeft = parseFloat(this.style.transform.split('(')[1]);

                This.start && This.start();
            });

            this.obj.addEventListener('touchmove', function(ev){
                This.disPointX = ev.changedTouches[0].pageX - This.startPointX;
                var l = This.startLeft + This.disPointX;

                if(l < 0){
                    l = 0;
                }else if(l > this.offsetParent.offsetWidth){
                    l = this.offsetParent.offsetWidth;
                }

                this.style.transform = 'translate('+ l +'px)'

                This.percent = l / this.offsetParent.offsetWidth;
                This.move && This.move(This.percent);
                
                ev.preventDefault();
            });

            this.obj.addEventListener('touchend', function(ev){
                This.end && This.end(This.percent);
            })
        }
        

    }
    function instanceDrag(obj){
        return new Drag(obj);
    }
    
    root.progress = {
        pro : instanceProgress,
        drag : instanceDrag,
    }


})(window.player || (window.player = {}))