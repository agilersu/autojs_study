//启动按键监听
auto();
toastLog("控件检测开始...");
//text('雾眠气泡水味').findOne();

/* 
var a = id('com.sina.weibo:id/ivButton').findOne().bounds();
click(a.centerX(),a.centerY()); 
sleep(1500);

 */


/* 
var p = id('com.sina.weibo:id/ivButton').findOne().parent();
log(p);

*/
/* 
var arr=id('com.sina.weibo:id/leftButton').findOne().children();
log(arr.length);

 */

/* 
//注意如下findOne()的用法是从整个界面查找,可以链式调用
var 控件对象 = id('com.sina.weibo:id/leftButton').findOne();
//注意如下findOne()的用法是从控件对象开始查找，不是从整个界面查找,可以查找子控件、孙控件等    
var 控件 = 控件对象.findOne(id('com.sina.weibo:id/tvButton'));
log(控件);

 */

/* 
var 控件对象 = id('com.sina.weibo:id/leftButton').findOne();
var 控件 = 控件对象.findOne(desc('喜欢'));
click(控件.bounds().centerX(), 控件.bounds().centerY());

 */

var 控件对象 = id('com.sina.weibo:id/rightButton').findOne();
var 控件 = 控件对象.findOne(id('com.sina.weibo:id/ivButton'));
click(控件.bounds().centerX(), 控件.bounds().centerY());



toastLog("找到控件");
sleep(1500);


/*
var node1=className("android.widget.FrameLayout").findOne();
//遍历最外层节点下的所有子节点
//log(nod1);

//根据包名查找抖音下节点，需要启动抖音
var nodeList=node1.find(packageName("com.ss.android.ugc.aweme"));
log(nodeList.size());

 */

//app.openAppSetting('com.tencent.mm');
//app.startActivity('console');
//app.startActivity('settings');
//app.openUrl('https://www.qq.com');


//app.openAppSetting(getPackageName('QQ'));显示为null
//var appname=getPackageName('抖音');   //显示为null
//toastLog(appname);
//等待微信设置界面加载完成
//id("d6o").className("android.widget.ImageView").descMatches(/^评论.*按钮$/).findOne().parent().click();

//id("f2k").className("android.widget.LinearLayout").descMatches(/^未点赞.*按钮$/).findOne().click();


