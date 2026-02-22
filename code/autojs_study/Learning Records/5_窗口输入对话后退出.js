var sh = new Shell();
sh.setCallback({
onNewLine: function(line){
	//有新的一行输出时打印到控制台
	log(line);
}
})
while(true){
//循环输入命令
var cmd = dialogs.rawInput("请输入要执行的命令，输入exit退出");
if(cmd == "exit"){
	break;
}
//执行命令
sh.exec(cmd);
}
sh.exit();
