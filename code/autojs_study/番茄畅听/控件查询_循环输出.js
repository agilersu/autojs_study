"auto"; // 确保自动化服务权限已打开

// 确保操作的无障碍服务已开启
auto.waitFor();

// 定义函数，遍历当前所有可见的控件并输出信息
function dumpVisibleNodes() {
    // 使用 Auto.js 的 UI 检索方法
    //var nodes = find(); 
    //var nodes = classNameContains("ImageView").visibleToUser().find(); 
    // var nodes = classNameContains("andriod.view.ViewGroup").visibleToUser().find(); 

    //var nodes = descStartsWith("领取").visibleToUser().find();
    var nodes = descContains("领取成功").visibleToUser().find();

    if (nodes.empty()) {
        toastLog("未能获取当前界面的控件，请确认无障碍已开启");
        log("No visible nodes found, abort dumpVisibleNodes()");
        return;
    }

    toastLog("==== 开始遍历当前可见控件 ====" + "\n");
    toastLog("共有" + nodes.size() + "个符合条件的控件!" + "\n");

    nodes.forEach(function (node) {
        var id = node.id();
        var cls = node.className();
        var desc = node.desc();
        var text = node.text();
        var clickable = node.clickable();

        var info =
            " | class: " + (cls || "null") +
            " | id: " + (id || "null") +
            " | desc: " + (desc || "null") +
            " | text: " + (text || "null") +
            " | clickable: " + clickable + "\n";
        toastLog(info);
    });
    toastLog("==== 遍历结束 ====" + "\n");
}

// 主程序入口
toastLog("请切换到你想检查的界面，3 秒后开始抓取控件信息" + "\n");
sleep(3000);
dumpVisibleNodes();