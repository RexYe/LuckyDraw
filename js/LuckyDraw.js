//选项高亮增加样式 Highlight   中奖选项增加样式 Selected
//localStorage存储抽奖信息，关闭页面仍保留
//禁止多次单击抽奖按钮.
function inherit(proto) {
	//proto是一个对象，但不能是null
	if(proto == null) throw TypeError();
	if(Object.create) return Object.create(proto); //如果Object.create()存在,使用它
	var t = typeof proto; //否则进一步检查
	if(t!=='object' && t!=='function') throw TypeError();
	var F = function() {}; // 定义一个空构造函数
	F.prototype = proto; // 将其原型属性设置为proto
	return new F(); // 使用F()创建proto的继承对象
}
//小方块组件
function Block() {
	this.text = "";//文字内容
}
function LuckyDraw(o) {
	this.o = {
		round: o.round,//圈数
		sum: o.sum, //总份数
		speed: o.speed,//初始速度
		chance: o.chance,//抽奖机会数
		index: o.index,//初始位置
	};
	this.flag = true;//结束转动标志
	this.chooseIndex = 3;//获奖位置编号，随机产生
	this.step = 0;//步数
	this.stepAll = 0;//总不步数
	this.no = 1; //转动过程中位置
	this.quickerIndex = 6; //加速位置
	this.slowerIndex = 7; //减速位置
	this.timer = null;//
	// Block.call(this);
	this.success = function(){}//成功后回调函数
	//高亮状态
	this.addStyle = function(no){
		$('.item'+no).addClass('Highlight');
	}
	//清除高亮状态
	this.clearStyle = function(no){
		if(no == 1){
			$('.item'+8).removeClass('Highlight');
		}
		else{
			$('.item'+(no-1)).removeClass('Highlight');
		}
	}
	//中奖选中状态
	this.chooseStyle = function(chooseIndex){
		$('.item'+chooseIndex).addClass('Selected');
	}
	//清除中奖选中状态
	this.clearChooseStyle = function(chooseIndex){
		$('.item'+chooseIndex).removeClass('Selected');
		$('.item'+chooseIndex).stop();
	}
	//抽奖期间样式变灰状态
	this.endStyle = function(){
		 $('.btn-begin').css("cursor","not-allowed")
	     $('.btn-begin').css("background-image","url(images/btn-begin-grey.png)")//抽奖按钮变灰
	}
	//随机算法，其概率根据输入的基数计算
	this.getRandom = function(){
		let ran = Math.floor(Math.random()*this.o.sum);
		if(ran<1){
			return this.chooseIndex = 2;//一等奖(1)
		}
		else if(ran>0 && ran<3){
			return this.chooseIndex = 4;//二等奖(2)
 		}
		else if(ran>2 && ran<8){
			return this.chooseIndex = 6;//三等奖(5)
		}
		else if(ran>7 && ran<18){
			return this.chooseIndex = 8;//四等奖(10)
		}
		else{
			//随机产生1 3 5 7
			let ran2 = Math.ceil(Math.random()*7);
			if(ran2%2 === 0){
				ran2 += 1;
			}
			if(ran2>7){
				ran2 -= 1;
			}
			let noprize = ran2;//位置1 3 5 7均为未中奖
			return this.chooseIndex = noprize;
		}
	}
	//抽奖过程动态效果
	this.move = function() {
		this.addStyle(this.no);//添加高亮
		this.clearStyle(this.no);//去除高亮
		this.step ++;//步数+1
		(this.step%8 == 0) ? this.no = 1 : this.no = this.step%8+1;
		// console.log(this.no);
		//在用户输入变快的地方变快
		if(this.step == this.quickerIndex){
			clearInterval(this.timer);
			this.o.speed /= 2;
			this.timer = setInterval(()=>{
				this.move();
			},this.o.speed)
		}
		if(this.stepAll-this.step == this.slowerIndex){
			clearInterval(this.timer);
			this.o.speed *= 2;
			this.timer = setInterval(()=>{
				this.move();
			},this.o.speed)
		}
		if(this.step == this.stepAll){
			this.step = 0;
			this.no = 1;
			clearInterval(this.timer);
			this.clearStyle(this.no);
			this.chooseStyle(this.chooseIndex);
			console.log($('.item'+this.chooseIndex).attr('title'));//中奖情况
			this.success.call(this,arguments)
			this.flag = true;
			$('.btn-begin').css("cursor","pointer");
			$('.btn-begin').css("background-image","url(images/btn-begin.png)");
		}
	}
	 /**
     *@function : 初始化函数
     **/
	this.init = function(){
		this.clearChooseStyle(this.chooseIndex);
		this.clearStyle(this.chooseIndex);
		this.getRandom();
		this.stepAll = this.chooseIndex+this.o.round*8; //计算总步数
		console.log('stepAll',this.stepAll);
		console.log('chooseIndex',this.chooseIndex);
		this.timer = setInterval( () => {
			this.move();
		},this.o.speed)
		this.o.sum -- ;
	}
	//开始抽奖
	this.begin = function(){
        if(this.o.chance < 1){
            console.log('抽奖机会已用完！');
            this.endStyle();
        }
        else{
        	if(this.flag == false){
				$('.btn-begin').live('click', function(event) {
				  	alert("抱歉,已停用！");
				   	event.preventDefault();
				});
				throw new Error;
	        }
	        if(this.flag == true){
	        	this.flag = false;
	        	luckyDraw.init();
	        	this.endStyle();
	        }
	        this.o.chance --;
        }
	}
	//外部调用函数
	this.run = function(){
		 $('.btn-begin').click(()=>{
       		 luckyDraw.begin();
   		 });
	}
}
inherit(LuckyDraw, Block);
