auto();
toastLog("自动浏览开始...");

toastLog(device.width);  //设备屏幕分辨率宽度

toastLog(device.height);//设备屏幕分辨率高度

swipe(device.width / 2, device.height * 3 / 4, device.width / 2 - 60, device.height / 4 -100, 500);//向上滑动屏幕 

sleep(2000); //等待2秒


toastLog("自动浏览完成！");