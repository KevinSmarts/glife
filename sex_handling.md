In the game are mainly traced the sex affairs of player character (pc) with other non-player characters (npc). The reason for tracing is evolution of pc and statistics. 

## Sex event sequence
* gs 'BoyStat','param1',['param2']  
 the routine boyStat sets variables related to parameters of Pc's sexual partner(s). They are used mainly in routine 'arousal'
* gs 'arousal','param1' ... ['param8']  
this routine describes evolution of the sex event .. time, excitement, orgasm and more.  It is called usually several times.
* gs 'cum_call','param1', ..  
 this routine handles first of all a sperm deposit. It can be called several times, especialy when the semen ends on/in different parts of PC body (like mouth and face).
* gs 'arousal','end'  
 the routine 'arousal' called with parameter 'end' should clean a few variables, which are set during the sex event.

## Routine description
One of the core routines is **Cum_Manage**, which handle placing of cum all over pc's body and in her cavities. This routine also solve the reliability of condoms in dependency at the penis size (the game supposes one size of condoms).

This routine can be called with parameter: **'cumeater'** or **'cumgather'** but generally is called without parameters and all the necessary variable has to be set in advance.

Necessary variables are:
* $boy        ... source of sperm
* spafinloc   ... target place

Optional variables are:
* sexvolume   ... amount od sperm, default = 40 (4 ccm)
* sexspecpot  ... potency of sperm, if not defined the value is taken from nps predefined  sexspecpot = npc_spermpot[$boy] or it is randomly generated
* cumprecheck ... if this parameter is set, the deposit is always only precum and pc is not aware that it can be potent
* sexunaware  ... this parameter states whether pc is aware of the act
* sexpartkno  ... this parametr state whether the npc is familiar with pc 
* sexcontra   ... kind of intraception


* vibratorIN
* analplugIN

The front end for **Cum_Manage** is **cum_call**, which allows to input the necessary values as a parameter and which prepares the apropriate variables and finaly calls the **Cum_Manage**


<Table width ="400">
<tr><th width ="200"><b>Target place</b></th><Th width ="100"><b>Cum_Manage</b></th><th width ="100"><b>cum_call</b></th></tr>
<tr><th></th><Th><b>spafinloc =</b></th><th><b>$ARGS[0]</b></th></tr>
<tr><td>In your Vagina</td><TD>0</td><td>''</td></tr>
<tr><td>On your labia</td><TD>1</td><td>'labia'</td></tr>
<tr><td>On your panties over your vagina</td><TD>2</td><td>'pantyfront'</td></tr>
<tr><td>In your anus</td><TD>3</td><td>'anus'</td></tr>
<tr><td>On your butt</td><TD>4</td><td>'butt'</td></tr>
<tr><td>On your panties over your butt</td><TD>5</td><td>'pantyrear'</td></tr>
<tr><td>On your clothes in your groin area</td><TD>6</td><td>'clothesgroin'</td></tr>
<tr><td>On your clothes</td><TD>7</td><td>'clothes'</td></tr>
<tr><td>On your back</td><TD>8</td><td>'back'</td></tr>
<tr><td>On your legs</td><TD>9</td><td>'legs'</td></tr>
<tr><td>On your arms</td><TD>10</td><td>'arms'</td></tr>
<tr><td>On your face</td><TD>11</td><td>'face'</td></tr>
<tr><td>Inside your mouth</td><TD>12</td><td>'mouth'</td></tr>
<tr><td>On your hands</td><TD>13</td><td>'hands'</td></tr>
<tr><td>On your stomach</td><TD>14</td><td>'stomach'</td></tr>
<tr><td>On your breasts</td><TD>15</td><td>'breasts'</td></tr>
<tr><td>In your hair</td><TD>16</td><td>'hair'</td></tr>
<tr><td>In a condom in your vagina</td><TD>17</td><td>'internalcondom'</td></tr>
</table>
<br><br>
**cum_call** has got following parameters:
<Table width ="400">
<tr><th width ="50"><b>order</b></th><Th width ="100"><b>type</b></th><th width ="250"><b>function</b></th></tr>
<tr><td>1</td><TD>string</td><td>name of the target location according the table above</td></tr>
<tr><td>2</td><TD>string</td><td>code name of the sexual partner like 'A9' or '9'</td></tr>
<tr><td>3</td><TD>number</td><td>partner knowledge: 0 - unknown partner, 1 - familiar partner, 2 - pc isn't aware about sex</td></tr>
<tr><td>4</td><TD>number</td><td>contraception, if left blank it will use the default, value 1 .. 7</td></tr>
<tr><td>5</td><TD>number</td><td>argument is used for changing the potency, -1 for unable to impregnate, default is 10,000</td></tr>
<tr><td>6</td><TD>number</td><td>parametr sets the volume of sperm, default is 40 (4ml)</td></tr>
</table>

<br>
List of values for contraception and their meaning 
1.  He thought, that pc was on the pill but she wasn't.
2.  Pc is on the Pill
3.  Condom. Condoms can still fail vy the code.
4.  The Condom Broke. This is mostly used to check if cum manage resulted in a broken condom.
5.  The Condom Slipped off. Like 4, this is mostly to check if the contraception of 3 had a failure. 
6.  The condom was sabotaged but the pc shouldn't know that
7.  The Condom was sabotaged by the pc

<br>
<br>

These two codes make the same:

> <p><b>gs 'cum_call','anus','A10',1</b> ,2,5000,25</p> 

||

> <p>
> <b>gs 'boyStat', 'A10'</b><br>
> <b>spafinloc = 3</b><br>
> sexvolume = 25<br>
> sexspecpot = 5000<br>
> <b>sexpartkno = 1</b><br>
> sexcontra = 2<br>
> <b>gs 'Cum_Manage'</b>
> </p>


Usually only the bold parts are used.

However the following code, which handle precum, can be writen only in this way:

> <p>
> gs 'boyStat', 'A10'<br>
> spafinloc = 0<br>
> <b>cumprecheck = 1<b><br>
> <b>gs 'Cum_Manage'<b>
> </p>

According to the last agreement, this action should not be used separate and  it is included into "arousal vaginal" act, its occurrence there is driven by random generator.


<br>Some more remarks:

**cum_call** calls the <b>boyStat</b>, but on the other hand it preserves variable **$boy**

**Cum_Manage** sets to zero following parameters: **cumprecheck**,**spafinloc**, and **sexvolume**


<br><br>
The second core routine is **arousal**. This routine is used much widely than the preceding two and it cares about emotional and physical changes during any sexual stimulation. 
**Arousal** has got the folowing parameters:

<Table width ="400">
<tr><th width ="50"><b>order</b></th><Th width ="100"><b>type</b></th><th width ="250"><b>function</b></th></tr>
<tr><td>1</td><TD>string</td><td>name of the action which causes arousal</td></tr>
<tr><td>2</td><TD>number</td><td>duration of the action in minutes</td></tr>
<tr><td>3</td><TD>string</td><td>name of variable which represents lenght of penis or toy in format 'dick...'. It makes sense only for 'bj', 'anal' and 'vaginal' actions. </td></tr>
<tr><td>3 .. 9</td><TD>string</td><td>list of affected fetishes</td></tr>
</table>

<br><br>
List of keywords for actions:

'masturbate', 'porn', 'voyeur', 'kiss', 'breasts', 'massage', 'foreplay', 'cuni', 'rimming', 'trib', 'anal', 'anal_finger', 'anal_fist', 'anal_dildo', 'anal_strap', 'anal_vibe', 'vaginal', 'vaginal_finger', 'vaginal_fist', 'vaginal_dildo', 'vaginal_strap', 'vaginal_vibe'

also when giving any of the following:

'flash_breasts', 'flash_pussy', 'flash_ass', 'kiss_give', 'breasts_give', 'massage_give', 'foreplay_give', 'cuni_give', 'rimming_give', 'anal_finger_give', 'anal_fist_give', 'anal_dildo_give', 'anal_vibe_give', 'anal_strap_give',
'vaginal_finger_give', 'vaginal_fist_give', 'vaginal_dildo_give', 'vaginal_strap_give', 'vaginal_vibe_give', 'hj', 'bj', 'footjob'

List of keywords for fetishes

'maso', 'bound', 'beast', 'exhibitionism', 'rough', 'prostitution', 'dom', 'sub', 'incest', 'feet', 'lesbian', 'group', 'gangbang', 'humiliation', 'deepthroat', 'unknown'


Format to use: 

> gs 'arousal', 'act', duration, 'fetish', 'fetish', 'fetish', 'fetish', 'fetish', 'fetish', 'fetish' 

or 

> gs 'arousal', 'act', duration, 'dick*', 'fetish', 'fetish', 'fetish', 'fetish', 'fetish', 'fetish' 
