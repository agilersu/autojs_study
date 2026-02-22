auto();
toastLog("自动点赞开始...");

/* //获取当前页面所有点赞按钮的数量,因为系统会预先动态多加载所以findOne以后会找到页面外面的这个控件
var like = id("com.ss.android.ugc.aweme.lite:id/dk2").find();
toastLog("当前页面点赞按钮数量为：" + like.size());
for (var i = 0; i < like.length; i++) {
    like[i].click();
    toastLog("点赞控件信息：" + "---" + like[i].desc() + like[i].text() + "---" + like[i].bounds().centerX() + "," + like[i].bounds().centerY() + "---" +like[i].clickable());

    toastLog("暂停随机数" + random(11, 500));
    sleep(1000 + random(11, 500));
} */


//通过描述获取点赞按钮并点击,防止被判定为自动化操作，点击位置加随机偏移
var like=descStartsWith("未点赞").visibleToUser().findOne().bounds();
click(like.centerX() + random(1,30),like.centerY()+ random(10,25));



/* 
//获取所有可见的类LinearLayout控件
ids=className("android.widget.LinearLayout").visibleToUser().find();
for(var i=0;i<ids.length;i++){
    toastLog( ids[i].id()+"---"+ids[i].text()+"---"+ids[i].desc());
     toastLog("暂停随机数" + random(11, 500));
        sleep(100+random(11,500));
};
 */


//var like=id("com.ss.android.ugc.aweme.lite:id/dk2").find().size();
          
//toastLog("当前页面点赞按钮数量为：" + like);

toastLog("自动点赞结束！");






