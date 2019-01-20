# Table of Contents
  - [Basic concepts](#basic-concepts)
  - [Reference](#reference)
    - [Locations](#locations)
    - [Transitions](#transitions)
    - [Variables](#variables)
    - [Operators](#operators)
      - [Operator precedence](#operator-precedence)
    - [Arrays](#arrays)
      - [Array functions and operators](#array-functions-and-operators)
    - [Syntax](#syntax)
    - [Strings](#strings)
    - [Conditionals](#conditionals)
    - [Built-in functions](#built-in-functions)
    - [User-defined functions](#user-defined-functions)
    - [Loops, and transitions inside a location](#loops-and-transitions-inside-a-location)
    - [Order of execution](#order-of-execution)
    - [System locations](#system-locations)
    - [Dynamic code](#dynamic-code)
    - [Text output](#text-output)
    - [Actions](#actions)
    - [Inventory](#inventory)
    - [Multiple selections](#multiple-selections)
    - [Formatting](#formatting)
    - [Reserved keywords](#reserved-keywords)

## Basic concepts
The QSP user interface consists of five parts:
- the main description area
- inventory (or object area)
- action area
- additional description area
- manual text input

Only the first four are used by Girl Life.

Games consist of *locations*, which can be used to represent physical areas (a room, street corner, the Moon) as well as more abstract concepts (dream sequence, action scene, passage of time). Each location has a unique name that allows to refer to it from other parts of the game. When working on Girl Life locations are found in the `locations/` directory, one file per location.

Locations consist of a *description* that the player sees when they enter, *actions* that the player can choose to perform there, and *code* to be executed.

Descriptions are flavor text used to facilitate the flow of the story. They can include static or animated images, background sounds, links that lead to actions or other areas, as well as custom formatting.

Actions are something the player can choose to do in order to progress the story. They appear in the action area of the user interface and have associated code that describes what they do in terms of the game world.

Code is used to keep track of the state of the game world and to update it in response to the player's actions. It consists of
* *variables*: a place to store information such as a character's name, current time in the game world, how far along you are in a story line and so on
* *operations* on variables: arithmetic operations on numeric variables (for example, gaining or losing weight) and text operations (for example joining a variable with the character's first name and the variable with their last name into a new variable that contains the full name)
* *conditions*: a way to specify the prerequisites for game events and actions (for example, *if* inventory contains food *then* add an action to eat it *else* display flavor text that the player should start looking for food)

## Reference
The language reference is based mostly on the [official documentation](http://wiki.qsp.su/help:qsp).

### Locations
Locations must have an explicit start and end. A location begins with a line starting with `#` followed by the location name. It ends with a new line starting with `-`.
```
# location_name

...location content goes here...

-
```
Any text after the `-` until the start of the next location is ignored.

Location names can be any valid string and are case-insensitive. The following prefixes can be used:
* `!name` or `$name` - system location without a database
* `#name` - location with a database
* `^name` - sub-location that is a part of another location:

```
# apartment
<...>
--- apartment

# ^kitchen
<...>
--- apartment/kitchen

# ^bedroom
<...>
--- apartment/bedroom

# ^^closet
<...>
--- apartment/bedroom/closet
```

#### :warning: Note
Girl Life stores each location in a separate file with a matching name, so the convention is to avoid spaces and special characters in location names.

### Transitions
In order to transition from one location to another the following functions can be used:

`goto` or `gt` replaces the main description and action area with those of the new location. Optional arguments (up to 9) are available in the new location from the `ARGS` array.
```
gt 'location without args'
gt 'location with args', 'arg1', 'arg2', 123
```

`xgoto` or `xgt` does not clear the main description area and appends the new location's description to the existing text. Otherwise identical to `goto`.

#### :bulb: Tip
A common idiom in Girl Life is to split a location into multiple blocks and move around them by `gt`-ing to the same location with the block name as the first argument.
```
# example
if $ARGS[0] = 'blockA':
  'You are in block A'
  act 'Go to block B': gt 'example', 'blockB'
end

if $ARGS[0] = 'blockB':
  'You are in block B'
  act 'Return to block A': gt 'example', 'blockA'
end
-
```

### Variables
Variables in QSP can be of two types: number (32-bit signed integer from -2147483648 to 2147483647) or text string (maximum length depends on the player and can be 32KB or 2GB).

Number and string variables with the same name can coexist; string variable names are always prefixed with `$`. Variables can be used without having been initialized, in which case a default value will be used: `0` for numbers and `''` (empty string) for text.

When used in conditional expressions numeric variables correspond to `false` when the value is `0`, and `true` for all other values.

Variable names adhere to the following rules:
* Must not begin with a digit.
* Must not be the same as a [reserved keyword](#reserved-keywords).
* Must not include whitespace or the following symbols: `!` `:` `&` `=` `<` `>` `+` `-` `*` `/` `,` `'` `"` `(` `)` `[` `]` `{` `}`. In order to delimit multiple words in a variable name the underscore (`_`) can be used.
* Are case-insensitive, `varname` and `varName` are equivalent.

Variables are initialized by using the `set` or `let` keywords, or by simply assigning the value. The following are equivalent:
```
let varName = value
set varName = value
varName = value
```

Variables can be uninitialized by using the `killvar` function:
```
killvar 'varName'
```

#### :poop: Technical
Due to implementation details, number and string variables that share the same name are related. Resetting the numeric variable `varName` using `killvar` will also reset the string variable `$varName`.

Under the hood each variable is actually a single element array. The following are equivalent:
```
varName = value
varName[0] = value
```

### Operators

* `+`*num*, `-`*num* - unary plus/minus. `-` inverts the sign of the following numeric expression (negative numbers become positive and vice versa).
* `+`, `-`, `*`, `/` - arithmetic operations on numeric expressions. Addition, subtraction, multiplication and division.
* *numA* `mod` *numB* - modulo operator. Returns the remainder of the division of *numA* by *numB*.
* Comparison operators:
 * `=` true if expressions are equal.
 * `!` true if expressions are not equal.
 * `<` true if the expression on the left side of the operator is smaller than the one on the right side.
 * `>` true if the expression on the left side of the operator is larger than the one on the right side.
 * `<=` true if the expression on the left side of the operator is smaller or equal to the one on the right side.
 * `>=` true if the expression on the left side of the operator is larger or equal to the one on the right side.
* `obj` *$str* - true if inventory contains item *$str*.
* `loc` *$str* - true if the game contains a location named *$str*.
* `no` *num* - negation. Same as `-1 - num`. Since the above mentioned comparison operators all return `-1` when they are true, `no` can be used as logical negation.
* *numA* `or` *numB* - bitwise OR. Usually used as logical OR.
* *numA* `and` *numB* - bitwise AND. Usually used as logical AND.
* *$str* `&` *$str* - string concatenation. Used to combine two or more strings into one.

Examples (comments are marked with `&!`):
```
x = 5
y = 6
(x ! y) or (x <> y)   &! returns -1 (true)
x or y                &! binary 101 OR 110 = 111; returns 7
x and y               &! binary 101 AND 110 = 100; returns 4
y mod x               &! 11/5 = 2 with remainder 1; returns 1

obj 'food'            &! returns -1 (true) in case inventory contains an object named 'food', otherwise returns 0 (false)
loc 'home'            &! returns -1 (true) in case the game contains a location named 'home', otherwise returns 0 (false)

res = x*y + y*-x/2    &! (5*6) + (6 * (-5) / 2) = 15; returns 15
res = no x = y        &! no 0 = -1; returns -1 (true)
 
15*5/2                &! (15*5)/2 = 75/2 = 37
15/2*5                &! (15/2)*5 = 7*5 = 35

$firstName = 'John'
$lastName = 'Doe'
$firstName + ' ' + $lastName    &! returns the string 'John Doe'
```

#### Operator precedence
From highest to lowest. Operators on the same line have the same precedence and are executed from left to right.
* `(`*expression inside parentheses*`)`
* `+` `-` (unary)
* `*` `/`
* `mod`
* `+`, `-` (binary)
* `=` `<` `>` `!` `<>` `<=` `>=` `=<` `=>`
* `obj` `loc` `no`
* `and`
* `or`
* `&`

#### :poop: Technical
Maximum depth of nested parentheses is 30. Maximum number of operators in an expression is 100.

### Arrays
A QSP array is a collection of values. Each element of the array has a unique index that can be used to access it. Indexes can be either numeric or strings, but it is not recommended to mix numeric and string indexes in the same array.

The syntax for adding elements to an array and retrieving them is as follows:
```
! create array of strings
$child_names[0] = 'Jack'
$child_names[1] = 'Jill'

! add an element to the end of the array
$child_names[] = 'Slagathor'
! which would have been the same as
$child_names[2] = 'Slagathor'

! get the first element (note that numeric indexes start from 0, not 1)
$first_child = $child_names[0]

! get the third element
$third_child = $child_names[2]

! get the last element
$last_child = $child_names[]

! array of numbers with string indexes
child_ages['Jack'] = 10
child_ages['Jill'] = 8
child_ages['Slagathor'] = 500
```

Arrays are useful for cases when you have a large amount of uniform information and it's unwieldy to give each element its own variable name. Any data that can be displayed in a table should probably be stored in arrays - in this case each column is a different array and row ids are the array indexes. Same goes for cases when you have multiple variables named `var1, var2, var3, ...` or `varA, varB, varC, ...` - you can replace them with a single array `vars` and access the items like `vars[1]` or `vars['c']`.

For example, Girl Life uses arrays for the wardrobe: it's a perfect fit because you may have an arbitrary amount of clothing items, and giving each item its own variable name is not convenient. Instead of having dozens of variables like `$clothing1_description`, `$clothing2_description`, you create a single array `$clothing_descriptions` and then add any newly purchased items to it.

The great benefit here is that when you need to perform the same operation on each item - like displaying it on the wardrobe screen - you don't have to write a series of `if` statements. You can go from 0 to the last element of the array in a loop and only write the code once:
```
'You have the following clothes in your wardrobe':

! bad approach
if clothing1_purchased:
    $clothing1_description
    act 'Put on ' & $clothing1_description: ...
end
if clothing2_purchased:
    $clothing2_description
    act 'Put on ' & $clothing1_description: ...
end

! better approach
index = 0
amount = arrsize('$clothing_descriptions')
:start
if index < amount:
    $clothing_descriptions[index]
    act 'Put on ' & $clothing_descriptions[index]: ...
    index += 1
    jump 'start'
end
```
Note how the code that uses arrays doesn't need to be updated if more elements are added to `$clothing_descriptions`. We just go through the list of available items and perform the same operation on each. Whether there's 0 items or 1000, the code remains the same and is simple to maintain.

#### Array functions and operators
`killvar` '*arr_name*' - deletes the whole array.
`killvar` '*arr_name*', *index* - removes the item corresponding to *index* from the array. Removing an item with a numeric index moves all following items closer to the beginning of the array - an array with numeric indexes can never have gaps.

`copyarr` '*target*', '*source*', *index*, *amount* - copies *amount* elements starting from *index* from *source* array to *target* array. If *amount* is not specified, all items up to the end of the *source* array are copied. If *index* is not specified, the whole array is copied.

`arrsize(`'*array_name*'`)` - returns the number of elements in the array named *array_name*.

`arrpos(`*index*, '*array_name*', *value*`)` - returns the index of *value* in the array *array_name* if it exists. The search starts from *index*. In case an element is not found the function returns `-1`.  
<B>Note</B>: In Quest player for Android by Nex, or the upcoming Qgen6, the parameter sequence changed:  
`arrpos(`'*array_name*', *value*, *index*`)`

`arrcomp(`*index*, '*array_name*', '*pattern*'`)` - returns the index of the first element of array *array_name* that matches the regular expression *pattern*. The search starts from *index*. In case an element is not found the function returns `-1`.

### Syntax
Operations are performed sequentially, one by one. Each operation is usually written on its own line, and related operations are often grouped and separated by empty lines:
```
apples  = 5
pears   = 10
oranges = 3

act 'Eat apple':  apples  -= 1
act 'Eat pear':   pears   -= 1
act 'Eat orange': oranges -= 1
```

If needed, multiple operations can be written on the same line, in which case they have to be separated by `&`:
```
act 'Eat one of each': apples -= 1 & pears -= 1 & oranges -= 1
```
It is highly recommended to have one operation per line for readability, outside of some cases that require all operations to be on the same line.

Content of `if`, `act` and other blocks should be indented to the right in order to visually distinguish the start and end of the block. This is purely a readability improvement; the code is executed exactly the same regardless of the indentation. Common indentation sizes are 2 or 4 spaces, or a TAB.
```
if apples = 0:
    'We are all out of apples'
    mood -= 10
end
```

In rare cases it might be necessary to split a single line of operations into multiple lines. Although possible, this should be avoided as it is usually a sign of overcomplicated code. Putting ` _` (an empty space and an underscore) at the end of a line means the player application will consider these two lines as one:
```
if a > 1 and b > 2 and c > 3: p 'a, b and c are bigger than 1, 2 and 3' & gt 'nextStage'
```
is the same as
```
if a > 1 _
  and b > 2 _
  and c > 3: p 'a, b and c are bigger than 1, 2 and 3' _
  & gt 'nextStage'
```
Note that any potential error messages will also consider these to be a single line and will always report the number of the initial line.

#### :poop: Technical
You might need to put two spaces before `_` at the end of the line in order to avoid some player applications concatenating the two lines without the space inbetween, resulting in bugs or broken syntax.

#### Comments
Sometimes it is useful to leave notes, explanations or future plans inside a location. This concept is called *comments*. Comments are intended purely for humans to read and have no effect on the execution of the code. This means that they are also a good way to quickly exclude a block of code from execution during testing without actually removing it from the location. Comments begin with a `!`.

Comments can take up a single line:
```
apples  = 5
pears   = 10
oranges = 3
! TODO: add bananas
```
or multiple lines:
```
apples  = 5
!'pears   = 10
oranges = 3'

! both pears and oranges are ignored by the same comment, because they are inside quotes
```
or follow on the same line as an operation:
```
apples  = 5
pears   = 10 &! too many pears?
oranges = 3
```
#### :poop: Technical
Note that sometimes inline comments have to be separated from the preceding code by a `&`, because `!` is also the negation operator and in case of ambiguity it will be interpreted as such.

#### :poop::poop::poop: Never do this
Multi-line comments can take grotesque forms:
```
!'this part of the comment is inside
single quotes' but "this is still part
of the same comment because sometimes
life is unfair." Oh yeah, {curly brackets
also count}. This is still the same comment.
```
All of the above is a single comment. Don't do this.

#### Statements and functions
*Statements* are keywords (words reserved by QSP and unavailable for use as a variable or location name) that perform a certain operation, sometimes taking one or more values as arguments. Statements do not return a result, their purpose is to modify the state of the game.
```
! examples of statements
pl('this text will be printed')
clear()

! these are equivalent
addobj 'clothes', 'pics/clothes.jpg'
addobj('clothes', 'pics/clothes.jpg')
```

*Functions* are keywords that perform certain operations and return the result to be used by other code, usually without modifying the state of the game in the process. They often take one or more arguments.
```
largest = max(1, 2, 4)
randomPercentage = rand(0, 100)
ownedItems = countobj
```

#### :warning: Note
While not required, it is highly recommended to prefix the function name with a `$` if it returns a string value. This helps code readability by annotating the expected type of the return value.
```
! these are equivalent
pl str(43)
pl $str(43)
```

#### :poop: Technical
Maximum number of arguments for statements and functions is 10.

### Strings

### Conditionals

### Built-in functions

### User-defined functions

### Loops, and transitions inside a location

### Order of execution

### System locations

### Dynamic code

### Text output

### Actions

### Inventory

### Multiple selections

### Formatting

### Reserved keywords
```
act
addlib
addobj
addqst
and
arrcomp
arrpos
arrsize
$backimage
bcolor
cla
clear
*clear
close
clr
*clr
cls
cmdclear
cmdclr
copyarr
$counter
countobj
$curacts
curloc
debug
delact
dellib
delobj
desc
disablescroll
disablesubex
dynamic
dyneval
else
elseif
exit
fcolor
$fname
freelib
fsize
func
getobj
gosub
goto
gs
gt
if
iif
inclib
input
instr
isnum
isplay
jump
killall
killobj
killqst
killvar
lcase
lcolor
len
let
loc
$maintxt
max
menu
mid
min
mod
msecscount
msg
nl
*nl
no
nosave
obj
$onactsel
$ongload
$ongsave
$onnewloc
$onobjadd
$onobjdel
$onobjsel
opengame
openqst
or
p
*p
pl
*pl
play
qspver
rand
refint
replace
rgb
rnd
savegame
selact
selobj
set
settimer
showacts
showinput
showobjs
showstat
$stattxt
str
strcomp
strfind
strpos
trim
ucase
unsel
unselect
usehtml
$usercom
user_text
usrtxt
val
view
wait
xgoto
xgt
```