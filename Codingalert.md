Coding Changes, listed from 4.0 to 5.2 DEV, 2015/8/25  
  
I. Locations  
=====
1. [gorodok] split in 2, [pavResidential],[pavCommercial]  
  
  
II. Variable value or name:  
=====
1. range changed:  
son     old: 0~30 new:0~100  
energy	old: 0~25 new:0~100  
water 	old: 0~25 new:0~100  
sweat   old: 1~3  new:0~100  
vnesh   old:-10~50 new:-10~200. make threshold*4  
  
2. Variable name of tattoos:  
  check [obj_din] if $ARGS[0] = 'tattoos' for list  
  
  
III. Variable manipulate  
=====
1. semon  
Original:  
cumface +=1 ...etc  
  
New: use subfunction [cum_call]  
  
see file header for detail.  
  
for vaginal (in womb):  
`gs 'cum_call', '', $boyA`
  
on clothes:  
`gs 'cum_call', 'clothes', $boyA`
  
2. sex count  
Original:  
bj += 1   
  
New: use stat['***'] array:  
For bj:  
`stat['bj']+=1`
  
For Vaginal:  
`stat['vaginal'] += 1`
  
3. orgasm:  
Force orgasm, disregard  horny:  
`orgasm += 1 & horny = 0`
  
4. Body factor:  
check wiki:[BodyShape](http://git.tfgamessite.com/KevinSmarts/girllife-ecv/wikis/bodyshape)  
  
  
IV. Functions:  
=====
1. New clothing system:  
check wiki:[new clothing system](http://git.tfgamessite.com/KevinSmarts/girllife-ecv/wikis/FAQ#v-new-clothing-systems)  
  
2. female cycle, contraception and pregnancy:  
Check location [femcyc]  
  
3. Bimbo  
check wiki:[Bimbo](http://git.tfgamessite.com/KevinSmarts/girllife-ecv/wikis/FAQ#q2-6-what-is-bimbo-how-does-it-work-)  
  
4. Succubus  
check wiki:[Succubus](http://git.tfgamessite.com/KevinSmarts/girllife-ecv/wikis/succubus)  
  
5. horny  
(Direct copy Kevin Smart's post)  
OK, for the arousal code the use is a little different to the old method, it does the sex act and time, so you'd use something like this:  
  
`gs 'arousal', 'trib', 10`
  
That's 10 mins of tribalism, which can return a text reaction if orgasm is achieved, so it should go at the end of the text (instead of the usual before and be followed by a gs 'stat'  
It'll take a little getting used to, but as long as you use the correct act it handles everything. You should use a call like this for each action, then after the last act enter this:  
  
`gs 'arousal', 'end'`
  
This adds the stats for sex acts and 'fetishes'.  
The 'fetishes' are a number of additional factors that can affect the amount of arousal from acts depending on Sveta's preferences. These can be added to any scene where deemed appropriate in this style:  
  
`gs 'arousal', 'trib', 10, 'bound', 'sub'`
  
This would be just as the first example, but now Sveta's preferences for being bound and submissiveness can increase or decrease the amount of arousal applied.  
  
See, I told you it was easy, you can use upto 7 fetishes per scene if you really want to, but try and stick to the most prominent ones.  
Lastly you can override the orgasm if needed, with the orgasm override, use $orgasm_or = 'no' to turn orgasming off. This will remain off until you set it to '' or 'yes' or call 'arousal', 'end'.  
You can also force orgasm by setting $orgasm_or = 'yes', this will make Sveta orgasm on the next arousal call and reset the override automatically.  
  
Obviously this has not been tested normal gameplay yet and some acts may well need rebalancing and I have no idea how frequently it'll cause orgasming. It is possible if the orgasm exprerienced is very good for Sveta to become orgasmic and will keep having orgasms for every act . This could even carry over to following scenes if they occur soon afterwards. :shock:  
  
These instructions and recognised terms are listed at the start of the arousal file, please use this system in new events and I'll start rolling it out.  
