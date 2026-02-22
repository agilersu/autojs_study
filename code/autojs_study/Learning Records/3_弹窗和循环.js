toast("my message");
// longClick(161, 812);
// press(161,812,1500);

//n整数型，毫秒
// sleep(3000)
// toast('123')

 var _toast_ = toast;

toast = function(message){
    _toast_(message);
    sleep(2000);
}



for(var i = 0; i < 5; i++){
    toast(i  + "<br>");
}


log("This is a log message");
