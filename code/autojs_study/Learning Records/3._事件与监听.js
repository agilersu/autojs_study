auto();// 自动获取无障碍权限
//启动按键监听
toastLog("启动按键监听...");
events.observeKey();


//注册一个按键监听函数，音量加按键
events.onKeyDown("volume_up", function (event) {
    toastLog("你按下了音量加键");
    exit();
});

threads.start(function () {
    //在子线程中执行一个循环，每隔1秒输出一次日志
    while (true) {
        //死循环，保持脚本运行
        sleep(1000);
        toastLog("脚本正在运行中...");
    }
});


toastLog("脚本运行完成...");