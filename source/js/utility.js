try{
	const gui = require('nw.gui');
    const win = gui.Window.get();
	let path = require('path');
	var execPath = path.dirname( process.execPath ) + '/';
	execPath.replace(/\\/g,"/");
	
}
catch(ReferenceError)
{
	console.log('This is browser!');
}

// 初始化設定
async function init_setting(){
	//$('#name').text(init['name']);
	//mypath = init['path']+init['name']+'.json';
	load_init()
	load_banner();
	
	try{
		const gui = require('nw.gui');
		const win = gui.Window.get();
		let height = 0;
		let width = 0;
		let w = 1580;
		let h = 960;
		let wx = 0;
		let hx = 0;
		
		await win.maximize();
		height = win.height;
		//height = window.outerHeight;
		width = win.width;
		if(height >= h && width >= w){
			wx = (width-w)/2;
			hx = (height-h)/2;
			await win.unmaximize();
			await win.resizeTo(w, h);
			await win.moveTo( parseInt(wx), parseInt(hx)-20);
		}
	}
	catch(ReferenceError)
	{
		console.log('This is browser!');
	}
}

// 讀取設定檔
function load_init(){
	create_folder(execPath + 'data/');
	$.getScript( execPath + 'data/setting.js', function (data, textStatus, jqxhr) {
		console.log("Load setting OK.");
	});
}

// 讀取menu
function load_banner(){
	$("#mybanner").load("banner.html", function () {
        console.log("Load banner OK.");
		$('#version').text('v'+version);
	});
}

// 初始化檔案
function initFile(){
	let fs = require('fs');
	console.log("file_path="+mypath);
	checkFileExist(mypath, init['name'], emptyData() );
}

//檢查檔案是否存在
function checkFileExist(path, name, data){
	let fs = require('fs');
	fs.exists(path, function (exists) {
	  if (!exists) {
		writeDataToJson(path, name, data);
		console.log('reset '+name+' data.');
		return 0;
	  }
	  return 1;
	});
}

//寫入檔案
function writeDataToJson(path, name, data, callback){
	let fs = require('fs');
	let obj;
	let value = 'let ' + name + ' = ' + JSON.stringify(data, null, 4) + ';';
	//let value = "list['" + name + "'] = " + JSON.stringify(data, null, 4) + ";";
	fs.writeFile(path, value, function(err) {
		if(err) {
		  console.log(err);
		  obj = {"status": 0, "message": "write data error"};
		  callback && callback( obj );
		} else {
		  console.log("JSON saved to " + path);
		  obj = {"status": 1, "message": "write data success"};
		  callback && callback( obj );
		}
	}); 
}

// 取得詳細日期
function getTime(){
	Date.prototype.format = function(format) {
	   let date = {
			  "M+": this.getMonth() + 1,
			  "d+": this.getDate(),
			  "h+": this.getHours(),
			  "m+": this.getMinutes(),
			  "s+": this.getSeconds(),
			  "q+": Math.floor((this.getMonth() + 3) / 3),
			  "S+": this.getMilliseconds()
	   };
	   if (/(y+)/i.test(format)) {
			  format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
	   }
	   for (let k in date) {
			  if (new RegExp("(" + k + ")").test(format)) {
					 format = format.replace(RegExp.$1, RegExp.$1.length == 1
							? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
			  }
	   }
	   return format;
	}
	let time = new Date().format('yyyy/MM/dd hh:mm:ss');
	return time;
}

// 取得日期
function getDate(){
	return getTime().split(' ')[0];
}

// 設定按鈕CSS
function check_and_add_error_css(name){
	let id = "#" + name;
	if( $(id).val() == ""){
		$(id).parent().addClass("has-error");
		$("#submit").addClass("btn-danger");
		return true;
	}else{
		return false;
	}
}

// 開資料夾
function create_folder(path){
	let fs = require('fs');
	chk_file( path , function(back){
		if( back == 0){
			fs.mkdirSync(path);
		}
	});
}


// sync 確認檔案是否存在及類型
async function chekc_file_sync(filepath){
	const fs = require('fs').promises;
	let stat = await fs.stat(filepath);
	if(stat.isDirectory()) {	// 資料夾存在
		return 2;
	} else if(stat.isFile()) {	// 文件存在
		return 1;
	} else {					// 路徑存在，但既不是文件，也不是資料夾
		console.log(stat);
		return 0
	}
}

// 確認檔案是否存在及類型
function chk_file(path, callback){
	let fs = require('fs');
	fs.stat(path, function(err, stat) {
		if(err == null) {
			if(stat.isDirectory()) {
				//console.log('資料夾存在');
				//return 2;
				callback && callback ( 2 );
			} else if(stat.isFile()) {
				//console.log('文件存在');
				//return 1;
				callback && callback ( 1 );
			} else {
				console.log('路徑存在，但既不是文件，也不是資料夾');
				//輸出路徑對象信息
				console.log(stat);
				//return 3
				callback && callback ( 3 );
			}
		} else if(err.code == 'ENOENT') {
			console.log(err.name);
			console.log('路徑不存在');
			//return 0;
			callback && callback ( 0 );
		} else {
			console.log('錯誤：' + err);
			//return 0;
			callback && callback ( 0 );
		}
	});
}

// 確認檔案是否存在及類型
function check_file(path, turn, callback){
	let fs = require('fs');
	fs.stat(path, function(err, stat) {
		if(err == null) {
			if(stat.isDirectory()) {
				callback && callback ( {'status':2, 'path':path, 'turn':turn} ); // 資料夾存在
			} else if(stat.isFile()) {
				callback && callback ( {'status':1, 'path':path, 'turn':turn} ); // 文件存在
			} else {
				console.log(stat);
				callback && callback ( {'status':3, 'path':path, 'turn':turn} ); // 路徑存在，但既不是文件，也不是資料夾
			}
		} else if(err.code == 'ENOENT') {
			console.log(err.name);
			callback && callback ( {'status':0, 'path':path, 'turn':turn} ); // 路徑不存在
		} else {
			console.log('錯誤：' + err);
			callback && callback ( {'status':0, 'path':path, 'turn':turn} );
		}
	});
}

/*
function del_file(path, turn, callback){
	let fs = require('fs');
	fs.unlink(path, function(){
		callback && callback ( {'status':1, 'path':path, 'turn':turn} );
	});
}
*/

// 10以下補0
function add_zero(number){
	if( number < 10){
		return "0"+number;
	}
	return number;
}

// 判斷是否undefined 是的話 回傳 空白
function remove_undefined(val){
	if(val == undefined){
		return '';
	}else{
		return val;
	}
}

// 判斷是否undefined 是的話 回傳 0
function undefined_to_zero(val){
	if(val == undefined){
		return 0;
	}else{
		return (val * 1);
	}
}

// 移除alert的css
function remove_alert(){
	$('#message').removeClass("alert-danger alert-success alert-info").text('');
}

// 儲存檔案
function save_file(path, data, data_name, button){
	writeDataToJson(path, data_name, data, function(result){
		console.log( result );
		if ( result['status'] == 0){
			$("#"+ button).addClass("btn-danger");
		}else{
			$("#"+ button).addClass("btn-success");
		}
	});
}

// 去除數字分位
function rmoney(s){   
   return parseFloat(s.replace(/[^\d\.-]/g, ""));   
}