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
	"\x00": function _(x) {
		return x = cur.pop(), cur.push(cur.slice(0).reverse().reduce(function (a, b, c) {
			return b == x && a.push(c), a;
		}, []));
	},
	"\x01": function _(x) {
		return curstack = cur = curstack == stack1 ? stack2 : stack1, nest = [];
	},
	"\x02": function _(x) {
		return cur.push(cur.slice(cur.length - cur.pop() - 1));
	},
	"\x03": function _(x) {
		return cur.reverse();
	},
	"\x04": function _(x) {
		var _cur;

		return a = cur.slice(0), cur.splice(0, cur.length), (_cur = cur).push.apply(_cur, _toConsumableArray(math.transpose(a)));
	},
	"\x05": function _(x) {
		var _cur2;

		return a = cur.slice(0), cur.splice(0, cur.length), (_cur2 = cur).push.apply(_cur2, _toConsumableArray(math.flatten(a)));
	},
	"\x06": function _(x) {
		var _cur3;

		return a = cur.slice(0), cur.splice(0, cur.length), (_cur3 = cur).push.apply(_cur3, _toConsumableArray(math.sort(a)));
	},
	"\x07": function _(x) {
		return cur.push(cur.length);
	},
	"\b": function _(x) {
		return x = cur.pop(), cur.push(((y = cur.pop()).pop ? y : [y]).concat(x));
	},
	"\t": function _(x) {
		return a = cur.slice(0), cur.splice(0, cur.length), cur.push(a.chunk(a.pop()));
	},
	"\n": function _(x) {
		return a = cur.pop(), b = cur.pop(), cur.push(math.range(Math.min(a, b), Math.max(a, b))._data);
	},
	"\v": function _(x) {
		var _cur4;

		return a = [], [].concat(_toConsumableArray(Array(cur.pop()))).map(function (x) {
			return a = [].concat(_toConsumableArray(a), _toConsumableArray(cur));
		}), cur.splice(0, cur.length), (_cur4 = cur).push.apply(_cur4, _toConsumableArray(a));
	},
	"\f": function _(x) {
		return (curstack == stack1 ? stack2 : stack1).push(cur.pop());
	},
	"\r": function _(x) {
		return cur.push((curstack == stack1 ? stack2 : stack1).pop());
	},
	"{": function _(x) {
		return cur = cur[cur.length - 1].pop ? cur[x = cur.length - 1] : cur[cur.length - 1] = [cur[x = cur.length - 1]], nest.push(x);
	},
	"}": function _(x) {
		nest.length && (nest.pop(), cur = curstack, nest.map(function (x) {
			return cur = cur[x];
		}));
	},
	"%": function _(x) {
		return cur.pop();
	},
	"$": function $(x) {
		return cur.push(cur.pick(0));
	},
	"\\": function _(x) {
		var _ref;

		return _ref = [cur[cur.length - 2], cur[cur.length - 1]], cur[cur.length - 1] = _ref[0], cur[cur.length - 2] = _ref[1], _ref;
	},
	"¦": function _(x) {
		return cur.push(cur.pop().toString().split(_templateObject).map(function (x) {
			return +x;
		}));
	},
	"§": function _(x) {
		return cur.push(+cur.pop().join(_templateObject));
	},
	"¨": function _(x) {
		return x = cur.pop(), cur.push(String.fromCodePoint.apply(String, _toConsumableArray(cur.pop())).split(String.fromCodePoint.apply(String, _toConsumableArray(x.pop ? x : [x]))).map(function (a) {
			return [].concat(_toConsumableArray(a)).map(function (b) {
				return b.codePointAt();
			});
		}));
	},
	"°": function _(x) {
		var _cur5;

		return a = cur.pop(), b = cur.slice(0), cur.splice(0, cur.length), (_cur5 = cur).push.apply(_cur5, _toConsumableArray([].concat(_toConsumableArray(b.map(function (x) {
			return String.fromCodePoint.apply(String, _toConsumableArray(x));
		}).join(String.fromCodePoint.apply(String, _toConsumableArray(a.pop ? a : [a]))))).map(function (x) {
			return x.codePointAt();
		})));
	},
	"¤": function _(x) {
		return cur.push(cur.pick(1));
	},
	"@": function _(x) {
		return cur.push(cur.pick(x = cur.pop())), cur.splice(cur.length - x - 2, 1);
	},
	"ª": function _(x) {
		return cur.splice(cur.length - cur.pop() - 2, 0, cur.pop());
	},
	"ø": function _(x) {
		return cur.push(cur.pick(cur.pop()));
	},
	"+": function _(x) {
		return cur.push(math.add(cur.pop() || 0, cur.pop() || 0));
	},
	"-": function _(x) {
		return a = cur.pop() || 0, b = cur.pop() || 0, cur.push(math.subtract(b, a));
	},
	"×": function _(x) {
		return cur.push(math.multiply(cur.pop() || 0, cur.pop() || 0));
	},
	"÷": function _(x) {
		return d = cur.pop() || 0, n = cur.pop() || 0, cur.push(math.mod(n, d), math.fix(math.divide(n, d)));
	},
	"^": function _(x) {
		return d = cur.pop() || 0, n = cur.pop() || 0, cur.push(math.fix(math.pow(n, d)));
	},
	"Þ": function _(x) {
		return r = cur.pop(), b = cur.pop(), cur.push((f = function (_f) {
			function f(_x, _x2) {
				return _f.apply(this, arguments);
			}

			f.toString = function () {
				return _f.toString();
			};

			return f;
		}(function (x, y) {
			return x.pop ? x.map(function (a) {
				return f(a, y);
			}) : y < 2 ? +'1'.repeat(x) : +x.toString(y < 11 ? y : 10);
		}))(b, r));
	},
	"¿": function _(x) {
		return cur.push(math.randomInt(2));
	},
	"Ð": function _(x) {
		return cur.push(Date.now());
	},
	"«": function _(x) {
		return s = cur.pop(), cur.push(math.leftShift(cur.pop() || 0, s || 0));
	},
	"»": function _(x) {
		return s = cur.pop(), cur.push(math.rightLogShift(cur.pop() || 0, s || 0));
	},
	"&": function _(x) {
		return cur.push(math.bitAnd(cur.pop() || 0, cur.pop() || 0));
	},
	"|": function _(x) {
		return cur.push(math.bitXor(cur.pop() || 0, cur.pop() || 0));
	},
	"~": function _(x) {
		return cur.push(math.bitNot(cur.pop() || 0));
	},
	"±": function _(x) {
		return cur.push(math.sign(cur.pop() || 0));
	},
	"<": function _(x) {
		return cur.push(math.unaryMinus(math.smaller(cur.pop() || 0, 0)));
	},
	">": function _(x) {
		return cur.push(math.unaryMinus(math.larger(cur.pop() || 0, 0)));
	},
	"'": function _(x) {
		return cur.push(code.codePointAt(++ip));
	},
	'"': function _(x) {
		cur.push([]);for (; code[++ip] != '"';) {
			cur[cur.length - 1].push(code.codePointAt(ip));
		}
	},
	".": function _(x) {
		return put(cur.pop());
	},
	",": function _(x) {
		return put(String.fromCodePoint.apply(String, _toConsumableArray((x = cur.pop()).pop ? x : [x])));
	},
	"`": function _(x) {
		return cur.push([].concat(_toConsumableArray(inp.value)).map(function (x) {
			return x.codePointAt();
		}));
	},
	":": function _(x) {
		return vars[cur.pop()] = cur.pop();
	},
	";": function _(x) {
		return cur.push(vars[cur.pop()]);
	},
	"[": function _(x) {
		cur.push(ip);ip = matching_brace();
	},
	"]": function _(x) {
		n = ret.length - 3;if (n >= 0 && code[ret[n]] == '#') {
			if (cur.pop()) ret.push(ret[n + 1], ret[n + 2]);else ret.pop(), ret.pop();
		}ip = ret.pop();
	},
	"!": function _(x) {
		ret.push(ip);ip = cur.pop();
	},
	"?": function _(x) {
		f = cur.pop(), t = cur.pop();ret.push(ip);ip = cur.pop() ? t : f;
	},
	"#": function _(x) {
		ret.push(ip, cur.pick(1), cur.pop());ip = cur.pop();
	},
	"=": function _(x) {
		return op = cur.pop(), commands[code[++ip]] = function (x) {
			return ret.push(ip), ip = op;
		};
	}
};

//good-to-know data for runtime
log = function log(_) {
	return stats.innerHTML = 'Code          │ ' + (format = [].concat(_toConsumableArray(code.replace(/[\x00-\x1f]/g, function (x) {
		return String.fromCharCode(x.charCodeAt() + 9216);
	}))), format[ip] = '<span style=background-color:#7ec0ee>' + (format[ip] || "") + '</span>', format.join(_templateObject)) + '\nIP            │ ' + ip + '\nStack1        │ ' + JSON.stringify(stack1) + '\nStack2        │ ' + JSON.stringify(stack2) + '\nCurrent Stack │ ' + JSON.stringify(cur) + '\nNest Indices  │ ' + nest + '\nVariables     │ ' + JSON.stringify(vars) + '\nReturn Stack  │ ' + JSON.stringify(ret);
};
nsc.oninput = onload = function onload(_) {
	return code = nsc.value, log();
};

//actual parsing
parse = function parse(_) {
	c = code[ip];
	log();
	if (commands[c]) commands[c]();else if (/\d/.test(c)) {
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
