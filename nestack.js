//requires math.js and lodash
code=nsc.value
ahead=[]
ip=0
stack1=[],stack2=[],cur=stack1,curstack=stack1,nest=[]
ret=[]
vars={}
ini=0
Array.prototype.pick=function(n){return this[this.length-n-1]}
seek=c=>(!ahead[ip]&&(ahead[ip]=ip+code.slice(ip).indexOf(c)),ahead[ip])
matching_brace=_=>{
	if(!ahead[start=ip]){
		for(;ip<code.length;){c=code[++ip];if(c==']')break;if(braces[c])ip=braces[c]()}ahead[start]=ip
	}return ahead[start]
}
braces={
	'"':x=>seek('"',++ip),
	"'":x=>ip+1,
	"[":matching_brace
}
put=s=>out.textContent+=s
getc=_=>ini<inp.value.length?inp.value.charCodeAt(ini++):-1
commands={
	"\0":x=>cur.push(cur.length),
	"\1":x=>(curstack=cur=curstack==stack1?stack2:stack1,nest=[]),
	"\2":x=>cur=cur.reverse(),
	"\3":x=>cur=[],
	"{":x=>(cur=cur[cur.length-1].pop?cur[x=cur.length-1]:[cur[x=cur.length-1]],nest.push(x)),
	"}":x=>{nest.length&&(nest.pop(),cur=curstack,nest.map(x=>cur=cur[x]))},
	"%":x=>cur.pop(),
	"$":x=>cur.push(cur.pick(0)),
	"^":x=>cur.push(cur.pick(1)),
	"\\":x=>[cur[cur.length-1],cur[cur.length-2]]=[cur[cur.length-2],cur[cur.length-1]],
	"@":x=>(cur.push(cur.pick(x=cur.pop())),cur.splice(x,1)),
	"ø":x=>cur.push(cur.pick(cur.pop())),
	"+":x=>cur.push(math.add(cur.pop(),cur.pop())),
	"-":x=>(a=cur.pop(),b=cur.pop(),cur.push(math.subtract(b,a))),
	"×":x=>cur.push(math.multiply(cur.pop(),cur.pop())),
	"÷":x=>(d=cur.pop(),n=cur.pop(),r=math.divide(n,d),cur.push(math.mod(n,d),r<0?Math.ceil(r):0|r)),
	"_":x=>cur.push(-cur.pop()),
	"R":x=>cur.push(0|Math.random()+.5),
	"«":x=>(s=cur.pop(),cur.push(cur.pop()<<s)),
	"»":x=>(s=cur.pop(),cur.push(cur.pop()>>>s)),
	"&":x=>cur.push(cur.pop()&cur.pop()),
	"|":x=>cur.push(cur.pop()^cur.pop()),
	"~":x=>cur.push(~cur.pop()),
	"¤":x=>Math.sign(cur.pop()),
	"<":x=>cur.push(-(cur.pop()>cur.pop())),
	">":x=>cur.push(-(cur.pop()<cur.pop())),
	"'":x=>cur.push(code.charCodeAt(++ip)),
	'"':x=>{cur.push([]);for(;code[++ip]!='"';)cur[cur.length-1].unshift(code.charCodeAt(ip))},
	".":x=>put(cur.pop()),
	",":x=>put(String.fromCharCode(cur.pop())),
	"`":x=>cur.push(getc()),
	":":x=>vars[cur.pop()]=cur.pop(),
	";":x=>cur.push(vars[cur.pop()]),
	"[":x=>(cur.push(ip),ip=matching_brace()),
	"]":x=>{n=ret.length-3;if(~n&&code[ret[n]]=='#'){if(cur.pop())ret.push(ret[n+1],ret[n+2]);else ret.pop(),ret.pop()}ip=ret.pop()},
	"!":x=>(ret.push(ip),ip=cur.pop()),
	"?":x=>(f=cur.pop(),t=cur.pop(),ret.push(ip),ip=cur.pop()?t:f),
	"#":x=>(ret.push(ip,cur.pick(1),cur.pop()),ip=cur.pop()),
	"=":x=>(op=cur.pop(),commands[code[++ip]]=x=>ret.push(ip),ip=op)
}
eval=_=>{
	c=code[ip]
	if(commands[c])commands[c]();
	else if(/\d/.test(c)){num=code.substring(ip).match(/\d+/)[0];cur.push(+num);ip+=num.length;return}
	else if(/\s/.test(c)){ip+=code.substring(ip).match(/\s+/)[0].length;return}
	else cur.push(c);ip++
	console.log(`Stack1: ${JSON.stringify(stack1)}
Stack2: ${JSON.stringify(stack2)}
Current Stack: ${JSON.stringify(cur)}
Nest Indices: ${nest}
Variables: ${JSON.stringify(vars)}
Return Stack: ${JSON.stringify(ret)}`)
}
init=_=>(ahead=[],ip=0,ret=[],stack1=[],curstack=stack1,cur=stack1,stack2=[],nest=[],vars={},ini=0,out.innerHTML="")
run=_=>{var code=nsc.value;ip>=code.length&&init();for(;ip<code.length;)eval()}
