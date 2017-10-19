# LuckyDraw
面向对象，继承等思想实现九宫格抽奖


# 使用说明
##### 首先引入库相关的.css .js文件

```javascript
<link href="css/style.css" rel="stylesheet" />
<script src="https://lib.sinaapp.com/js/jquery/2.0.2/jquery-2.0.2.min.js"></script>
<script type="text/javascript" src="js/LuckyDraw.js"></script>
```
# 初始化
```javascript
var luckyDraw = new LuckyDraw({
    round:6,//圈数
    sum:1000, //总份数
    speed:270,//初始速度
    chance:3,//个人抽奖机会次数
    firstPrize:1,//一等奖个数,默认值为1
    secondPrize:2,//二等奖个数，默认值为2
    thirdPrize:5,//三等奖个数，默认值为5
    fourthPrize:10,//四等奖个数，默认值为10
    quickerIndex1:4,//第一次加速位置,若未输入则默认为4
    quickerIndex2:8,//第二次加速位置,若未输入则默认为8
    slowerIndex1:8,//第一次减速位置(倒数),若未输入则默认为8
    slowerIndex2:4,//第二次减速位置(倒数),若未输入则默认为4
});
```
# 调用方法
```javascript
$('body').append(LuckyDrawNode);//在需要此插件的地方插入LuckyDrawNode节点

luckyDraw.run();//调用run方法
```