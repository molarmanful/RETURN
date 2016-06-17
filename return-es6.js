//requires math.js

//initial vars+functions
ahead=[]
ip=0
stack1=[],stack2=[],cur=stack1,curstack=stack1,nest=[]
ret=[]
vars={}
ini=0
c=''
Array.prototype.pick=function(n){return this[this.length-n-1]}
Array.prototype.chunk=function(r){var t,n=[],e=0;for(t=this.length/r;t>e;)n[e]=this.splice(0,r),e++;return n}
//lookahead stuff
seek=c=>(!ahead[ip]&&(ahead[ip]=ip+code.slice(ip).indexOf(c)),ahead[ip])
matching_brace=_=>{
	var start=ip
	if(!ahead[start]){
		while(ip<code.length){
			c=code[++ip]
			if(c==']')break;
			if(braces[c])ip=braces[c]();
		}
		ahead[start]=ip
	}
	return ahead[start]
}
braces={
	'"':x=>seek('"',++ip),
	"'":x=>ip+1,
	"[":matching_brace
}
put=s=>out.textContent+=s

//functions
commands={
	"\x00":cu=>(x=cu.pop(),cu.push(cu.slice(0).reverse().reduce((a,b,c)=>(b==x&&a.push(c),a),[]))),
	"\x01":cu=>(curstack=cu=curstack==stack1?stack2:stack1,nest=[]),
	"\x02":cu=>cu.push(cu.slice(cu.length-cu.pop()-1)),
	"\x03":cu=>cu.reverse(),
	"\x04":cu=>(a=cu.slice(0),cu.splice(0,cu.length),cu.push(...math.transpose(a))),
	"\x05":cu=>(a=cu.slice(0),cu.splice(0,cu.length),cu.push(...math.flatten(a))),
	"\x06":cu=>(a=cu.slice(0),cu.splice(0,cu.length),cu.push(...math.sort(a))),
	"\x07":cu=>cu.push(cu.length),
	"\b":cu=>(x=cu.pop(),cu.push(((y=cu.pop()).pop?y:[y]).concat(x))),
	"\t":cu=>(a=cu.slice(0),cu.splice(0,cu.length),cu.push(a.chunk(a.pop()))),
	"\n":cu=>(a=cu.pop(),b=cu.pop(),cu.push(math.range(Math.min(a,b),Math.max(a,b))._data)),
	"\v":cu=>(a=[],[...Array(cu.pop())].map(x=>a=[...a,...cu]),cu.splice(0,cu.length),cu.push(...a)),
	"\f":cu=>(curstack==stack1?stack2:stack1).push(cu.pop()),
	"\x0e":cu=>cu.push((curstack==stack1?stack2:stack1).pop()),
	"{":cu=>(cur=cu[cu.length-1].pop?cu[x=cu.length-1]:(cu[cu.length-1]=[cu[x=cu.length-1]]),nest.push(x)),
	"}":cu=>{nest.length&&(nest.pop(),cur=curstack,nest.map(x=>cur=cur[x]))},
	"%":cu=>cu.pop(),
	"$":cu=>cu.push(cu.pick(0)),
	"\\":cu=>[cu[cu.length-1],cu[cu.length-2]]=[cu[cu.length-2],cu[cu.length-1]],
	"¦":cu=>cu.push(cu.pop().toString().split``.map(x=>+x)),
	"§":cu=>cu.push(+cu.pop().join``),
	"¨":cu=>(x=cu.pop(),cu.push(String.fromCodePoint(...cu.pop()).split(String.fromCodePoint(...x.pop?x:[x])).map(a=>[...a].map(b=>b.codePointAt())))),
	"°":cu=>(a=cu.pop(),b=cu.slice(0),cu.splice(0,cu.length),cu.push(...[...b.map(x=>String.fromCodePoint(...x)).join(String.fromCodePoint(...a.pop?a:[a]))].map(x=>x.codePointAt()))),
	"¤":cu=>cu.push(cu.pick(1)),
	"@":cu=>(cu.push(cu.pick(x=cu.pop())),cu.splice(cu.length-x-2,1)),
	"ª":cu=>cu.splice(cu.length-cu.pop()-2,0,cu.pop()),
	"ø":cu=>cu.push(cu.pick(cu.pop())),
	"+":cu=>cu.push(math.add(cu.pop()||0,cu.pop()||0)),
	"-":cu=>(a=cu.pop()||0,b=cu.pop()||0,cu.push(math.subtract(b,a))),
	"×":cu=>cu.push(math.multiply(cu.pop()||0,cu.pop()||0)),
	"÷":cu=>(d=cu.pop()||0,n=cu.pop()||0,cu.push(math.mod(n,d),math.fix(math.divide(n,d)))),
	"^":cu=>(d=cu.pop()||0,n=cu.pop()||0,cu.push(math.fix(math.pow(n,d)))),
	"¿":cu=>cu.push(math.randomInt(2)),
	"Ð":cu=>cu.push(Date.now()),
	"«":cu=>(s=cu.pop(),cu.push(math.leftShift(cu.pop()||0,s||0))),
	"»":cu=>(s=cu.pop(),cu.push(math.rightLogShift(cu.pop()||0,s||0))),
	"&":cu=>cu.push(math.bitAnd(cu.pop()||0,cu.pop()||0)),
	"|":cu=>cu.push(math.bitXor(cu.pop()||0,cu.pop()||0)),
	"~":cu=>cu.push(math.bitNot(cu.pop()||0)),
	"±":cu=>cu.push(math.sign(cu.pop()||0)),
	"<":cu=>cu.push(math.unaryMinus(math.smaller(cu.pop()||0,0))),
	">":cu=>cu.push(math.unaryMinus(math.larger(cu.pop()||0,0))),
	"¥":cu=>cu.push(cu.pop()==null?0:-1),
	"'":cu=>cu.push(code.codePointAt(++ip)),
	"£":cu=>(a=cu.slice(0),cu.splice(0,cu.length),m=code[++ip],res=[],cu.push(...(a.map(x=>(commands[m](z=[x]),res.push(...z))),res))),
	'"':cu=>{cu.push([]);for(;code[++ip]!='"';)cu[cu.length-1].push(code.codePointAt(ip))},
	".":cu=>put(cu.pop()),
	",":cu=>put(String.fromCodePoint(...(x=cu.pop()).pop?x:[x])),
	"`":cu=>cu.push([...inp.value].map(x=>x.codePointAt())),
	":":cu=>vars[cu.pop()]=cu.pop(),
	";":cu=>cu.push(vars[cu.pop()]),
	"[":cu=>{cu.push(ip);ip=matching_brace()},
	"]":cu=>{n=ret.length-3;if(n>=0&&code[ret[n]]=='#'){if(cu.pop())ret.push(ret[n+1],ret[n+2]);else ret.pop(),ret.pop()}ip=ret.pop()},
	"!":cu=>{ret.push(ip);ip=cu.pop()},
	"?":cu=>{f=cu.pop(),t=cu.pop();ret.push(ip);ip=cu.pop()?t:f},
	"#":cu=>{ret.push(ip,cu.pick(1),cu.pop());ip=cu.pop()},
	"=":cu=>(op=cu.pop(),commands[code[++ip]]=x=>(ret.push(ip),ip=op))
}

//good-to-know data for runtime
log=_=>stats.innerHTML=`Code          │ ${format=code.replace(/[\x00-\x1f]/g,x=>String.fromCharCode(x.charCodeAt()+9216)).replace(/</g,'&lt;').replace(/>/g,'&gt;').split(/(&[gl]t;)|/).filter(x=>x),format[ip]=`<span style=background-color:#7ec0ee>${format[ip]||""}</span>`,format.join``}
IP            │ ${ip}
Stack1        │ ${JSON.stringify(stack1)}
Stack2        │ ${JSON.stringify(stack2)}
Current Stack │ ${JSON.stringify(cur)}
Nest Indices  │ ${nest}
Variables     │ ${JSON.stringify(vars)}
Return Stack  │ ${JSON.stringify(ret)}`
nsc.oninput=onload=_=>(code=nsc.value,log())

//actual parsing
parse=_=>{
	c=code[ip]
	log()
	if(commands[c])commands[c](cur);
	else if(/\d/.test(c)){c=num=code.slice(ip).match(/\d+/)[0];cur.push(+num);ip+=num.length;return}
	else if(/\s/.test(c)){ip+=(c=code.slice(ip).match(/\s+/)[0]).length;return}
	else cur.push(c);ip++
}

//clearing everything before starting prog
init=_=>(code=nsc.value,ahead=[],ip=0,stack1=[],stack2=[],cur=stack1,curstack=stack1,nest=[],ret=[],vars={},ini=0,out.innerHTML="",console.clear())

//determines either full or timed run
run=_=>{init();if(time.checked)interval=setInterval('ip<code.length?parse():(clearInterval(interval),log())',ms.value||1);else for(;ip<code.length;)parse();log()}

//iso-8859-1 encoding
encode=x=>[...x].map(a=>('00'+a.charCodeAt().toString(16)).slice(-2)).join` `
decode=x=>x.split` `.map(a=>String.fromCharCode('0x'+a)).join``
