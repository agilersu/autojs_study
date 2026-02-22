
//自动点击获取授权，根据自己的手机自行修改
threads.start(function() {
    //在新线程执行的代码
    while(true) {
        if (text('立即开始').findOne()) {
            text('立即开始').findOne().click();
            break;
        }else
            sleep(3000);
    toast("线程已启动")
    };
} 
);


//请求截图权限
if(!requestScreenCapture()){
    toast("请求截图失败");
    exit();
}
var img = captureScreen();
images.saveImage(img, "/sdcard/1.png");

//images.requestScreenshot()

