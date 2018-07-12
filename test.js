let superagent = require('superagent');
let http = require("http");
const url  = require('url');
const util = require('util');
let imgCollect = [];
let doneY = false;
var fs = require('fs');

function superagentGo(initNumber){
    imgCollect = [];
	let offset = 0;
	let page = 0;
	let reg = /img\s+src\s*=\s*\"(.+?)\"/g;
	
	/*superagent.get(all).end((err,response)=>{
		let length = JSON.parse(response.text).paging.totals;
	});*/
	
	
	function go(resolve,reject){
		let all = 'https://www.zhihu.com/api/v4/questions/'+initNumber+'/answers?include=data%5B%2A%5D.is_normal%2Cadmin_closed_comment%2Creward_info%2Cis_collapsed%2Cannotation_action%2Cannotation_detail%2Ccollapse_reason%2Cis_sticky%2Ccollapsed_by%2Csuggest_edit%2Ccomment_count%2Ccan_comment%2Ccontent%2Ceditable_content%2Cvoteup_count%2Creshipment_settings%2Ccomment_permission%2Ccreated_time%2Cupdated_time%2Creview_info%2Crelevant_info%2Cquestion%2Cexcerpt%2Crelationship.is_authorized%2Cis_author%2Cvoting%2Cis_thanked%2Cis_nothelp%3Bdata%5B%2A%5D.mark_infos%5B%2A%5D.url%3Bdata%5B%2A%5D.author.follower_count%2Cbadge%5B%3F%28type%3Dbest_answerer%29%5D.topics&limit=10&offset='
	+offset+'&sort_by=default';
		
		//console.log(all);
		//console.log(offset);
		superagent.get(all).end((err,response)=>{
			//console.log(JSON.parse(response.text).data)
			
		if('content' in (JSON.parse(response.text).data[0] ||[{}])  ){
		    for(let i in JSON.parse(response.text).data){
			
                let cont = reg.exec(response.body.data[i].content);
                if(  !cont ){strop = false;}else{  let exec = /data:image/;  if( !exec.test(cont) ){    imgCollect.push(cont[1]); console.log(cont[1]);}    }
            
		    }
		
		
			page++;
			offset = page *10;
			prom.then( ()=>{
				console.log('嗯运行了'+offset);
				prom = new Promise(go);
			});
			resolve();
		}else{
			prom.then( ()=>{
				doneY = true;
				console.log('完毕');
				
			});
			
			resolve();
		}
		
	    });
	}
    let prom = new Promise(go);
};

http.createServer(function(req,res){
    console.log('直接打开index.html文件 因为防盗链的问题 需要手动设置谷歌浏览器跨域 ')
	
	
    
	
	if(url.parse(req.url,true).query.num){
		res.writeHead(200,{'Content-Type':'text/plain'});
		
	
	doneY = false;
    console.log(    url.parse(req.url,true).query.num      );
	
superagentGo(   url.parse(req.url,true).query.num   );

let it = setInterval(()=>{
if(doneY){
res.write( JSON.stringify(imgCollect));
console.log('发送');
clearInterval(it);
res.end();
}

},1000)    

}else{
	var data = fs.readFileSync('index.html');
	res.writeHead(404, {'Content-Type': 'text/html'});
	res.write( data.toString());
//console.log("同步读取: " + data.toString());
}


}).listen(3000); 

