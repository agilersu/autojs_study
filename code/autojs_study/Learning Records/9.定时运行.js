var 时间开始 = new Date().getTime();
var 运行时间 = 30   // 设置运行时间，单位：分钟

var 时间结束 = new Date().getTime();
var 时间间隔 = Math.floor((时间结束 - 时间开始) / 1000);   // 秒
if (时间间隔 >= 运行时间 * 60) {
    console.info("定时时间已到")
    sleep(1000)
    console.info("当前平台运行结束，即将开始下一个平台~~")
    toastLog("当前平台运行结束，即将开始下一个平台~~")
    exit()
    
}