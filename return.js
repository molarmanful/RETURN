var _templateObject = _taggedTemplateLiteral([''], ['']),
    _templateObject2 = _taggedTemplateLiteral([' '], [' ']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

//requires math.js

//initial vars+functions
ahead = [];
ip = 0;
stack1 = [], stack2 = [], cur = stack1, curstack = stack1, nest = [];
ret = [];
vars = {};
ini = 0;
c = '';
Array.prototype.pick = function (n) {
	return this[this.length - n - 1];
};
Array.prototype.chunk = function (r) {
	var t,
	    n = [],
	    e = 0;for (t = this.length / r; t > e;) {
		n[e] = this.splice(0, r), e++;
	}return n;
};
//lookahead stuff
seek = function seek(c) {
	return !ahead[ip] && (ahead[ip] = ip + code.slice(ip).indexOf(c)), ahead[ip];
};
matching_brace = function matching_brace(_) {
	var start = ip;
	if (!ahead[start]) {
		while (ip < code.length) {
			c = code[++ip];
			if (c == ']') break;
			if (braces[c]) ip = braces[c]();
		}
		ahead[start] = ip;
	}
	return ahead[start];
};
braces = {
	'"': function _(x) {
		return seek('"', ++ip);
	},
	"'": function _(x) {
		return ip + 1;
	},
	"[": matching_brace
};
put = function put(s) {
	return out.textContent += s;
};

//functions
commands = {
	"\x00": function _(cu) {
		return x = cu.pop(), cu.push(cu.slice(0).reverse().reduce(function (a, b, c) {
			return b == x && a.push(c), a;
		}, []));
	},
	"\x01": function _(cu) {
		return curstack = cu = curstack == stack1 ? stack2 : stack1, nest = [];
	},
	"\x02": function _(cu) {
		return cu.push(cu.slice(cu.length - cu.pop() - 1));
	},
	"\x03": function _(cu) {
		return cu.reverse();
	},
	"\x04": function _(cu) {
		return a = cu.slice(0), cu.splice(0, cu.length), cu.push.apply(cu, _toConsumableArray(math.transpose(a)));
	},
	"\x05": function _(cu) {
		return a = cu.slice(0), cu.splice(0, cu.length), cu.push.apply(cu, _toConsumableArray(math.flatten(a)));
	},
	"\x06": function _(cu) {
		return a = cu.slice(0), cu.splice(0, cu.length), cu.push.apply(cu, _toConsumableArray(math.sort(a)));
	},
	"\x07": function _(cu) {
		return cu.push(cu.length);
	},
	"\b": function _(cu) {
		return x = cu.pop(), cu.push(((y = cu.pop()).pop ? y : [y]).concat(x));
	},
	"\t": function _(cu) {
		return a = cu.slice(0), cu.splice(0, cu.length), cu.push(a.chunk(a.pop()));
	},
	"\n": function _(cu) {
		return a = cu.pop(), b = cu.pop(), cu.push(math.range(Math.min(a, b), Math.max(a, b))._data);
	},
	"\v": function _(cu) {
		return a = [], [].concat(_toConsumableArray(Array(cu.pop()))).map(function (x) {
			return a = [].concat(_toConsumableArray(a), _toConsumableArray(cu));
		}), cu.splice(0, cu.length), cu.push.apply(cu, _toConsumableArray(a));
	},
	"\f": function _(cu) {
		return (curstack == stack1 ? stack2 : stack1).push(cu.pop());
	},
	"\x0e": function _(cu) {
		return cu.push((curstack == stack1 ? stack2 : stack1).pop());
	},
	"{": function _(cu) {
		return cur = cu[cu.length - 1].pop ? cu[x = cu.length - 1] : cu[cu.length - 1] = [cu[x = cu.length - 1]], nest.push(x);
	},
	"}": function _(cu) {
		nest.length && (nest.pop(), cur = curstack, nest.map(function (x) {
			return cur = cur[x];
		}));
	},
	"%": function _(cu) {
		return cu.pop();
	},
	"$": function $(cu) {
		return cu.push(cu.pick(0));
	},
	"\\": function _(cu) {
		var _ref;

		return _ref = [cu[cu.length - 2], cu[cu.length - 1]], cu[cu.length - 1] = _ref[0], cu[cu.length - 2] = _ref[1], _ref;
	},
	"¦": function _(cu) {
		return cu.push(cu.pop().toString().split(_templateObject).map(function (x) {
			return +x;
		}));
	},
	"§": function _(cu) {
		return cu.push(+cu.pop().join(_templateObject));
	},
	"¨": function _(cu) {
		return x = cu.pop(), cu.push(String.fromCodePoint.apply(String, _toConsumableArray(cu.pop())).split(String.fromCodePoint.apply(String, _toConsumableArray(x.pop ? x : [x]))).map(function (a) {
			return [].concat(_toConsumableArray(a)).map(function (b) {
				return b.codePointAt();
			});
		}));
	},
	"°": function _(cu) {
		return a = cu.pop(), b = cu.slice(0), cu.splice(0, cu.length), cu.push.apply(cu, _toConsumableArray([].concat(_toConsumableArray(b.map(function (x) {
			return String.fromCodePoint.apply(String, _toConsumableArray(x));
		}).join(String.fromCodePoint.apply(String, _toConsumableArray(a.pop ? a : [a]))))).map(function (x) {
			return x.codePointAt();
		})));
	},
	"¤": function _(cu) {
		return cu.push(cu.pick(1));
	},
	"@": function _(cu) {
		return cu.push(cu.pick(x = cu.pop())), cu.splice(cu.length - x - 2, 1);
	},
	"ª": function _(cu) {
		return cu.splice(cu.length - cu.pop() - 2, 0, cu.pop());
	},
	"ø": function _(cu) {
		return cu.push(cu.pick(cu.pop()));
	},
	"+": function _(cu) {
		return cu.push(math.add(cu.pop() || 0, cu.pop() || 0));
	},
	"-": function _(cu) {
		return a = cu.pop() || 0, b = cu.pop() || 0, cu.push(math.subtract(b, a));
	},
	"×": function _(cu) {
		return cu.push(math.multiply(cu.pop() || 0, cu.pop() || 0));
	},
	"÷": function _(cu) {
		return d = cu.pop() || 0, n = cu.pop() || 0, cu.push(math.mod(n, d), math.fix(math.divide(n, d)));
	},
	"^": function _(cu) {
		return d = cu.pop() || 0, n = cu.pop() || 0, cu.push(math.fix(math.pow(n, d)));
	},
	"¿": function _(cu) {
		return cu.push(math.randomInt(2));
	},
	"Ð": function _(cu) {
		return cu.push(Date.now());
	},
	"«": function _(cu) {
		return s = cu.pop(), cu.push(math.leftShift(cu.pop() || 0, s || 0));
	},
	"»": function _(cu) {
		return s = cu.pop(), cu.push(math.rightLogShift(cu.pop() || 0, s || 0));
	},
	"&": function _(cu) {
		return cu.push(math.bitAnd(cu.pop() || 0, cu.pop() || 0));
	},
	"|": function _(cu) {
		return cu.push(math.bitXor(cu.pop() || 0, cu.pop() || 0));
	},
	"~": function _(cu) {
		return cu.push(math.bitNot(cu.pop() || 0));
	},
	"±": function _(cu) {
		return cu.push(math.sign(cu.pop() || 0));
	},
	"<": function _(cu) {
		return cu.push(math.unaryMinus(math.smaller(cu.pop() || 0, 0)));
	},
	">": function _(cu) {
		return cu.push(math.unaryMinus(math.larger(cu.pop() || 0, 0)));
	},
	"¥": function _(cu) {
		return cu.push(cu.pop() == null ? 0 : -1);
	},
	"'": function _(cu) {
		return cu.push(code.codePointAt(++ip));
	},
	"£": function _(cu) {
		return a = cu.slice(0), cu.splice(0, cu.length), m = code[++ip], res = [], cu.push.apply(cu, _toConsumableArray((a.map(function (x) {
			var _res;

			return commands[m](z = [x]), (_res = res).push.apply(_res, _toConsumableArray(z));
		}), res)));
	},
	'"': function _(cu) {
		cu.push([]);for (; code[++ip] != '"';) {
			cu[cu.length - 1].push(code.codePointAt(ip));
		}
	},
	".": function _(cu) {
		return put(cu.pop());
	},
	",": function _(cu) {
		return put(String.fromCodePoint.apply(String, _toConsumableArray((x = cu.pop()).pop ? x : [x])));
	},
	"`": function _(cu) {
		return cu.push([].concat(_toConsumableArray(inp.value)).map(function (x) {
			return x.codePointAt();
		}));
	},
	":": function _(cu) {
		return vars[cu.pop()] = cu.pop();
	},
	";": function _(cu) {
		return cu.push(vars[cu.pop()]);
	},
	"[": function _(cu) {
		cu.push(ip);ip = matching_brace();
	},
	"]": function _(cu) {
		n = ret.length - 3;if (n >= 0 && code[ret[n]] == '#') {
			if (cu.pop()) ret.push(ret[n + 1], ret[n + 2]);else ret.pop(), ret.pop();
		}ip = ret.pop();
	},
	"!": function _(cu) {
		ret.push(ip);ip = cu.pop();
	},
	"?": function _(cu) {
		f = cu.pop(), t = cu.pop();ret.push(ip);ip = cu.pop() ? t : f;
	},
	"#": function _(cu) {
		ret.push(ip, cu.pick(1), cu.pop());ip = cu.pop();
	},
	"=": function _(cu) {
		return op = cu.pop(), commands[code[++ip]] = function (x) {
			return ret.push(ip), ip = op;
		};
	}
};

//good-to-know data for runtime
log = function log(_) {
	return stats.innerHTML = 'Code          │ ' + (format = code.replace(/[\x00-\x1f]/g, function (x) {
		return String.fromCharCode(x.charCodeAt() + 9216);
	}).replace(/</g, '&lt;').replace(/>/g, '&gt;').split(/(&[gl]t;)|/).filter(function (x) {
		return x;
	}), format[ip] = '<span style=background-color:#7ec0ee>' + (format[ip] || "") + '</span>', format.join(_templateObject)) + '\nIP            │ ' + ip + '\nStack1        │ ' + JSON.stringify(stack1) + '\nStack2        │ ' + JSON.stringify(stack2) + '\nCurrent Stack │ ' + JSON.stringify(cur) + '\nNest Indices  │ ' + nest + '\nVariables     │ ' + JSON.stringify(vars) + '\nReturn Stack  │ ' + JSON.stringify(ret);
};
nsc.oninput = onload = function onload(_) {
	return code = nsc.value, log();
};

//actual parsing
parse = function parse(_) {
	c = code[ip];
	log();
	if (commands[c]) commands[c](cur);else if (/\d/.test(c)) {
		c = num = code.slice(ip).match(/\d+/)[0];cur.push(+num);ip += num.length;return;
	} else if (/\s/.test(c)) {
		ip += (c = code.slice(ip).match(/\s+/)[0]).length;return;
	} else cur.push(c);ip++;
};

//clearing everything before starting prog
init = function init(_) {
	return code = nsc.value, ahead = [], ip = 0, stack1 = [], stack2 = [], cur = stack1, curstack = stack1, nest = [], ret = [], vars = {}, ini = 0, out.innerHTML = "", console.clear();
};

//determines either full or timed run
run = function run(_) {
	init();if (time.checked) interval = setInterval('ip<code.length?parse():(clearInterval(interval),log())', ms.value || 1);else for (; ip < code.length;) {
		parse();
	}log();
};

//iso-8859-1 encoding
encode = function encode(x) {
	return [].concat(_toConsumableArray(x)).map(function (a) {
		return ('00' + a.charCodeAt().toString(16)).slice(-2);
	}).join(_templateObject2);
};
decode = function decode(x) {
	return x.split(_templateObject2).map(function (a) {
		return String.fromCharCode('0x' + a);
	}).join(_templateObject);
};
