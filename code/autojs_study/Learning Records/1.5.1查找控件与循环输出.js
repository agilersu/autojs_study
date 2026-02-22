//查找控件方法：直接查找、层次分析、代码分析（text、desc、id、className）


//等待无障碍服务启动
auto.waitFor();
toastLog("控件检测开始...");

//根据类名查找节点
//遍历最外层节点下的所有子节点
var node1 = className("android.widget.FrameLayout").findOne();
//log(node1);
//根据包名查找抖音下节点，需要启动抖音
//var nodeList = node1.find(packageName("com.ss.android.ugc.aweme"));
//根据包名查找抖音下节点，需要启动抖音极速版
//var nodeList = node1.find(packageName("com.ss.android.ugc.aweme.lite"));

/* 

注意不能写成var nodeList = node1.find(getPackageName("抖音极速版"));
因为getPackageName() 返回的是包名字符串，比如 "com.ss.android.ugc.aweme.lite"，
而 node1.find() 期望的是一个 选择器对象（如 text() / desc() / id() / packageName() / className() 等），它不能直接用字符串来查。所以运行时会报类似：node1.find is not a function / pattern must be a UiSelector 之类的错误
 */


//var pkg = getPackageName("微信");  //无法获取微信包名，可以手动填写"com.tencent.mm"

//var pkg = getPackageName("抖音");
var pkg = getPackageName("抖音极速版");
var nodeList = node1.find(packageName(pkg));

//var nodeList = node1.find(packageName("com.tencent.mm"));

toastLog("节点总数：" + nodeList.size());
/*
二种循环模式  
    for (var i = 0; i < nodeList.size(); i++) {
        log("节点"+i+"："+nodeList.get(i).text());
    }

 */
nodeList.forEach((child, index) => {
    if (child.text()) {
        toastLog("节点" + index + "：" + child.text() + "：" + child.desc() + "：" + child.id());

        // log("节点" + index + "：" + child.text() + "：" + child.desc()  + "："+child.id());
    }

});


toastLog("找到控件后结束");
sleep(1500);    




//------------------------------------------------
//以此点开抖音我 中的作品，因为都是同一个id
id("com.ss.android.ugc.aweme:id/qde").find().forEach(child => {

    click(child.bounds().centerX(), child.bounds().centerY());

    sleep(6000)
    back()
    sleep(4500)
})

//----------------------------------------------




//查找微信通讯录控件
//等待无障碍服务启动
auto.waitFor();
toastLog("控件检测开始...");

//先通过 ID 获取控件，再打印其文本内容，并模拟点击操作。
var 控件对象 = id("com.tencent.mm:id/dux").find().get(1);
log(控件对象.text());
click(控件对象);  // 通常 click() 应传入控件对象本身，而非其文本




//逐一点开微信通讯录后，然后返回


id("com.tencent.mm:id/dux").find().forEach(child => {
    click(child.text())
    sleep(3000)
    back()
    sleep(1500)
})

/* 
这段代码是一个用于移动端（特别是微信应用内）的自动化操作脚本，其核心逻辑是按顺序自动点击一个列表或容器中的所有子项目，并在每次点击后执行固定的等待和返回操作。其执行流程如下：
定位与遍历：首先通过控件的资源ID（com.tencent.mm: id / dux）定位到一个父容器（例如一个列表或视图组），然后使用find()方法获取其所有子控件，并通过forEach方法对每一个子控件进行遍历。
自动化操作序列：针对每一个遍历到的子控件（child），执行以下固定操作：
click(child.text())：点击该子控件上显示的文本内容。
sleep(3000)：点击后等待3秒，这通常是为了等待新页面或内容加载完成。
back()：执行一次“返回”操作，通常是关闭当前页面，回到之前的父容器界面。
sleep(1500)：返回后再等待1.5秒，以确保界面稳定，准备进行下一次点击。
典型用途：这段脚本常用于自动化、批量处理微信内部的一些列表任务。例如，自动打开与每个微信联系人的聊天窗口、自动浏览公众号文章列表并返回，或是在一些测试场景中模拟用户遍历操作。其中精确的sleep时间设置是为了适配特定页面的加载速度。
 */



click(id("com.tencent.mm:id/dux").find().findOne(text("A")).text())
click(id("com.tencent.mm:id/dux").find().findOne(text("A")))
/* 
click(id("com.tencent.mm:id/dux").find().findOne(text("A")).text())
功能解析：代码尝试执行一个点击操作。首先，它通过资源ID com.tencent.mm: id / dux定位到微信应用中的一个父控件（如列表或容器）；然后，使用 find()获取该父控件的所有子控件，并通过 findOne(text("A"))在这些子控件中查找第一个文本内容为“A”的特定子控件；最后，通过.text()获取该子控件的文本，并传递给 click()函数以模拟点击。
潜在问题：代码存在一个常见错误。在自动化脚本中（如使用 Auto.js 等工具），click()函数通常需要接收一个控件对象作为参数，以直接操作该控件。而这里的.text()返回的是文本字符串（即“A”），而非控件引用，这可能导致点击失败或执行异常。正确的写法应为移除.text()，直接传递控件对象，例如click(id("com.tencent.mm:id/dux").find().findOne(text("A")))
 */


 auto.waitFor();
// 控件定位
while (!click("文件管理器"));
while(!longClick("文件管理器"));

scrollDown();
sleep(5000);
// toast("scrollDown成功");
toastLog("scrollDown成功");

scrollUp();
sleep(5000);
toast("scrollUp成功");
toast("testing")
log("scrollUp成功");



//微博中控件查找与点击
var 控件对象 = id('com.sina.weibo:id/rightButton').findOne();
var 控件 = 控件对象.findOne(id('com.sina.weibo:id/ivButton'));
click(控件.bounds().centerX(), 控件.bounds().centerY());

