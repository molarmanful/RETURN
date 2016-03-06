# Nestack
*Nestack* (a mashing of `nest` and `stack`) is a stack-based language inspired by DUP. It is an attempt to improve upon DUP in a way that allows more programming tasks to be solved more easily.

## Overview
Nestack is different from other stack-based languages in that there are multiple stacks. You get 2 parent stacks, and new children stacks can be created along the way. There are different commands to switch between and manipulate stacks.

## Commands
- `0-9`: Push number to stack. You may need to separate series of numbers with whitespace.
- `0x00`: Push stack length to stack.
- `0x01`: Switch parent stacks.
- `0x02`: Duplicate top _n_ items into a new stack.
- `0x03`: Reverse stack.
- `0x04`: Transpose stack.
- `0x05`: Flatten stack.
- `0x06`: Sort stack.
- `{`: Set top item as current stack.
- `}`: Get out of current stack into surrounding stack.
- `%`: Pop and discard.
- `$`: Duplicate top item.
- `¤`: Pick 2nd item from top.
- `\`: Swap top 2 items.
- `@`: Pull _nth_ item to top.
- `ø`: Duplicate nth item from top.
- `+-×÷^`: Add/subtract/multiply/pow top 2 items.
- `÷`: Divmod top 2 items (mod first, then div).
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
