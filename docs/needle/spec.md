---
sidebar_position: 2
title: Specification

toc_min_heading_level: 2
toc_max_heading_level: 4
---

# Needle Specification {#needle-specification}

The Needle Specification is a formal description of the Needle language. It is
intended to be a reference for developers who want to understand the language in
detail.

It is a statically-typed language with a syntax that is familiar to developers
who have experience with golang.

## File Structure {#file-structure}

In Needle language, the main code block structure includes
[Smart Contract](#spec-contract), [Data](#spec-data),
[Function](#spec-function), [Settings](#spec-settings).

### Smart Contract {#spec-contract}

Use the `contract` keyword to declare a smart contract, followed by the name of
the smart contract, and its content must be enclosed in curly braces.

> ContractStmt = "contract" [Identifier](#spec-identifier) >
> [CodeBlockStmt](#spec-codeblock).

Smart contract structure has three main parts: [Data](#spec-data),
[Settings](#spec-settings), [Function](#spec-function).

```go
contract Name {
    data{}
    settings{}
    func name(){}
}
```

### Data {#spec-data}

Use `data` keyword partially describes the smart contract data input as well as
the received form parameters. The `optional` indicates that the parameter is
optional and not required.

> `DataStmt` = "data" "\{" \{ `ParamSign` } "}" .
>
> `ParamSign` = [Identifier](#spec-identifier) [Typename](#spec-typename) [ >
> `Tag` ] .
>
> `Tag` = "optional" .

use the symbol `$` to get the corresponding variable value, it must be used in
the [Function](#spec-function) within the contract, it is equivalent to the
global variable of the contract. You can use it directly or reassign it.

```go
contract Name {
  data {
    Param1 int
    Param2 string "optional"
  }
  func name(){
    $Param1 = 4
    Println($Param1)
  }
}
```

### Settings {#spec-settings}

Use the `settings` keyword to declare constants, the constant type can be `int`,
`float`, `string`, `bool`, it must be within the `contract`.

> `SettingsStmt` = "settings" `SettingsScope` .
>
> `SettingsScope` = "\{" [Identifier](#spec-identifier) "="
> [Typename](#spec-typename) "}" .

```go
contract Name {
    settings {
      i = 1
      f = 1.2
      b = true
      s = "this is a string"
    }
}
```

### Function {#spec-function}

This function processes the [Data](#spec-data) and [Settings](#spec-settings) in
the smart contract. It performs operations such as arithmetic, type conversion,
and establishing interactions between contracts.

#### Function Declaration {#function-decl}

Functions are declared with the `func` keyword followed by the function name,
parameters, type parameters, function tail, a return type and finally the
function body.

> `FuncDecl` = "func" FuncName `FuncSign` `FuncBody` .
>
> `FuncName` = [Identifier](#spec-identifier) .
>
> `FuncBody` = [CodeBlockStmt](#spec-codeblock) .
>
> `FuncSign` = [ `FuncParams` ] [ `FuncTail` ] [ `FuncResult` ] .
>
> `FuncParams` = "(" [ `FuncParamList` ] ")" .
>
> `FuncParamList` = `FuncParam` \{ ("," \| " ") `FuncParam` } .
>
> `FuncParam` = [IdentifierList](#spec-identifier) \{ "..." \| >
> [Typename](#spec-typename) } .
>
> `FuncResult` = [TypeList](#spec-typename) .
>
> `FuncTail` = "." [Identifier](#spec-identifier) [ `FuncParams` ] .

The function can have multiple parameters, each parameter followed by a
parameter name and type, separated by a space or comma. The return value cannot
be enclosed in parentheses `()`, and the return type cannot declare its variable
name. Use the keyword `return` to return one or more values.

```go
func Add(a b, c int, s string) int string{
    if a {
        return a + b + c, s
    }
    // invalid: missing return statement.
}
```

If the function does not declare a parameter list, the parentheses `()` in the
function signature can be omitted, and in this case, the type declaration after
the function name is called the result parameter.

```go
func Get string{
    return "string"
}
```

The function signature can use `...` to represent the type of variadic
parameters, which must be the last parameter, and its data type is
[Array](#spec-typename). The variadic parameter contains all the variables
starting from the call to pass the parameter. Any type of variable can be
passed, but conflicts with data types need to be handled.

```go
func sum(out string, values ...) {
    //...
}

func Name() {
   sum("Sum:", 10, "20", 30.3)
}
```

THe function thought the `return` statement returns a value, it will not be
passed to other contracts. If you want to pass the return value of the contract
to another contract, you need to assign the return value to the `$result`
variable.

```go
contract NameB {
    action {
        $result = 11
    }
}
contract NameA {
    action {
        var a int
        a = NameB()
    }
}
```

If the function name is `action` or `conditions`, the `func` can be omitted.

```go
contract Name {
    action {}
    conditions {}
}
```

#### Tail function {#tail-function}

The function may have many parameters, but when calling them, you only want to
pass some of them. In this case, you can declare multiple functions with a dot,
such functions are called `tail functions`, and then you can call the specified
parameters in any order, without having to call them in the order declared. In
such a function body, you can use these parameters normally. If no parameters
are passed, they will be assigned default values. Tail functions do not have
return values, and the return values are part of the main function.

>

```go
func myfunc(name string).Param1(p1 int).Param2(p2 string) int {
    //...
}
func Name{
    myfunc("name").Param2("p2")
}
```

Different functions can be called using a dot. When calling a function, the
return value of this function can be used as the input of the next function, and
the return value is obtained in the order of definition. Multiple tail functions
are only visible to the main function, not to other functions. Tail functions
cannot be called separately, they must be connected to the main function or
other tail functions under the main function.

```go
func A(int).tailA() int, string
func B(string,bool) string

func Name(){
    B("B",true).A(2)
    A(2).B(true).tailA()//invalid
    tailA() //invalid
}
```

## Syntax base {#syntax-base}

The source code must be encoded using UTF-8.

### Code block {#spec-codeblock}

The curly braces `{}` specify a code block that can contain local variables.
Variables in the code block can only be used in the code block and its sub-code
block. The function body is also a code block.

> `CodeBlockStmt` = "\{" ... "}" .

By default, variables in a code block are not visible, and the scope of a
variable can be extended to its sub-code block. In a code block, you can use the
name of an existing variable to define a new variable. Therefore, it is not
visible outside its scope. When the scope ends, the variable will be destroyed.

```go
contract Name {
    func block {
        var a int
        a = 3
        if ture {
            var a int
            a = 4
        }
    }
}
```

### Comment {#spec-comment}

Comments can be used as documentation, and the content of the comments will be
ignored by the compiler. There are two types of comments, one is **single-line
comments**, and the other is **multi-line comments**.

1. Single line comments start with `//` and end at the end of the line.

```go
func add(a int, b int) int {
    // This is a comment
    return a + b // This is also a comment
}
```

2. Multi-line comments start with `/*` and end with `*/`. Multi-line comments
   are not affected by newline characters, can span multiple lines, and can be
   commented out anywhere.

```go
func /*here*/a() {
   var b /*there*/ int
/*
here
*/
    b = /*there*/ 2
}
/*everywhere*/
```

### Newline {#spec-newline}

The newline character is a delimiter between expressions and statements, and the
newline character is replaced by a semicolon `;`, which can be used to separate
multiple expressions or statements.

```go
var a int
a = 1

//can be written as
var a int; as = 1
```

### Delimiter {#spec-delimiter}

Delimiter are used to separate identifiers, such as variable names, function
names, type names, etc.

> Delimiter = "(" | ")" | "\{" | "}" | "[" | "]" | "." | "," | "=" | ":" .

### Expression {#spec-expression}

Expression refers to a statement that calculates a value. An expression consists
of constants, variables, operators, and functions. A definite value can be
obtained after calculation. The expression does not change the value, it just
calculates a value.

Some examples of expressions, not limited to:

- Literals, including string literals, numeric literals, such as: `100`, `3.14`,
  `"hello"`.
- Variable names, such as: `x`, `sum`.
- Arithmetic expressions, such as: `1 + 2`, `a * b`.
- Function call expressions, such as: `fnName()`.
- Comparison expressions, such as: `a == b`, `score > 90`.
- Logical expressions, such as: `a && b`, `!done`.
- Array, slice, map index expression, such as: `array[2]`, `map["key"]`,
  `slice[1:3]`.
- Type conversion expression, such as: `Int(a)`.

The value obtained by calculating the expression can be assigned to a variable,
used as a parameter to a function, combined with other expressions to form more
complex expressions, and used in if condition statements to control the program
flow.

### Identifier {#spec-identifier}

Identifiers are used to identify variables, functions, constants, and other
program names. Identifiers are composed of one or more letters, numbers, and
underscores, and must begin with a letter. Identifiers cannot contain spaces and
special characters. Identifiers are case-sensitive and cannot use
[keywords](#spec-keyword) as identifiers.

> `Identifier` = `unicode_letter` \{ `letter` \| `unicode_digit` }
>
> `letter` = `unicode_letter` \| "\_" .
>
> `unicode_letter` = // a Unicode code point classified as "Letter".
>
> `unicode_digit` = // a Unicode code point categorized as "Number, decimal
> digit".
>
> `IdentifierList` = `Identifier` \{ ("," \| " ") `Identifier` } .

```go
a
x_123
αβ
```

Multiple identifiers can be combined into an identifier list, separated by
commas or spaces.

### Keyword {#spec-keyword}

The following keywords are reserved and cannot be used as identifiers.

|          |       |       |          |            |
| -------- | ----- | ----- | -------- | ---------- |
| contract | func  | data  | action   | conditions |
| return   | if    | elif  | else     | while      |
| var      | nil   | break | continue | settings   |
| true     | false | info  | warning  | error      |
| ...      |       |       |          |            |

### Number {#spec-number}

Number literal values include: decimal integer, binary integer, octal integer,
hexadecimal integer, and floating-point number and scientific notation.

There are two basic types: `int` and `float`. If the number contains a decimal
point or `eE`, it is a **float** type, which conforms to the standard IEEE-754
64-bit floating-point number, otherwise it is an **int** type. int is equivalent
to int64 in the Golang language, and float is equivalent to float64 in the
Golang language.

> `int` = `DecimalLit` | `BinaryLit` | `OctalLit` | `HexLit` .
>
> `float` = `FloatLit` .
>
> `decimal_digit` = "0"..."9" .
>
> `binary_digit` = "01" .
>
> `octal_digit` = "0"..."7" .
>
> `hex_digit` = "0"..."9" | "A"..."F" | "a"..."f" .
>
> `binary_digits` = `binary_digit` \{ [ "_" ] `binary_digit` } .
>
> `decimal_digits`= `decimal_digit` \{ [ "_" ] `decimal_digit` } .
>
> `octal_digits` = `octal_digit` \{ [ "_" ] `octal_digit` } .
>
> `hex_digits` = `hex_digit` \{ [ "_" ] `hex_digit` } .
>
> `DecimalLit` = `decimal_digit` [ "_" ] `decimal_digits` .
>
> `BinaryLit` = "0" ( "b" | "B" ) [ "_" ] `binary_digits` .
>
> `OctalLit` = "0" ( "o" | "O" ) [ "_" ] `octal_digits` .
>
> `HexLit` = "0" ( "x" | "X" ) [ "_" ] `hex_digits` .
>
> `ExponentPart` = ( "e" | "E" ) [ "+" | "-" ] `decimal_digits` .
>
> `FloatLit` = `decimal_digits` "." [ `decimal_digits` ] [ `ExponentPart` ] |
> `decimal_digits` `ExponentPart` | "." `decimal_digits` [ `ExponentPart` ] .

```
0
123
0b101
0o123
0xaf
0.123
1.23e+2
.3e+2
```

### String {#spec-string}

String literals can be enclosed in double quotes `"` or backticks `` ` ``, and
string literals enclosed in backticks can span multiple lines. The string in
double quotes can contain escape sequences for double quotes, newline, and
carriage return. The string in backticks is not escaped.

> `StringLiteral` = `RawStringLiteral` | `InterpretedStringLiteral` .
>
> `RawStringLiteral` = ``"`"`` \{ `unicode_char` } ``"`"`` .
>
> `InterpretedStringLiteral` = `"` \{ `unicode_value` } `"` .
>
> `unicode_char` = // an arbitrary Unicode code point except newline.
>
> `unicode_value` = // an arbitrary Unicode code point.

```go
var str string
str = "This is \n a string"
str = `This is \n \t \r a other string`
```

### Variable {#spec-variable}

Variables are used to store values, and the values allowed by variables are
determined by their types. The type is immutable, but the value can be changed
during program execution.

#### Local Variable {#local-variable}

The keyword `var` is used to declare local variables, and the variable must be
followed by a variable name and type.

> `LocalVarDecl` = "var" [IdentifierList](#spec-identifier) >
> [Typename](#spec-typename) .

When declaring a variable, its value is the default value. To declare one or
more variables, you can use a comma or space to separate multiple variable names
and types. When the types of two or more consecutive named formal parameters of
a function are the same, all types except the last one can be omitted.

```go
var a int
var b b1, b2 string
var c bool, c1 float

b = "string"
b1, b2 = "string1", "string2"
c c1 = true 1.2
```

Variables cannot be initialized when declared, and must be assigned after
declaration.

```go
// invalid
var a int = 1

// good
var a int
a = 1
```

The types `map` and `array` do not support multiple assignments on the same line
using `{}` and `[]`, but multiple assignments on the same line can be done using
variable names.

```go
var a b int c c1 map d d1 array
a, b = 1, 2
c,d = {"a":a, "b":b}, [1, 2, 3] //error
c = {"a":a, "b":b}
d = [1, 2, 3]
c1, d1 = c, d
d[0], d[1] = c, d //error
d[0], d[1] = d[1], d[0] //error
```

#### Global Variable {#global-variable}

The keyword symbol `$` and [Identifier](#spec-identifier) is used to declare and
use global variables. The syntax is as follows:

> `GlobalVarDecl` = "$" [Identifier](#spec-identifier) .

Global variables can be declared in any function within a single contract scope,
but must be declared before use. The parameters defined in the `data` section
are also global variables, but can only be used within the current contract
scope.

```go
contract Name {
    data {
        param int
    }
    func set() {
        $abc = 1
    }
    func get() int {
        $abc = $abc + $param
        return $abc
    }
}
```

#### Predeclared global variables {#predeclared-global-variables}

Predeclared global variables can be used in any contract scope and these global
variables can be specified as immutable during compilation, which is mutable by
default.

Predeclared global variables include:

- `$original_contract` - name of the contract that initially processed the
  transaction. It means the contract is called during transaction validation if
  the variable is an empty string. To check whether the contract is called by
  another contract or directly by the transaction, you need to compare the
  values of $original_contract and $this_contract. It means that the contract is
  called by the transaction if they are equal.
- `$this_contract` - name of the contract currently being executed.
- `$stack` - contract array stack with a data type of [array](#spec-typename),
  containing all contracts executed. The first element of the array represents
  the name of the contract currently being executed, while the last element
  represents the name of the contract that initially processed the transaction.
- `$result` - assigned with the return result of the contract.

### Typename {#spec-typename}

All variables have types, and type names are used to represent the data types of
variables.

> `Type` = `Typename` | `TypeList` .
>
> `Typename` = "int" | "string" | "float" | "bool" | "bytes" | "address" |
> "money" | "array" | "map" | "file" .
>
> `TypeList` = `Typename` \{ ("," \| " ") `Typename` } .

The following type names are reserved and cannot be used as identifiers,
equivalent to the corresponding types in the Golang language.

- **int** - int64, zero value is `0`.
- **string** - string, zero value is `""`.
- **float** - float64, zero value is `0.0`.
- **bool** - bool, zero value is `false`.
- **bytes** - []byte, zero value is `[]byte`.
- **array** - []interface{}, zero value is `[]`.
- **map** - map[string]interface{}, zero value is `map[]`.
- **address** - int64, zero value is `0`.
- **money** - [decimal.Decimal](https://github.com/shopspring/decimal), zero
  value is `0`.
- **file** - map[string]interface{}, zero value is `map[]`.

#### Object and array literals {#object-and-array-literals}

`array` and `map` types can be created using `[]` and `{}` operators or
specified elements.

`array` type index must be `int`. `map` type index must be `string`. If a value
is assigned to an index greater than the current maximum index of the `array`
element, an empty element will be added to the array. The initialization value
of these elements is `nil`.

```go
var arr array m map
arr = [1,2,3]
arr[0] = 4
m = {"key": "value"}
m = {"key": myfunc()} // invalid
m = {"key": arr[0]} // invalid
m["key1"] = arr[5] // m["key1"] = nil
```

### Operator {#spec-operator}

An operation expression consists of an operator and an operand. Needle supports
the following operation operators: arithmetic operators, comparison operators,
logical operators, bitwise operators, and assignment operators.

Follow are the currently supported operators:

- arithmetic operators: `+`, `-`, `*`, `/`, `%`, `++`, `--`;
- comparison operators: `==`, `!=`, `>`, `>=`, `<`, `<=`;
- logical operators: `&&`, `||`, `!`;
- bitwise operators: `&`, `|`, `^`, `<<`, `>>`;
- assignment operators: `=`, `+=`, `-=`, `*=`, `/=`, `%=`, `&=`, `|=`, `^=`,
  `<<=`, `>>=`.

The priority of the operators is from high to low:

- `++`，`--`, `!`；
- `*`，`/`，`%`；
- `+`，`-`；
- `<<`，`>>`；
- `<`，`<=`，`>`，`>=`；
- `==`，`!=`；
- `&`；
- `^`；
- `|`；
- `&&`；
- `||`；
- `=`，`+=`，`-=`，`*=`，`/=`，`%=`，`&=`，`|=`，`^=`，`<<=`，`>>=`；

The result type of the operation is the same as the type of the operand. Except
for comparison operators and logical operators, their result type is `bool`. In
logical expressions, the result type will be automatically converted to a
logical value, if the operand type is not the default value, and the result is
`true`.

`a += b` is equivalent to `a = a + b`, `-=`, `*=`, `/=`, `%=`, `&=`, `|=`, `^=`,
`<<=`, `>>=` are also defined in this way. `a++` is equivalent to `a += 1`.

Even if the types of the two operands are different, Needle allows the use of
operators in expressions. In this case, the operands will be converted to the
same type and then the operation will be performed. For example, to calculate
`z = x + y`, where `x` is of type `int` and `y` is of type `float`, `x` and `y`
will both be converted to type `decimal`. Then the addition operation is
performed, and the result is of type `decimal`, which is then converted to type
`float` and assigned to `z`.

It should be noted that when performing floating-point operations, the issue of
precision loss should be considered to avoid incorrect results.

The following lists the operators and result types between operands of different
types:

| operand                       | x       | y       | z       |                            |
| ----------------------------- | ------- | ------- | ------- | -------------------------- |
| not(`!`)                      | -       |         | bool    | y to bool                  |
| unary(`+`,`-`)                | -       | int     | int     |                            |
|                               | -       | float   | float   |                            |
| `<<` , `>>`                   | int     | int     | int     |                            |
| `&`,`^`,`｜`                  | int     | int     | int     |                            |
| `++` , `--`                   | int     | int     | int     |                            |
| `+`,`-`,`*`,`/`,`%`           | string  | string  | string  | (only `+`)                 |
|                               | string  | int     | int     | x to int                   |
|                               | string  | float   | float   | x to decimal, y to decimal |
|                               | float   | string  | float   | x to decimal, y to decimal |
|                               | float   | int     | float   | x to decimal, y to decimal |
|                               | float   | float   | float   | x to decimal, y to decimal |
|                               | int     | string  | int     | y to int                   |
|                               | int     | int     | int     |                            |
|                               | int     | float   | float   | x to decimal, y to decimal |
|                               | decimal | string  | decimal | y to decimal               |
|                               | decimal | int     | decimal | y to decimal               |
|                               | decimal | float   | decimal | y to decimal               |
|                               | decimal | decimal | decimal |                            |
| `&&`,`\|\|`                   |         |         | bool    | x to bool, y to bool       |
| `==` ,`!=` ,`<`,`<=`,`>`,`>=` | nil     | nil     | bool    | only(`==` ,`!=`)           |
|                               | bool    | bool    | bool    | only(`==` ,`!=`)           |
|                               | string  | string  | bool    |                            |
|                               | string  | int     | bool    | y to string                |
|                               | string  | float   | bool    | y to string                |
|                               | string  | decimal | bool    | y to string                |
|                               | float   | string  | bool    | x to decimal, y to decimal |
|                               | float   | int     | bool    | x to decimal, y to decimal |
|                               | float   | float   | bool    | x to decimal, y to decimal |
|                               | float   | decimal | bool    | x to decimal               |
|                               | int     | string  | bool    | y to int                   |
|                               | int     | int     | bool    |                            |
|                               | int     | float   | bool    | x to decimal, y to decimal |
|                               | int     | decimal | bool    | y to int                   |
|                               | decimal | string  | bool    | y to decimal               |
|                               | decimal | int     | bool    | y to decimal               |
|                               | decimal | float   | bool    | y to decimal               |
|                               | decimal | decimal | bool    |                            |
|                               |         |         |         |                            |

### Slice {#spec-slice}

The slice operation only applies to the types `array`, `string`, and `bytes`.
The slice operator `[low:high]` is used to get a part of the array.

```go
arr[low:high]
```

The range of the index must be positive. If `0<=low<=high<=len(arr)`, the index
range is valid, otherwise the index range is invalid. For convenience, any index
can be omitted. The omitted index will be replaced by the first index or the
last index of the array.

```go
var a b c d e array str strA string
a = [1,2,3,4,5]
b = a[1:3] // b = [2,3]
c = a[1:] // c = [2,3,4,5]
d = a[:3] // d = [1,2,3]
e = a[:] // e = [1,2,3,4,5]

str = "abcd"
strA = str[1:3] // strA = "bc"
```

### Increment and Decrement {#spec-increment-and-decrement}

`++` and `--` increment and decrement the variables of type `int`, `float`, and
`money`, which can increase or decrease the variable value by 1.

```go
var a int
a = 1
a++ // a = a + 1
```

### Control Statement {#spec-control-statement}

Control statements are used to control the execution flow of the program,
including return statements, if statements, while statements, break statements,
and continue statements.

> `ControlStmt` = [ReturnStmt](#return-statement) \| [IfStmt](#if-statement)
> \| > [WhileStmt](#while-statement) \| [BreakStmt](#break-statement) \| >
> [ContinueStmt](#continue-statement) .

In if statements, the conversion from non-boolean types to boolean types is
supported. The following rules convert boolean types to `false`, otherwise
`true`. So, code like `if 1 {}` is valid.

- `int` and `float`, `money`, `string`, `address` type values are equal to the
  zero value.
- `array` and `map`, `bytes`, `file` type values are equal to nil or their
  length is zero.

#### Return statement {#return-statement}

The `return` statement is used in the function body to terminate the execution
of the function prematurely. If the function declares result parameters, the
`return` statement must return the same type and number of values.

> `ReturnStmt` = "return" [ExpressionList](#spec-expression) .

```go
func add(a , b int) int {
    return a + b
}
```

#### If statement {#if-statement}

`if` statement executes the code block based on the value of the boolean
expression. If the expression evaluates to `true`, the `if` code block is
executed, otherwise the `else` code block is executed.

`elif` is actually equivalent to `else if`, it must be defined before the `else`
statement.

> `IfStmt` = "if" [Expression](#spec-expression) >
> [CodeBlockStmt](#spec-codeblock) \{ `ElIfStmtList` } [`ElseStmt`] .
>
> `ElIfStmtList` = "elif" [Expression](#spec-expression) >
> [CodeBlockStmt](#spec-codeblock) .
>
> `ElseStmt` = "else" [CodeBlockStmt](#spec-codeblock) .

```go
if a > b {
    Println("a is greater than b")
} elif a == b {
    Println("a and b are equal")
} else {
    Println("b is greater than a")
}
```

:::tip

You should note that the boolean expression in the `if` statement does not
require parentheses `()`.

:::

#### while statement {#while-statement}

The `while` statement provides the ability to repeatedly execute a code block as
long as the expression evaluates to `true`. The condition is evaluated before
each iteration.

> `WhileStmt` = "while" [Expression](#spec-expression) >
> [CodeBlockStmt](#spec-codeblock) .

```c
var a int
while a < 10 {
    a++
}
```

:::tip

If the condition is always `true`, the `while` statement will be executed
repeatedly. Therefore, it should include a condition that is `false` at some
point.

:::

#### Break statement {#break-statement}

The `break` statement terminates the innermost `while` statement.

> `BreakStmt` = "break" .

```go
var a int
a = 1
while a < 10 {
    if a == 5 {
        break
    }
    a++
}
```

#### Continue statement {#continue-statement}

`continue` statement skips the remaining code of the innermost `while` statement
and continues with the next iteration of the loop.

> `ContinueStmt` = "continue" .

```go
var a int
a = 1
while a < 10 {
    if a == 5 {
        continue
    }
    a++
}
```
