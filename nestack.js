//requires math.js
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
commands={
	"\0":x=>cur.push(cur.length),
	"\1":x=>(curstack=cur=curstack==stack1?stack2:stack1,nest=[]),
	"\2":x=>cur.push(cur.slice(cur.length-cur.pop()-1)),
	"\3":x=>cur=cur.reverse(),
	"\4":x=>cur=math.transpose(cur),
	"\5":x=>cur=math.flatten(cur),
	"\6":x=>cur=cur.sort(),
	"{":x=>(cur=cur[cur.length-1].pop?cur[x=cur.length-1]:(cur[cur.length-1]=[cur[x=cur.length-1]]),nest.push(x)),
	"}":x=>{nest.length&&(nest.pop(),cur=curstack,nest.map(x=>cur=cur[x]))},
	"%":x=>cur.pop(),
	"$":x=>cur.push(cur.pick(0)),
	"\\":x=>[cur[cur.length-1],cur[cur.length-2]]=[cur[cur.length-2],cur[cur.length-1]],
	"@":x=>(cur.push(cur.pick(x=cur.pop())),cur.splice(cur.length-x-2,1)),
	"ø":x=>cur.push(cur.pick(cur.pop())),
	"+":x=>cur.push(math.add(cur.pop(),cur.pop())),
	"-":x=>(a=cur.pop(),b=cur.pop(),cur.push(math.subtract(b,a))),
	"×":x=>cur.push(math.multiply(cur.pop(),cur.pop())),
	"÷":x=>(d=cur.pop(),n=cur.pop(),cur.push(math.mod(n,d),math.fix(math.divide(n,d)))),
	"^":x=>(d=cur.pop(),n=cur.pop(),cur.push(math.fix(math.pow(n,d)))),
	"¿":x=>cur.push(math.randomInt(2)),
	"Ð":x=>cur.push(Date.now()),
	"«":x=>(s=cur.pop(),cur.push(math.leftShift(cur.pop(),s))),
	"»":x=>(s=cur.pop(),cur.push(math.rightLogShift(cur.pop(),s))),
	"&":x=>cur.push(math.bitAnd(cur.pop(),cur.pop())),
	"|":x=>cur.push(math.bitXor(cur.pop(),cur.pop())),
	"~":x=>cur.push(math.bitNot(cur.pop())),
	"±":x=>cur.push(math.sign(cur.pop())),
	"<":x=>cur.push(math.unaryMinus(math.larger(cur.pop(),0))),
	">":x=>cur.push(math.unaryMinus(math.smaller(cur.pop(),0))),
	"'":x=>cur.push(code.codePointAt(++ip)),
	'"':x=>{cur.push([]);for(;code[++ip]!='"';)cur[cur.length-1].push(code.codePointAt(ip))},
	".":x=>put(cur.pop()),
	",":x=>put(String.fromCodePoint(...(x=cur.pop()).pop?x:[x])),
	"`":x=>cur.push([...inp.value].map(x=>x.codePointAt())),
	":":x=>vars[cur.pop()]=cur.pop(),
	";":x=>cur.push(vars[cur.pop()]),
	"[":x=>(cur.push(ip),ip=matching_brace()),
	"]":x=>{n=ret.length-3;if(~n&&code[ret[n]]=='#'){if(cur.pop())ret.push(ret[n+1],ret[n+2]);else ret.pop(),ret.pop()}ip=ret.pop()},
	"!":x=>(ret.push(ip),ip=cur.pop()),
	"?":x=>(f=cur.pop(),t=cur.pop(),ret.push(ip),ip=cur.pop()?t:f),
	"#":x=>(ret.push(ip,cur.pick(1),cur.pop()),ip=cur.pop()),
	"=":x=>(op=cur.pop(),commands[code[++ip]]=x=>ret.push(ip),ip=op)
}
log=_=>console.log(`Command: ${c}
Stack1: ${JSON.stringify(stack1)}
Stack2: ${JSON.stringify(stack2)}
Current Stack: ${JSON.stringify(cur)}
Nest Indices: ${nest}
Variables: ${JSON.stringify(vars)}
Return Stack: ${JSON.stringify(ret)}`)
eval=_=>{
	c=code[ip]
	if(commands[c])commands[c]();
	else if(/\d/.test(c)){c=num=code.substring(ip).match(/\d+/)[0];cur.push(+num);ip+=num.length;log();return}
	else if(/\s/.test(c)){ip+=(c=code.substring(ip).match(/\s+/)[0]).length;log();return}
	else cur.push(c);ip++;log()
}
init=_=>(code=nsc.value,ahead=[],ip=0,stack1=[],stack2=[],cur=stack1,curstack=stack1,nest=[],ret=[],vars={},ini=0,out.innerHTML="",console.clear())
run=_=>{init();if(time.checked)interval=setInterval('ip<code.length?eval():clearInterval(interval)',1);else for(;ip<code.length;)eval()}
