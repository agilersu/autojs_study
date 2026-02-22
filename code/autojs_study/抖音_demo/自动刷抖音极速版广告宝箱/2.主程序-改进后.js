// -------------------- 配置区 --------------------

// 定义广告基础播放时间（毫秒），这里是 40 秒                         //
var BASE_AD_TIME = 40000;                                               //

// 定义广告额外随机时间最小值（毫秒），这里是 1 秒                      //
var AD_TIME_RANDOM_MIN = 1000;                                          //

// 定义广告额外随机时间最大值（毫秒），这里是 5 秒                      //
var AD_TIME_RANDOM_MAX = 5000;                                          //

// 定义两轮 main 任务之间的基础间隔时间（毫秒），这里设为 21 分钟        //
var BASE_GAP_TIME = 21 * 60 * 1000;                                     //

// 定义两轮 main 任务之间的额外随机时间最小值（毫秒）                    //
var GAP_TIME_RANDOM_MIN = 1000;                                         //

// 定义两轮 main 任务之间的额外随机时间最大值（毫秒）                    //
var GAP_TIME_RANDOM_MAX = 5000;                                         //

// 定义等待控件出现的超时时间（毫秒），用于循环等待控件时的上限          //
var FIND_TIMEOUT = 15000;                                               //

// 定义在等待控件出现时，每次循环之间的休眠时间（毫秒）                  //
var FIND_INTERVAL = 500;                                                //

// 定义在提示“请打开任务界面”时的提示间隔时间（毫秒）                    //
var WAIT_TASK_UI_INTERVAL = 2000;                                       //

// -------------------- 工具函数 --------------------

// 生成一个当前这次播放广告应该等待的时间（毫秒）                       //
function getAdTime() {                                                  //
    // 计算当前广告等待时间 = 基础时间 + 随机增量                        //
    return BASE_AD_TIME + random(AD_TIME_RANDOM_MIN, AD_TIME_RANDOM_MAX); //
}                                                                       //

// 生成一次 main 周期任务的间隔时间（毫秒）                              //
function getGapTime() {                                                 //
    // 计算当前循环间隔 = 基础间隔 + 随机增量                            //
    return BASE_GAP_TIME + random(GAP_TIME_RANDOM_MIN, GAP_TIME_RANDOM_MAX); //
}                                                                       //

// 安全获取某个包含指定文本的控件（仅获取一个）                          //
// textStr: 要查找的文本内容                                             //
// timeout: 超时时间（毫秒），可选；不传则使用 FIND_TIMEOUT              //
function waitForText(textStr, timeout) {                                //
    // 如果没有传入 timeout，则使用默认超时时间                          //
    timeout = timeout || FIND_TIMEOUT;                                  //
    // 记录开始等待的时间                                                //
    var start = new Date().getTime();                                   //
    // 循环直到超时或者找到控件                                          //
    while (true) {                                                      //
        // 尝试查找包含指定文本的控件                                    //
        var obj = text(textStr).findOnce();                             //
        // 如果找到了控件                                                //
        if (obj) {                                                      //
            // 返回该控件对象                                            //
            return obj;                                                 //
        }                                                               //
        // 计算当前已经等待的时间                                        //
        var now = new Date().getTime();                                 //
        // 如果等待时间已超过超时时间                                    //
        if (now - start > timeout) {                                    //
            // 返回 null 表示未找到                                      //
            return null;                                                //
        }                                                               //
        // 未超时则休眠一小段时间后继续查找                              //
        sleep(FIND_INTERVAL);                                           //
    }                                                                   //
}                                                                       //

// 封装：点击某个 UI 对象的 bounds 中心，附带轻微随机偏移                 //
// obj: 需要点击的控件对象                                               //
function click_bounds(obj) {                                            //
    // 如果传入的控件对象为空                                            //
    if (!obj) {                                                         //
        // 打印日志说明空对象，方便调试                                  //
        log("click_bounds: 传入的控件对象为 null，跳过点击");           //
        // 直接返回不再继续                                              //
        return;                                                         //
    }                                                                   //
    // 获取控件的矩形区域 bounds                                         //
    var rect = obj.bounds();                                            //
    // 计算中心点 X 坐标并加上一点随机偏移                               //
    var x = rect.centerX() + random(0, 20);                             //
    // 计算中心点 Y 坐标并加上一点随机偏移                               //
    var y = rect.centerY() + random(0, 30);                             //
    // 执行点击操作                                                      //
    click(x, y);                                                        //
}                                                                       //

// 封装：安全点击某个文本按钮，如果在超时内找不到就返回 false            //
// textStr: 要点击的按钮文本                                             //
// timeout: 超时时间（毫秒），可选                                      //
function clickText(textStr, timeout) {                                  //
    // 调用 waitForText 等待对应文本的控件出现                           //
    var obj = waitForText(textStr, timeout);                            //
    // 如果找不到控件                                                    //
    if (!obj) {                                                         //
        // 打日志说明没有在规定时间内找到该文本                           //
        log("clickText: 在限定时间内未找到文本控件: " + textStr);       //
        // 返回 false 代表失败                                           //
        return false;                                                   //
    }                                                                   //
    // 找到控件后，调用 click_bounds 执行点击                             //
    click_bounds(obj);                                                  //
    // 返回 true 代表点击成功                                            //
    return true;                                                        //
}                                                                       //

// 封装：等待广告播放结束并尝试关闭广告                                  //
// adTimeMs: 广告等待时间（毫秒），不传则调用 getAdTime() 获取           //
function waitAndCloseAd(adTimeMs) {                                     //
    // 如果没有传入广告时长，则动态获取一个新的广告时长                  //
    adTimeMs = adTimeMs || getAdTime();                                 //
    // 打日志说明当前广告等待时长                                        //
    log("广告播放中，等待 " + adTimeMs + " 毫秒");                     //
    // 休眠指定时间，模拟观看广告                                        //
    sleep(adTimeMs);                                                    //
    // 调用 closeAd 尝试关闭广告                                         //
    closeAd();                                                          //
}                                                                       //

// 封装：通过返回键关闭广告界面                                         //
function closeAd() {                                                    //
    // 先判断当前界面是否存在描述为“返回”的控件                          //
    if (desc("返回").exists()) {                                        //
        // 如果有“返回”控件，则按两次返回键以确保退回主界面              //
        log("检测到 desc(\"返回\")，执行双重返回");                     //
        back();                                                         //
        sleep(1000 + random(100, 6000));                                                    //
        back();                                                         //
        sleep(1000 + random(1000, 8000));                                                    //
    } else {                                                            //
        // 如果没有“返回”控件，则按一次返回键                          //
        log("未检测到 desc(\"返回\"), 执行单次返回");                  //
        back();                                                         //
        sleep(1000);                                                    //
    }                                                                   //
}                                                                       //

// -------------------- 任务函数 --------------------

// 执行“去领取”任务，看一次广告并领取奖励                               //
function runTask() {                                                    //
    // 打印日志表示开始执行 runTask                                      //
    log("开始执行去领取任务");                                          //
    // 尝试点击“去领取”按钮，若失败直接返回                              //
    if (!clickText("去领取")) {                                         //
        // 日志提示，没有找到“去领取”，可能界面不对                      //
        log("runTask: 未找到“去领取”按钮，任务中止");                   //
        // 结束本次函数执行                                              //
        return;                                                         //
    }                                                                   //
    // 获取本次广告应等待的时长                                          //
    var adTimeMs = getAdTime();                                         //
    // 等待广告播放并尝试关闭                                            //
    waitAndCloseAd(adTimeMs);                                           //
    // 广告关闭后，如果界面出现“领取奖励”                               //
    if (text("领取奖励").exists()) {                                    //
        // 点击“领取奖励”按钮                                            //
        clickText("领取奖励", 5000);                                    //
        // 再次等待一轮广告（有些应用领奖励后还会再播一小段广告）         //
        waitAndCloseAd(adTimeMs);                                       //
    } else {                                                            //
        // 未出现“领取奖励”的日志提示                                    //
        log("runTask: 未出现“领取奖励”，可能已经自动发放");             //
    }                                                                   //
    // 日志表示 runTask 结束                                              //
    log("去领取任务执行完毕");                                          //
}                                                                       //

// 执行宝箱任务：开宝箱 -> 看广告 -> 领奖励                               //
function treasureBox() {                                                //
    // 打印日志表示开始执行宝箱任务                                      //
    log("开始执行宝箱任务");                                            //
    // 尝试点击“开宝箱得金币”，若失败则退出                              //
    if (!clickText("开宝箱得金币")) {                                   //
        // 日志提示未找到宝箱入口                                        //
        log("treasureBox: 未找到“开宝箱得金币”，任务中止");             //
        // 返回结束函数                                                  //
        return;                                                         //
    }                                                                   //
    // 稍微等待 3 秒让宝箱动画或新界面加载                                //
    sleep(3000);                                                        //
    // 尝试点击“看广告视频再赚”按钮                                     //
    if (!clickText("看广告视频再赚", 8000)) {                           //
        // 日志说明未找到“看广告视频再赚”，可能本轮已经看过               //
        log("treasureBox: 未找到“看广告视频再赚”，可能本轮不可用");      //
        // 返回结束函数                                                  //
        return;                                                         //
    }                                                                   //
    // 获取本次广告的等待时长                                            //
    var adTimeMs = getAdTime();                                         //
    // 等待广告播放并尝试关闭                                            //
    waitAndCloseAd(adTimeMs);                                           //
    // 广告关闭后，若出现“领取奖励”                                      //
    if (text("领取奖励").exists()) {                                    //
        // 点击“领取奖励”按钮                                            //
        //clickText("领取奖励", 5000); 
        clickText("去领取", 5000);                                         //
        // 再等待并关闭可能出现的后续广告                                 //
        waitAndCloseAd(adTimeMs);                                       //
    } else {                                                            //
        // 日志提示未出现“领取奖励”                                      //
        log("treasureBox: 未出现“领取奖励”，可能已自动发放");           //
    }                                                                   //
    // 日志表示宝箱任务执行完毕                                          //
    log("宝箱任务执行完毕");                                            //
}                                                                       //

// -------------------- 主流程函数 --------------------

// 主任务函数：先做“去领取”任务，再做宝箱任务                            //
function mainTask() {                                                   //
    // 打印日志，说明本轮任务开始                                        //
    log("======== 新一轮任务开始 ========");                            //
    // 当界面中没有“去领取”按钮时，提示用户前往任务界面                  //
    while (!text("去领取").exists()) {                                  //
        // 使用 toast 提示用户打开任务界面                               //
        toast("请打开任务界面，脚本正在等待");                           //
        // 打印日志方便查看                                               //
        log("等待任务界面出现“去领取”按钮");                             //
        // 休眠一段时间再检查，避免死循环占用过高资源                      //
        sleep(WAIT_TASK_UI_INTERVAL);                                   //
    }                                                                   //
    // 找到“去领取”后，先执行去领取任务                                  //
    runTask();                                                          //
    // 等待 5 秒再执行宝箱任务，给界面一些缓冲时间                        //
    sleep(5000 + random(100, 6000));                                                        //
    // 执行宝箱任务                                                       //
    treasureBox();                                                      //
    // 本轮任务结束日志                                                   //
    log("======== 本轮任务结束 ========");                               //
}                                                                       //

// -------------------- 脚本入口与循环 --------------------

// 脚本启动时先立即执行一次主任务                                       //
mainTask();                                                             //

// 使用 setInterval 按一定间隔循环执行 mainTask                         //
setInterval(function () {                                               //
    // 每次循环开始前，计算新的一轮间隔时间（更接近真实使用习惯）         //
    var gap = getGapTime();                                             //
    // 打印日志说明下一轮任务间隔时长                                    //
    log("下一轮任务将在 " + gap + " 毫秒后开始");                      //
    // 使用 sleep 阻塞当前线程模拟“间隔”                                 //
    sleep(gap);                                                         //
    // 间隔结束后再次执行任务                                            //
    mainTask();                                                         //
}, 1000); // 这里设为 1000ms 是因为我们在回调内自己控制了 gap 时间       //