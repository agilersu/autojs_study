// 知识点
// 1.弹出包含输入框的对话框
//         dialogs.rawInput(title[, prefill, callback]);
//         title {string} 对话框的标题。
//         prefill {string} 输入框的初始内容，可选，默认为空。
//         callback {Function} 回调函数，可选。当用户点击确定时被调用,一般用于ui模式。
// 2.启动APP
//   app.launchApp(appName);              appName {string} 应用名称
// 3.消息的显示
//   toast(message);       message {string} 要显示的信息
//   message的连接：字符串与变量之间：+   注意点：字符串要用双引号套起来，变量不用
// 4.条件判断语句
//   if(条件表达式) {
//    执行的语句;
//   };
// 5.延迟
//   sleep(n);   n {number} 毫秒数
// 6.运算符
//   求模运算符（求余运算）：%    例：7%4==3，8%4==0，9%4==1
//   等于：==
//   赋值运算符：=
//   小于等于：<=
//   ++:例如a=a+1相当于a++
// 7.声明（定义）变量：var
// 8.设置文本
//   setText([i, ]text)
//   i {number} 表示要输入的为第i + 1个输入框
//   text {string} 要输入的文本
// 9.点击
//   （1）findOne().click();
//   （2）var widget = id("xxx").findOne().bounds();
//        click(widget.centerX(), widget.centerY());
//   （3）click(x,y);
//   （4）click("text")    
// 10.for循环
//    又名计次循环语句，用于循环次数已知的情况
//    for(赋值语句;循环条件;循环变量的步幅) {
//        循环体;
//    };
// 11.产生随机数
// random(最小值,最大值)



auto(); //启动autojs无障碍服务
app.launchApp("抖音"); //启动抖音APP
sleep(5000); //等待5秒钟
toastLog("欢迎使用抖音"); //显示欢迎使用抖音的消息
sleep(500); //等待0. 5秒钟


log(random(1, 100)); //产生1-100的随机整数  
for (var i = 0; i < 5; i++) { //循环5次
    var num = random(1, 100); //产生1-100的随机整数
    toastLog("随机数是：" + num); //显示随机数   
    sleep(500); //等待0.5秒钟  
};

