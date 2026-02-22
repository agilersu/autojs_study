auto();
//-----------------------控件点击函数-----------------------//
/* 
这段代码是一个用于自动化UI操作的JavaScript函数，名为“控件点击”，旨在模拟在移动设备屏幕上随机点击找到的UI控件。函数接收三个参数：dshuxing（控件属性，如text或id）、dzhi（属性值）和dname（控件名称描述）。其核心逻辑是：首先，通过指定属性和值在屏幕可见区域内查找控件；如果找到控件，则计算其边界，并在边界内随机选取一个点（排除边框1像素以防止误点），然后模拟点击操作，附带随机延迟以增加真实性，并打印点击日志；如果未找到控件，则打印未找到日志。代码下方演示了两次调用：第一次通过文本“兼职”查找并点击，第二次通过ID“tv_big_icon”查找并点击，每次点击后都添加了延迟和返回操作。整体上，这段代码适用于自动化脚本场景，如移动应用测试或任务自动化。
 */

//控件点击
toastLog("开始执行控件点击函数");

function 控件点击(dshuxing, dzhi, dname) {
    var a = dshuxing(dzhi).boundsInside(0, 0, device.width, device.height).visibleToUser().findOnce();
    if (a != null) {
        var x1 = a.bounds().left;
        var x2 = a.bounds().right;
        var y1 = a.bounds().top;
        var y2 = a.bounds().bottom;
        var x = random(Math.floor(x1 + 1), Math.floor(x2 - 1));//删除控件四周1的边界，防止边框位置点击
        var y = random(Math.floor(y1 + 1), Math.floor(y2 - 1));
        var timedelay = random(50, 150);
        toastLog("点击 [" + dname + "]");
        press(x, y, timedelay);
        sleep(1000);
        return true;
    } else {
        toastLog("无法找到 [" + dname + "]");
        //其他内容
    }
}
控件点击(text, "领现金", "领现金")
sleep(1500)

back()

控件点击(text, "听歌", "听歌")
//控件点击(id, "tv_big_icon", "商铺写字楼")
sleep(1000)
back()

toastLog("完成控件点击函数");
