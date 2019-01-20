QSP is a fairly simple language and quite easy to pick up the basics, the best way is to have a look through the game code. If you are not familiar with it the following will get you set up:

- You will need the program QGen (http://qsp.su/attachments/qgen400b1.zip), this allows you to open the qsp file and view / edit the game locations
- From here it is quite simple to copy / paste the locations to a .txt file in notepad++ allowing editing with more advanced editing tools (This is the prefered process)
- Once you have edited a location and have a .txt file that you would like added to the game, you can post it to Mega (or similar) and post a link in the forum, or PM it to one of the devs and it will be posted to the development version for use in the next release. If you are familiar with Git repositories, you can commit it to the repo here (master branch)


Some coding guidelines:

- In QSP text will always be separated from code by apostrophes (') and well appear green in QGen.
- Actions are prefixed by the command act and separated from code by apostrophes (').
- You can send the player to different locations with gt (goto) followed by the file name (as a string separated by apostrophes) and follow it by upto 9 arguments, the first of which is often used to direct the player to a specific code chunk.
- You can also use gs (gosub) and dynamic to load additional locations to join the existing location, they will also return to the main location unless an action is used within them. Dynamics must be initialized before they can be call and stay in memory (inc. savegame data) unless cleared. The killvar command is used for this, but be careful with it, it can clear whole arrays in a blick of an eye. 
- When you use apostrophes in text, double them and they will show correctly.
- After the "if" clause or "act" + text, put a colon then what happens. It's the equivalent of THEN in BBC Basic, ie.

    if a > b and a > c : 'Player A wins!'

    act 'Go to results': gt 'results'

- Use the word "and" inside the "if" clause and an ampersand between instructions.
- You only need the "end" if you split it across multiple lines, if command through to instruction all on the same line qsp will assume an end, so you have to spilt when using if - elseif - else even if you drop the elseif or else.

### Window cleaning

* <b>cls</b> = <b>*clr & cla & clr & cmdclear</b> - clear screen and actions and additional_desc and input_line
* <b>cla</b> - clear action window. ('Actions')
* <b>clr</b>,<b>clear</b> - clear stat window. ('Additional desc')
* <b>*clr</b>, <b>*clear</b> - clear main window. ( none  )
* <b>gt</b>, <b>goto</b> clear both main and action window
* <b>xgt</b>, <b>xgoto</b> clear only action window
* <b>gs</b> doesn't clear any window


# Some Conventions

- Variables: bankAccount
- Location Names: blackjackPlay
- Comments: !!
    - This makes it easier for syntax highlighting

# Variable   
1. type:  
-  
there are 2 type of variables in QSP system, differ with $  
  
var = value  
$var = string  

2. Display  
-
If you want display variable, use <<$var>> in texts. The game engine will automatic show $var there.  
  
# Common used function    
<B>act</B> = <B>action</B> used to give options to player in action window.  
<B>gt</B> = <B>goto</B> used to send the player to loactions  
<B>gs</B> = <B>gosub</B>, like goto, but brings you back to same spot if there is no action.  
<B>if</B>, <B>elseif</B>, <B>else</B> will make bool check and exec corresponding scripts.  
  
if a <i>if</i> or <i>act</i> is more then one line, you need to add a <i>end</i> after the last line  
<hr>  
example: These 2 if will do the same. If your are new to coding, I would suggest you to use the 2nd one, and use "tab" or "space" to layout if and exec.  
```python
if rand(0,10) > 5 : msg 'rand bigger than 5'  & act 'OK' : gt 'test'
```
```python
if rand(0,10) > 5 :   
	msg 'rand bigger than 5'  
		act 'OK'
		gt 'test'
	end
end  
```
Another example for if, elseif, else and display variable  
```python
var_rand = rand(0,10)  
if var_rand > 5 :   
	msg '<<var_rand>> may be 10, 9, 8, 7, 6'  
elseif var_rand >= 3 :   
	msg '<<var_rand>> may be 5, 4, 3'  
else  
	msg '<<var_rand>> may be 2, 1, 0'  
end  
```

# Underwear actions
```python
gs 'underwear', 'dispose'
```
To remove and destroy

```python
gs 'underwear', 'remove'
```
To remove but keep available

```python
gs 'underwear', 'wear'
```
To put on anything removed in the remove action

With the bars or panties used you can specify the item using the itemname and number ie.
```python
gs 'panties', 'wear', 'cheap', 14
```

You can do the same things for just panties or bras by changing the 'underwear' to 'panties' or 'bras'.


Return to the [Home](home) page.