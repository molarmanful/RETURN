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
	"\x00":x=>(x=cur.pop(),cur.push(cur.slice(0).reverse().reduce((a,b,c)=>(b==x&&a.push(c),a),[]))),
	"\x01":x=>(curstack=cur=curstack==stack1?stack2:stack1,nest=[]),
	"\x02":x=>cur.push(cur.slice(cur.length-cur.pop()-1)),
	"\x03":x=>cur.reverse(),
	"\x04":x=>(a=cur.slice(0),cur.splice(0,cur.length),cur.push(...math.transpose(a))),
	"\x05":x=>(a=cur.slice(0),cur.splice(0,cur.length),cur.push(...math.flatten(a))),
	"\x06":x=>(a=cur.slice(0),cur.splice(0,cur.length),cur.push(...math.sort(a))),
	"\x07":x=>cur.push(cur.length),
	"\b":x=>(x=cur.pop(),cur.push(((y=cur.pop()).pop?y:[y]).concat(x))),
	"\t":x=>(a=cur.slice(0),cur.splice(0,cur.length),cur.push(a.chunk(a.pop()))),
	"\n":x=>(a=cur.pop(),b=cur.pop(),cur.push(math.range(Math.min(a,b),Math.max(a,b))._data)),
	"\v":x=>(a=[],[...Array(cur.pop())].map(x=>a=[...a,...cur]),cur.splice(0,cur.length),cur.push(...a)),
	"\f":x=>(curstack==stack1?stack2:stack1).push(cur.pop()),
	"\x0e":x=>cur.push((curstack==stack1?stack2:stack1).pop()),
	"{":x=>(cur=cur[cur.length-1].pop?cur[x=cur.length-1]:(cur[cur.length-1]=[cur[x=cur.length-1]]),nest.push(x)),
	"}":x=>{nest.length&&(nest.pop(),cur=curstack,nest.map(x=>cur=cur[x]))},
	"%":x=>cur.pop(),
	"$":x=>cur.push(cur.pick(0)),
	"\\":x=>[cur[cur.length-1],cur[cur.length-2]]=[cur[cur.length-2],cur[cur.length-1]],
	"¦":x=>cur.push(cur.pop().toString().split``.map(x=>+x)),
	"§":x=>cur.push(+cur.pop().join``),
	"¨":x=>(x=cur.pop(),cur.push(String.fromCodePoint(...cur.pop()).split(String.fromCodePoint(...x.pop?x:[x])).map(a=>[...a].map(b=>b.codePointAt())))),
	"°":x=>(a=cur.pop(),b=cur.slice(0),cur.splice(0,cur.length),cur.push(...[...b.map(x=>String.fromCodePoint(...x)).join(String.fromCodePoint(...a.pop?a:[a]))].map(x=>x.codePointAt()))),
	"¤":x=>cur.push(cur.pick(1)),
	"@":x=>(cur.push(cur.pick(x=cur.pop())),cur.splice(cur.length-x-2,1)),
	"ª":x=>cur.splice(cur.length-cur.pop()-2,0,cur.pop()),
	"ø":x=>cur.push(cur.pick(cur.pop())),
	"+":x=>cur.push(math.add(cur.pop()||0,cur.pop()||0)),
	"-":x=>(a=cur.pop()||0,b=cur.pop()||0,cur.push(math.subtract(b,a))),
	"×":x=>cur.push(math.multiply(cur.pop()||0,cur.pop()||0)),
	"÷":x=>(d=cur.pop()||0,n=cur.pop()||0,cur.push(math.mod(n,d),math.fix(math.divide(n,d)))),
	"^":x=>(d=cur.pop()||0,n=cur.pop()||0,cur.push(math.fix(math.pow(n,d)))),
	"Þ":x=>(r=cur.pop(),b=cur.pop(),cur.push((f=(x,y)=>x.pop?x.map(a=>f(a,y)):y<2?+'1'.repeat(x):+x.toString(y<11?y:10))(b,r))),
	"þ":x=>(r=cur.pop(),b=cur.pop(),cur.push((f=(x,y)=>x.pop?x.map(a=>f(a,y)):y<2?(""+x).length:parseInt(x,y<11?y:10))(b,r))),
	"¿":x=>cur.push(math.randomInt(2)),
	"Ð":x=>cur.push(Date.now()),
	"«":x=>(s=cur.pop(),cur.push(math.leftShift(cur.pop()||0,s||0))),
	"»":x=>(s=cur.pop(),cur.push(math.rightLogShift(cur.pop()||0,s||0))),
	"&":x=>cur.push(math.bitAnd(cur.pop()||0,cur.pop()||0)),
	"|":x=>cur.push(math.bitXor(cur.pop()||0,cur.pop()||0)),
	"~":x=>cur.push(math.bitNot(cur.pop()||0)),
	"±":x=>cur.push(math.sign(cur.pop()||0)),
	"<":x=>cur.push(math.unaryMinus(math.smaller(cur.pop()||0,0))),
	">":x=>cur.push(math.unaryMinus(math.larger(cur.pop()||0,0))),
	"¥":x=>cur.push(cur.pop()==null?-1:0),
	"'":x=>cur.push(code.codePointAt(++ip)),
	'"':x=>{cur.push([]);for(;code[++ip]!='"';)cur[cur.length-1].push(code.codePointAt(ip))},
	".":x=>put(cur.pop()),
	",":x=>put(String.fromCodePoint(...(x=cur.pop()).pop?x:[x])),
	"`":x=>cur.push([...inp.value].map(x=>x.codePointAt())),
	":":x=>vars[cur.pop()]=cur.pop(),
	";":x=>cur.push(vars[cur.pop()]),
	"[":x=>{cur.push(ip);ip=matching_brace()},
	"]":x=>{n=ret.length-3;if(n>=0&&code[ret[n]]=='#'){if(cur.pop())ret.push(ret[n+1],ret[n+2]);else ret.pop(),ret.pop()}ip=ret.pop()},
	"!":x=>{ret.push(ip);ip=cur.pop()},
	"?":x=>{f=cur.pop(),t=cur.pop();ret.push(ip);ip=cur.pop()?t:f},
	"#":x=>{ret.push(ip,cur.pick(1),cur.pop());ip=cur.pop()},
	"=":x=>(op=cur.pop(),commands[code[++ip]]=x=>(ret.push(ip),ip=op))
}

//good-to-know data for runtime
log=_=>stats.innerHTML=`Code          │ ${format=[...code.replace(/[\x00-\x1f]/g,x=>String.fromCharCode(x.charCodeAt()+9216))],format[ip]=`<span style=background-color:#7ec0ee>${format[ip]||""}</span>`,format.join``}
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
	if(commands[c])commands[c]();
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
