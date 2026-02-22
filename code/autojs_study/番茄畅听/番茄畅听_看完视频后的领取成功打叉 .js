auto();
log("开始测试  领取成功后打叉控件 ... "+"\n");

log("等待  领取成功按钮 ... " + "\n");
descMatches(/^领取成功.*/).waitFor();
// 使用descMatches来精确匹配
if (descMatches(/^领取成功.*/).exists()) {
    toastLog("检测到 领取成功 按钮"+"\n");
    let parent = descMatches(/^领取成功.*/).findOne();
    if (parent && parent.childCount() > 0) {
        toastLog("检测到 领取成功 按钮，有子控件，准备点击"+"\n");
        lu=parent.child(0).bounds();
        click(lu.centerX() + random(1, 10), lu.centerY() + random(0, 8));

        sleep(5000+random(11,5000));
        click(541-random(1,10),1174+random(1,15));  //点击 领取奖励 按钮


    } else {
        toastLog("检测到 领取成功 按钮，但没有子控件,将直接点击" + "\n");
        lu = parent.bounds();
        click(lu.centerX() + random(1, 10), lu.centerY() + random(0, 8));

        sleep(5000 + random(11, 5000));
        click(541 - random(1, 10), 1174 + random(1, 15));  //点击 领取奖励 按钮
    }
} else {
    toastLog("未检测到 领取成功 按钮，跳过点击" + "\n");
}