auto.waitFor();
toastLog("控件检测开始...");

//var node = className("android.widget.LinearLayout")
var node = className("android.widget.ImageView")
    .descMatches(/评论.*按钮/)
    .findOne(5000);

if (!node) {
    toastLog("❌ 找不到目标控件：评论按钮");
    exit();
}

// 向上找 clickable 的父节点（最多找 6 层，避免死循环）
var clickNode = node;
for (var i = 0; i < 6 && clickNode && !clickNode.clickable(); i++) {
    clickNode = clickNode.parent();
}

toastLog("✅ 找到目标控件，开始尝试点击...");

if (clickNode && clickNode.clickable() && clickNode.click()) {
    toastLog("✅ 点击成功（使用可点击父控件）");
} else {
    // 兜底用坐标点原节点中心
    var b = node.bounds();
    click(b.centerX() + random(1,30), b.centerY() + random(10, 20));
    toastLog("⚠️ 使用坐标点击兜底完成");
}


//等待评论输入框出现并输入
//抖音极速版

click("善语结善缘，恶言伤人心");
setText("666666");
id("com.ss.android.ugc.aweme.lite:id/ccu").findOne().click();  //点击评论按钮
back();

toastLog("控件检测结束");


/*
//等待无障碍服务启动


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
/* 
var pkg = getPackageName("抖音");
var nodeList = node1.find(packageName(pkg));

//var nodeList = node1.find(packageName("com.tencent.mm"));

toastLog("节点总数：" + nodeList.size());
/*
二种循环模式  
    for (var i = 0; i < nodeList.size(); i++) {
        log("节点"+i+"："+nodeList.get(i).text());
    }

 */

/*    
nodeList.forEach((child, index) => {
    if (child.text()) {
        toastLog("节点" + index + "：" + child.text() + "：" + child.desc() + "：" + child.id());

        // log("节点" + index + "：" + child.text() + "：" + child.desc()  + "："+child.id());
    }

});

toastLog("找到控件后结束");
sleep(1500);

 */