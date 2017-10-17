//选项高亮增加样式 Highlight   中奖选项增加样式 Selected
//localStorage存储抽奖信息，关闭页面仍保留

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
		round: o.round,
		sum: o.sum, //基数
		speed: o.speed,//
		chance: o.chance,//抽奖机会数
	};
	this.chooseIndex = 3;//获奖位置，随机产生
	this.no = 1; //转动过程中位置
	Block.call(this);
	this.move = function() {
		this.setSpeed();
		let round = this.round;
		let timer = setInterval( () => {
			this.addStyle(this.no);//添加高亮
			this.clearStyle(this.no);//去除高亮
			if(this.no>8){
				this.no = 0;
				this.o.round += 1;
			}
			this.no++;
		},this.o.speed)
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
			this.chooseIndex = 2;//一等奖(1)
		}
		if(0<ran<3){
			this.chooseIndex = 4;//二等奖(2)
 		}
		if(2<ran<8){
			this.chooseIndex = 6;//三等奖(5)
		}
		if(7<ran<18){
			this.chooseIndex = 8;//四等奖(10)
		}
		console.log(ran);
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
	luckyDraw.getRandom();
}


