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
Block.prototype.showResult = function() {
	alert('prize');
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
	this.endMove = function(){
		clearInterval(timer);
	}
	this.setSpeed = function(no){
		if(no>8){
			this.o.speed = 100;
			// console.log(no)
		}
	}
	this.addStyle = function(no){
		$('.item'+no).addClass('Highlight');
	}
	this.clearStyle = function(no){
		if(no == 1){
			$('.item'+8).removeClass('Highlight');
		}
		else{
			$('.item'+(no-1)).removeClass('Highlight');
		}
	}
	this.chooseStyle = function(chooseIndex){
		$('.item'+chooseIndex).addClass('Selected');
	}
	this.clearChooseStyle = function(chooseIndex){
		$('.item'+chooseIndex).removeClass('Selected');
	}
	this.getRandom = function(){
		let ran = Math.floor(Math.random()*this.o.sum);
		if(ran<1){
			return this.chooseIndex = 2;//一等奖(1)
			alert(1)
		}
		if(ran>0 && ran<3){
			return this.chooseIndex = 4;//二等奖(2)
			alert(2)
 		}
		else if(ran>2 && ran<8){
			return this.chooseIndex = 6;//三等奖(5)
			alert(3)
		}
		else if(ran>7 && ran<18){
			return this.chooseIndex = 8;//四等奖(10)
			alert(4)
		}
		else{
			let ran2 = Math.ceil(Math.random()*7);
			if(ran2%2 === 0){
				ran2 += 1;
			}
			if(ran2>7){
				ran2 -= 1;
			}
			let noprize = ran2;
			return this.chooseIndex = noprize;
		}
	}
	this.move = function() {
		this.addStyle(this.no);//添加高亮
		this.clearStyle(this.no);//去除高亮
		this.step ++;//步数+1
		// if(this.step%8 == 0){
		// 	this.no = 1;
		// }
		(this.step%8 == 0) ? this.no = 1 : this.no = this.step%8+1;
		// else{
		// 	this.no = this.step%8+1;
		// }
		console.log(this.step)
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
			clearInterval(this.timer);
			this.clearStyle(this.no);
			this.chooseStyle(this.chooseIndex);
			console.log($('.item'+this.chooseIndex).attr('title'));
			this.flag = true;
			$('.btn-begin').css("cursor","pointer")
		}
	}
	 /**
     *@function : 初始化函数
     **/
	this.init = function(){
		this.flag = false;
		this.clearChooseStyle(this.chooseIndex);
		this.getRandom();
		this.stepAll = this.chooseIndex+this.o.round*8; //计算总步数
		console.log('stepAll',this.stepAll);
		console.log('chooseIndex',this.chooseIndex);
		this.timer = setInterval( () => {
			this.move();
		},this.o.speed)
	}
	//开始抽奖
	this.begin = function(){
        if(this.o.chance < 1){
            alert('抽奖机会已用完！');
        }
        else{
        	if(this.flag == false){
            	$('.btn-begin').css("cursor","pointer")
	        }
	        if(this.flag == true){
	        	luckyDraw.init();
	        	$('.btn-begin').css("cursor","wait")
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



