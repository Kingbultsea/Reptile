let superagent = require('superagent');
let http = require("http");
const url  = require('url');
const util = require('util');


let page = 0;
let api = 'https://www.zhihu.com/api/v4/questions/29814297/answers';
let reg = /data-actualsrc=\"(.+?)\"/g;
let params = {
include:'data[*].is_normal,admin_closed_comment,reward_info,is_collapsed,annotation_action,annotation_detail,collapse_reason,is_sticky,collapsed_by,suggest_edit,comment_count,can_comment,content,editable_content,voteup_count,reshipment_settings,comment_permission,created_time,updated_time,review_info,relevant_info,question,excerpt,relationship.is_authorized,is_author,voting,is_thanked,is_nothelp;data[*].mark_infos[*].url;data[*].author.follower_count,badge[?(type=best_answerer)].topics',
limit:5,
offset:10,
sort_by:'default',
random:''
};//AQAAAHcpZCdIQwoAfi343MCoPw3Jcz2V
let head = {
'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
                    'Accept-Encoding': 'gzip, deflate',
                    'Accept-Language': 'zh-CN,zh;q=0.9',
                    'Referer': 'https://www.zhihu.com/question/29814297',
                    'Cookie': 'd_c0="AIBkFcoy1Q2PTvYU7iZ5GmI8tmFa4fuKsNY=|1530425801"; q_c1=ce9282a5c4d549a78885addd0f1c9900|1530425801000|1530425801000; _zap=274ee6ea-a419-4b80-b12c-62e859f4a68d; _xsrf=YTxyK3UalbhtwSOudnFn2DkeSl1Npyn5; l_n_c=1; n_c=1; tgw_l7_route=3072ae0b421aa02514eac064fb2d64b5; l_cap_id="ZTk4ZWRlN2RmMmVmNDNhMGFkM2YwYWUyYjExZDg5NjA=|1531323773|4bffd5793fb3994a10905619805c8d74725e5f94"; r_cap_id="NGM5YTk5ZGNmZjAyNGQzZWFhYjYxOWIyMmNhMTk0NWM=|1531323773|5db51f26ef8cb08880ee4e130932ff4266bd63df"; cap_id="Y2QxYzIzOWU4NzNiNGFlNWI0MmIwY2MyNDA2ZDkyNjM=|1531323773|8baf16811e56afff6320095fc99289ba62acb0e6"',
                    'Host': 'www.zhihu.com',
                    'Connection': 'keep-alive',
                    'Accept': 'application/json, text/plain, */*',
                    'authorization': 'oauth c3cef7c66a1843f8b3a9e6a1e3160e20',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
					'x-requested-with':'Fetch',
                    'x-udid': 'AIBkFcoy1Q2PTvYU7iZ5GmI8tmFa4fuKsNY='
					

};
let done = false;
let doneY = false;
let count = 0;
let rawIMG =[];
let promise = '';
let result = [];
let func = function(response,rej){
params.random = Math.random();
var superagent = require('superagent');
superagent
.get(api).set(head).send(params).end( (err,res)=>{
try{

if(res.body.data.length != 0){

console.log( res.body)
for(let i = 0;i<res.body.data.length;i++){
let strop = true;
while(strop){
let cont = reg.exec(res.body.data[i].content);
 if(  !cont ){strop = false;}else{ rawIMG.push(cont[1]); console.log(cont[1]); count++ }

             }                           
                                         }
page ++;
params.offset = page*5;
console.log(params.offset);
let newpromise = new Promise( func);
promise.then(()=>newpromise );
response('done');


                              }else{ 

promise.then(()=>{
console.log("  图片数量为:"+count);
console.log('现在将把重复的图片给去除...');

        rawIMG.forEach((item) => {
            result.indexOf(item) === -1 && result.push(item);
        });
        console.log('成功：数据去重之后的数据=>' + result.length + '条');
     doneY = true;
})

response('done');
                                   }

}
catch(e){
console.log('知乎拒绝请求,部分未加载成功');
rawIMG.forEach((item) => {
            result.indexOf(item) === -1 && result.push(item);
        });
    doneY = true;

}





} );
};
function start(num){
api = 'https://www.zhihu.com/api/v4/questions/'+num+'/answers';
params.Referer = 'https://www.zhihu.com/question/'+num;
console.log('开始执行 ');
rawIMG = []
result = [];
doneY=false;
page = 0;
params.offset = 20;
count = 0;
console.log(doneY);
promise = new Promise(func);
}


http.createServer(function(req,res){

    res.writeHead(200,{'Content-Type':'text/plain'})
    console.log(    url.parse(req.url,true).query.num      );
	
start(   url.parse(req.url,true).query.num   );

let it = setTimeout(()=>{
if(doneY){
res.write( JSON.stringify(result));
clearInterval(it);
res.end();
}

},1000)


}).listen(3000); 






