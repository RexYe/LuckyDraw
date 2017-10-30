//localStorage存储抽奖信息，关闭页面仍保留
//命名空间
var qlcomponents = qlcomponents || {};
//构造函数、属性
qlcomponents.LuckyDraw = function (opt_html) {
    this._model = {};
    this._element = opt_html || $(qlcomponents.LuckyDraw.Html);
    this._itemList = this._element.find('[gi~="itemList"]');

    this.o = {
        round: 6,//圈数
        sum: 1000, //总份数
        speed: 270,//初始速度
        chance: 3,//个人抽奖机会次数
        firstPrize: 1,//一等奖个数,默认值为1
        secondPrize: 2,//二等奖个数，默认值为2
        thirdPrize: 5,//三等奖个数，默认值为5
        fourthPrize: 10,//四等奖个数，默认值为10
        quickerIndex1: 4,//第一次加速位置,若未输入则默认为4
        quickerIndex2: 8,//第二次加速位置,若未输入则默认为8
        slowerIndex1: 8,//第一次减速位置(倒数),若未输入则默认为8
        slowerIndex2: 4,//第二次减速位置(倒数),若未输入则默认为4
    };
    // var storage = window.localStorage;
    // if(!window.localStorage){
    //  alert("浏览器不支持localStorage!");
    //  throw new Error;
    //  return false;
    // }
    // else{

    // }
    this.flag = true;//结束转动标志，true代表抽奖结束，false代表正在抽奖中
    this.chooseIndex = 0;//获奖位置编号，根据概率随机产生
    this.step = 0;//转动中的实时步数
    this.stepAll = 0;//全程总步数
    this.no = 1; //转动过程中的实时位置
    this.timer = null;//定时器
};
//方法
qlcomponents.getElement = function () {
    return this._element;
}
qlextent.extendClass(qlcomponents.getElement, {
    getElement: function () {
        return this._element;
    }
})
qlextent.inherit(qlcomponents.LuckyDraw,qlcomponents.getElement);
qlextent.extendClass(qlcomponents.LuckyDraw, {
    updateUiByModel: function () {
        for (var i = 0; i < this._model.getData().length; i++) {
            var item = new qlcomponents.LuckyDrawItem();
            item.setText(this._model.getData()[i].getSrc());
            item.setSelect(this._model.getData()[i].getIsSelect());
            item.setClass(this._model.getData()[i].getClass());
            this._itemList.append(item.getElement());
        }
        var start = $('<div class="btn-begin">开始抽奖</div>');
        this._itemList.append(start);
    },
    setDataAndUpdate: function (model) {
        this._model = model;
        this.updateUiByModel();
    },

    /**
     *@function : 抽奖完成后回调函数
     **/
    finshCallBack: function (e) {
        console.log(e);
    },
    /**
     *@function : 增加高亮css状态
     **/
    addStyle: function (no) {
        $('.item'+no).addClass('Highlight');
    },
    /**
     *@function : 清除高亮css状态
     **/
    clearStyle: function (no) {
        if(no == 1){
            //一个循环结束后将第8个高亮状态消除
            $('.item'+8).removeClass('Highlight');
        }
        else{
            //清除高亮总是比增加高亮慢一步
            $('.item'+(no-1)).removeClass('Highlight');
        }
    },
    /**
     *@function : 中奖选中时css状态
     **/
    chooseStyle: function (chooseIndex) {
        $('.item'+chooseIndex).addClass('Selected');
    },
    /**
     *@function : 清除中奖选中css状态
     **/
    clearChooseStyle: function (chooseIndex) {
        $('.item'+chooseIndex).removeClass('Selected');
        $('.item'+chooseIndex).stop();//停止动画效果
    },
    /**
     *@function : 抽奖期间样式变灰css状态
     **/
    endStyle: function () {
        $('.btn-begin').css("cursor","not-allowed");//鼠标指针变为禁止状态
        $('.btn-begin').css("background-image","url(images/btn-begin-grey.png)")//抽奖按钮变灰
    },
    /**
     *@function : 抽奖结束后样式复原函数
     **/
    removeEndStyle: function () {
        $('.btn-begin').css("cursor","pointer");
        $('.btn-begin').css("background-image","url(images/btn-begin.png)");
    },
    /**
     *@function : 随机算法，其概率根据输入的总抽奖份数计算
     **/
    getRandom: function () {
        let ran = Math.floor(Math.random() * this.o.sum);
        let q1 = this.o.firstPrize;
        let q2 = this.o.secondPrize;
        let q3 = this.o.thirdPrize;
        let q4 = this.o.fourthPrize;
        if (ran < q1) {
            return this.chooseIndex = 2;//一等奖位置
        }
        else if (ran > q1-1 && ran < q1+q2) {
            return this.chooseIndex = 4;//二等奖位置
        }
        else if (ran > q1+q2-1 && ran < q1+q2+q3) {
            return this.chooseIndex = 6;//三等奖位置
        }
        else if (ran > q1+q2+q3-1 && ran < q1+q2+q3+q4) {
            return this.chooseIndex = 8;//四等奖位置
        }
        else {
            //若未中奖，则随机产生1 3 5 7位置
            let ran2 = Math.ceil(Math.random() * 7);
            if (ran2%2 === 0) {
                ran2 += 1;
            }
            if (ran2 > 7) {
                ran2 -= 1;
            }
            let noprize = ran2;//位置1 3 5 7均为谢谢参与
            return this.chooseIndex = noprize;
        }
    },
    /**
     *@function : 抽奖过程动态效果执行函数
     **/
    move: function () {
        this.addStyle(this.no);//添加高亮
        this.clearStyle(this.no);//去除高亮
        this.step ++;//步数递增
        (this.step%8 == 0) ? this.no = 1 : this.no = this.step%8+1;//8步一个循环，控制no值
        //在用户输入的第一次加速的地方变快
        if (this.step == this.o.quickerIndex1) {
            clearInterval(this.timer);
            this.o.speed /= 2;//变快2倍
            this.timer = setInterval(()=>{
                this.move();
            },this.o.speed)
        }
        //在用户输入的第二次加速的地方变快
        if (this.step == this.o.quickerIndex2) {
            clearInterval(this.timer);
            this.o.speed /= 3;//变快3倍
            this.timer = setInterval(()=>{
                this.move();
            },this.o.speed)
        }
        //在用户输入的第一次减速的地方变慢
        if (this.stepAll-this.step == this.o.slowerIndex1) {
            clearInterval(this.timer);
            this.o.speed *= 2;//变慢2倍
            this.timer = setInterval(()=>{
                this.move();
            },this.o.speed)
        }
        //在用户输入的第二次减速的地方变慢
        if (this.stepAll-this.step == this.o.slowerIndex2) {
            clearInterval(this.timer);
            this.o.speed *= 3;//变慢3倍
            this.timer = setInterval(()=>{
                this.move();
            },this.o.speed)
        }
        //当实时步数与总步数相等时，为中奖位置
        if (this.step == this.stepAll) {
            var div=$(".item"+this.chooseIndex).find("img");
            for (let i=0 ; i<2 ; i++) {
                div.animate({opacity:'0.8',width:'310px',height:'260px'},"slow");
                div.animate({opacity:'1'},"slow");
            }
            div.animate({opacity:'0.7',width:'277px',height:'234px'},"slow");
            clearInterval(this.timer);//清除定时器
            //若某项中奖后，该项的次数须减一
            if (this.chooseIndex == 2) {
                this.o.firstPrize --;
            }
            if (this.chooseIndex == 4) {
                this.o.secondPrize --;
            }
            if (this.chooseIndex == 6) {
                this.o.thirdPrize --;
            }
            if (this.chooseIndex == 8) {
                this.o.fourthPrize --;
            }
            this.clearStyle(this.no);//高亮状态清除
            qlcomponents.LuckyDrawItem.setSelect(true);
            this._model.setData()
            // this.chooseStyle(this.chooseIndex);//并且该项增加选中状态
            this.step = 0;//一次抽奖完成后，实时步数清零
            this.no = 1;//默认从固定位置开始转动
            let prizeContent = $('.item'+this.chooseIndex).attr('title');
            this.finshCallBack.call(this,prizeContent)//将获奖情况传出到回调函数中
            this.flag = true;//并且此时改为可继续抽奖状态
            this.removeEndStyle();//样式复原为可抽奖状态
        }
    },
     /**
     *@function : 初始化函数
     **/
    init: function () {
        this.clearChooseStyle(this.chooseIndex);
        this.clearStyle(this.chooseIndex+1);
        this.clearStyle(this.chooseIndex);
        this.getRandom();
        this.stepAll = this.chooseIndex+this.o.round*8; //计算总步数
        this.timer = setInterval( () => {
            this.move();
        },this.o.speed)
        this.o.sum -- ;
    },
    /**
     *@function : 开始抽奖函数
     **/
    begin: function () {
        if (this.o.chance < 1) {
            alert('抽奖机会已用完！');
            this.endStyle();
        }
        else {
            //禁止多次单击抽奖按钮
            if (this.flag == false) {
                $('.btn-begin').live('click', function (event) {
                    alert("抱歉,已停用！");
                    event.preventDefault();
                });
                throw new Error;
            }
            if (this.flag == true) {
                this.flag = false;
                this.init();
                this.endStyle();
            }
            this.o.chance --;
        }
    },
    /**
     *@function : 暴露给外部调用的函数
     **/
    run: function () {
         $('.btn-begin').click( () => {
            this.begin();
            var div=$(".btn-begin");
            for (let i=0 ; i<this.o.round ; i++) {
                div.animate({opacity:'0.7'},"slow");
                div.animate({opacity:'1'},"slow");
            }
        })
    }
})

//生产dom节点
qlcomponents.LuckyDraw.Html = '<div class="wrap-bg">'+
                                    '<div class="wrap" gi="itemList">' +
                                    '</div>'+
                        	   '</div>';
//单个格子
qlcomponents.LuckyDrawItem = function (opt_html) {
    this._element = opt_html || $(qlcomponents.LuckyDrawItem.Html);
    this._imgComent = this._element.find('[gi~="imgComent"]');
}
qlextent.inherit(qlcomponents.LuckyDrawItem,qlcomponents.getElement);
qlextent.extendClass(qlcomponents.LuckyDrawItem, {
    //设置是否选中
    setSelect: function (flg) {
        if (flg) {
            this._imgComent.addClass("Selected");
        }
        else {
            this._imgComent.removeClass("Selected");
        }
    },
    setText: function (src) {
        this._imgComent.attr('src',src);
    },
    setClass: function (className) {
        this._element.addClass(className);
    }
})
qlcomponents.LuckyDrawItem.Html = '<div><img gi="imgComent" ></div>';


qlcomponents.data = qlcomponents.data || {};
qlcomponents.data.LuckyDrawModel = function () {
    this._data = [];
}
qlextent.inherit(qlcomponents.data.LuckyDrawModel,qlcomponents.getElement);
//保证封装性
qlextent.extendClass(qlcomponents.data.LuckyDrawModel, {
    getData: function () {
        return this._data;
    },
    setData: function (data) {
        this._data = data;
    }
})
//模型
qlcomponents.data.LuckyDrawItemModel = function () {
    this._src = "";
    this._isSelect = false;
    this._class = "";
}
qlextent.extendClass(qlcomponents.data.LuckyDrawItemModel, {
    getSrc: function () {
        return this._src;
    },
    setSrc: function (src) {
        this._src = src;
    },
    getIsSelect: function () {
        return this._isSelect;
    },
    setIsSelect: function (isSelect) {
        this._isSelect = isSelect;
    },
    getClass: function () {
        return this._class;
    },
    setClass: function (className) {
        this._class = className;
    }
})
