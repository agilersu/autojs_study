auto();
toastLog("脚本开始运行");

for (var i = 0; i < 5; i++) {
    MaintenanceAccount(i)
}




function MaintenanceAccount(i) {
    var time = random(4000, 15000);
    toastLog("第" + (i + 1) + "个视频，请等待" + time/1000+"秒");
    sleep(time);
    //开始滚动视频
    var x1 = random(device.width / 4, (device.width / 4) * 3);
    var y1 = random((device.height / 4) * 3.1, (device.height /4) * 3.3);
    var x2 = random(device.width / 4, (device.width / 4) * 3);
    var y2 = random((device.height / 4) * 0.7, (device.height /4) * 0.5);
    var s = random(35, 80);
    RandomSwipe(x1, y1, x2, y2, s);
}


//-----------------------曲线滑动-----------------------//
/**
 * 仿真随机带曲线滑动（视频/小说）
 * @param {起点x} qx
 * @param {起点y} qy
 * @param {终点x} zx
 * @param {终点y} zy
 * @param {过程耗时单位毫秒} time
 */
function RandomSwipe(qx, qy, zx, zy, time) {
    var xxy = [time];
    var point = [];
    var dx0 = {
        "x": qx,
        "y": qy
    };
    var dx1 = {
        "x": random(qx - (device.width / 4) * 0.25, qx + (device.width / 4) * 0.25),
        "y": random(qy, qy + 50)
    };
var dx2 = {
    "x": random(zx - (device.width / 4) * 0.25, zx + (device.width / 4) * 0.25),
    "y": random(zy, zy + 50)
};
var dx3 = {
    "x": zx,
    "y": zy
};
for (var i = 0; i < 4; i++) {
    eval("point.push(dx" + i + ")");
};
for (let i = 0; i < 1; i += 0.08) {
    xxyy = [parseInt(bezier_curves(point, i).x), parseInt(bezier_curves(point, i).y)]
    xxy.push(xxyy);
}
gesture.apply(null, xxy);
};
function bezier_curves(cp, t) {
    cx = 3.0 * (cp[1].x - cp[0].x);
    bx = 3.0 * (cp[2].x - cp[1].x) - cx;
    ax = cp[3].x - cp[0].x - cx - bx;
    cy = 3.0 * (cp[1].y - cp[0].y);
    by = 3.0 * (cp[2].y - cp[1].y) - cy;
    ay = cp[3].y - cp[0].y - cy - by;

    tSquared = t * t;
    tCubed = tSquared * t;
    result = {
        "x": 0,
        "y": 0
    };
    result.x = (ax * tCubed) + (bx * tSquared) + (cx * t) + cp[0].x;
    result.y = (ay * tCubed) + (by * tSquared) + (cy * t) + cp[0].y;
    return result;
};
//-----------------------曲线滑动-----------------------//


toastLog("脚本运行结束");



