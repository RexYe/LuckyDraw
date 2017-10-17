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
	this.flag = false;//结束转动标志
	this.chooseIndex = 3;//获奖位置编号，随机产生
	this.step = 0;//步数
	this.no = 1; //转动过程中位置
	// Block.call(this);
	this.success = function(){}//成功后回调函数
	this.move = function() {
		let timer = setInterval( () => {
			this.addStyle(this.no);//添加高亮
			this.clearStyle(this.no);//去除高亮
		},this.o.speed)
		this.step ++;//步数+1
		this.no = step%8;
	}
	this.endMove = function(){
		clearInterval(timer);
	}
	this.setSpeed = function(no){
		if(no>8){
			this.o.speed = 100;
			console.log(no)
		}
	}
	this.addStyle = function(no){
		$('.item'+no).addClass('Highlight');
	}
	this.clearStyle = function(no){
		$('.item'+(no-1)).removeClass('Highlight');
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
	 /**
     *@function : 抽奖类的初始化操作
     **/
	this.init = function(){
		this.getRandom();
		let timer = setInterval( () => {
			this.move();
		},this.o.speed)
	}

}
LuckyDraw.prototype.getResult = function() {
	alert(this.o)
};
inherit(LuckyDraw, Block);
var luckyDraw = new LuckyDraw({
	round:8,
	sum:1000,
	speed:300,//初始速度
});
console.log(luckyDraw)
//开始
function begin() {
	// luckyDraw.move();
	luckyDraw.init();
}


