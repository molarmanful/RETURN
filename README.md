# RETURN
*RETURN* (my favorite stack type in DUP) is a stack-based language inspired by DUP. It is an attempt to improve upon DUP in a way that allows more programming tasks to be solved more easily.

## Overview
RETURN is different from other stack-based languages in that there are multiple stacks. You get 2 parent stacks, and new children stacks can be created along the way. There are different commands to switch between and manipulate stacks.

RETURN uses ISO-8859-1.

## Commands
- `0-9`: Push number to stack. You may need to separate series of numbers with whitespace.
- `\0`: Find all indices of top item in stack, or return `-1` if not found.
- `\1`: Switch parent stacks.
- `\2`: Duplicate top _n_ items into a new stack.
- `\3`: Reverse stack.
- `\4`: Transpose stack.
- `\5`: Flatten stack.
- `\6`: Sort stack.
- `\7`: Get stack length.
- `\b`: Concatenate top 2 items.
- `\t`: Split the stack into chunks.
- `\n`: Generate a range between top 2 numbers.
- `\v`: Repeat stack by top item.
- `\f`: Push to other parent stack.
- `\x0e`: Get top item from other parent stack.
- `{`: Set top item as current stack.
- `}`: Get out of current stack into surrounding stack.
- `%`: Drop top item.
- `$`: Duplicate top item.
- `¤`: Pick 2nd item from top.
- `\`: Swap top 2 items.
- `@`: Pull _nth_ item to top.
- `ª`: Push item to _nth_ index.
- `ø`: Duplicate nth item from top.
- `+-×^`: Add/subtract/multiply/pow top 2 items.
- `÷`: Divmod top 2 items (mod first, then div).
- `Þ`: Convert to base 1<=_n_<=10.
- `¿`: Push random binary number to stack.
- `Ð`: Push milliseconds elapsed since January 1, 1970 00:00:00 UTC.
- `&|`: Perform bitwise AND/XOR on top 2 items.
- `~`: Perform bitwise NOT on top item.
- `«»`: Perform logical left/right shift on top 2 items.
- `±`: Get sign of top item.
- `<`: Check if top item is less than 0.
- `>`: Check if top item is greater than 0.
- `'a`: Push subsequent charcode to stack.
- `"..."`: Push a series of charcodes to a new stack until another `"` is met.
- `¦`: Split a number into a stack with its individual digits.
- `§`: Join a stack into a number.
- `¨`: Split a stack along top item.
- `°`: Join stack with top item.
- `.`: Output top item.
- `,`: Output top item as charcode.
- <code>`</code>: Push entire input into a new stack.
- `:`: Store 2nd item from top to top item.
- `;`: Get stored value from top item.
- `[...]`: Push lambda to stack.
- `!`: Execute lambda.
- `[...][...]?`: Executes 2nd lambda from top if 3rd item from top is truthy; otherwise, executes top lambda.
- `[...][...]#`: Executes top lambda while condition (returned by 2nd lambda from top) is truthy.
- `[...]=a`: Define top lambda as operator.

## Examples
"Hello, world!":
```
"Hello, world!",
```
`cat`:
```
`,
```
Quine:
```
"34¤¤,,,,"34¤¤,,,,
```
Infinite loop:
```
~!
```
Factorial (_requires input number to be on stack_):
```
1+1
[¤][×]#
```
Fibonacci Sequence (_infinite loop_):
```
1$[¤¤+2!]!
```
Thue-Morse Sequence (_infinite loop_):
```
0[{[$¥][[0][1]?]#[$¥][]#%}1!]!
```
