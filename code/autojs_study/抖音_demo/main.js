
auto();
setScreenMetrics(1080, 1920);
// launchApp("抖音极速版"); 
launchApp("抖音"); 

customerSleep(getRandom(4)); 

swipe(500, 1700, 500,180, 500);
customerSleep(getRandom(4));

comment();

/* let i = 0 ;n 
while(i++ < 3){
    swipe(500, 1700, 500,180, 500);
    customerSleep(getRandom(4));
    if(getRandom(10) >5){
        comment();
    }
}
 */
/* 
swipe 函数通常用于模拟触摸设备上的滑动手势。
起始X坐标 (500): 滑动手势的起始点位于水平坐标500。
起始Y坐标 (1700): 滑动手势的起始点位于垂直坐标1700。
结束X坐标 (500): 滑动手势的结束点位于水平坐标500。这意味着水平坐标在滑动过程中保持不变。
结束Y坐标 (180): 滑动手势的结束点位于垂直坐标180。这表示垂直滑动从1700移动到180。
持续时间 (500): 滑动手势完成的时间为500毫秒。
 */







function comment(){
    click(1023,1390)
    let j = 0 ;
    while(j++ < 3    ){
        swipe(500, 1650, 500,1000, 500);
        customerSleep(getRandom(3));
    }
    click(500, 1860);
    id("d6o").className("android.widget.ImageView").descMatches(/^评论.*按钮$/).findOne().parent().click(); 
    // id("pt").findOne().setText("666666666");
    id("d4q").findOne().setText("666666666");  
    customerSleep(1);
    id("d4q").findOne().parent().click();      
    // id("q4").findOne().click();
    customerSleep(0.1);
    id("d84").findOne().parent().click();
    customerSleep(1.5);
    back();
}

/**
 * 休眠函数
 * @param {休眠秒数} time 
 */
function customerSleep(time){
    let t = time * 1000;
    sleep(t);
}

/**
 * 产生一个【2， max】之间的随机数
 * @param {最大值} max 
 */

function getRandom(max){
    let value=random()*max; 
    return value >2 ? value : 2;
}


 /* 在注释中，
 
 @param {最大值} max 
 
 是一种用于记录函 数参数的规范注释格式，通常用于生成文档或帮助开发者
 理解代码。具体来说：@param 指的是函数的一个参数。
{最大值} 是参数的描述或类型，通常它应该是参数的类型
（例如 {number}），但在这个注释中，它用中文描述了参
数的作用，即最大值。max 是参数的名称。


  return value >2 ? value : 2;

 这是一个三元操作符语句。它检查 value 是否大于 2。
   如果是，函数返回 value；如果不是，函数返回 2。
   即，返回值保证至少为 2。

   可以改写为
   if (value > 2) {
    return value;
} else {
    return 2;
}
   */  

