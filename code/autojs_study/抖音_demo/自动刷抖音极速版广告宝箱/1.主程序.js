
adTime = 40000 + random(1000, 5000)
gapTime = 60000 * 21 + random(1000, 5000)
 
function click_bounds(obj) {
  var point = obj.bounds()
  click(point.centerX() + random(0, 10), point.centerY() + random(0, 10))
}
 
function closeAd() {
  if (desc('返回').exists()) {
    back()
    sleep(1000)
    back()
    sleep(1000)
  } else {
    back()
    sleep(1000)
  }
}
 
function runTask() {
  click_bounds(text('去领取').findOnce())
  sleep(adTime)
  closeAd()
  if (text('领取奖励').exists()) {
    click_bounds(text('领取奖励').findOnce())
    sleep(adTime)
    closeAd()
  }
}
 
function treasureBox() {
  click_bounds(text('开宝箱得金币').findOnce())
  sleep(3000)
  click_bounds(text('看广告视频再赚').findOnce())
  sleep(adTime)
  closeAd()
  if (text('领取奖励').exists()) {
    click_bounds(text('领取奖励').findOnce())
    sleep(adTime)
    closeAd()
  }
}
 
function main() {
  while (!text('去领取').exists()) {
    toast('请打开任务界面')
  }
  runTask()
  sleep(5000)
  treasureBox()
}
 
main()
setInterval(main, adTime)
 