auto();
toastLog("进入我的页面");
app.launchApp("哔哩哔哩");
sleep(5000);
waitForActivity("tv.danmaku.bili.MainActivityV2");
sleep(5000);
id("tab_text").className("android.widget.TextView").text("我的").findOne().parent().parent().click();
toastLog("进入我的页面");
sleep(10000);
while (true) {
    if (id("title").text("我的直播").exists()) {
        // text("我的直播").findOne().click();
        var a=id("title").text("我的直播").findOne().parent();
        click(a.bounds().centerX(), a.bounds().centerY());
        toastLog("进入我的直播页面");
        sleep(2000);
        break;
    }   
} 
