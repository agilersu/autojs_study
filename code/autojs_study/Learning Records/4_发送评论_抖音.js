
auto();// 自动获取无障碍权限
toastLog("控件检测开始");

//等待评论输入框出现并输入
//抖音极速版
click("善语结善缘，恶言伤人心");
setText("666666");
id("com.ss.android.ugc.aweme.lite:id/ccu").findOne().click();  //点击评论按钮




/* 
//等待评论输入框出现并输入,如下偶尔成功
//抖音极速版
id("com.ss.android.ugc.aweme.lite:id/bnv").findOne.setText("1234566");
id("com.ss.android.ugc.aweme.lite:id/bnv").findOne().click();
click("善语结善缘，恶言伤人心");
text("善语结善缘，恶言伤人心").findOne().setText("1234566");
id("com.ss.android.ugc.aweme.lite:id/ccu").findOne().click();  //点击评论按钮 */