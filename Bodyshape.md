Body Shape  
=====  
The "new" body shape system (since 0.5.2) is based on ratios and body fat (called "salo" in the code and cheat menu) and is designed to change slowly.  
It works by splitting strength, agility, endurance, and fat into two separate stats, the main stat and the body shape stat.  
   
* First, the main stats you see: strength, agility, and endurance (stren, agil, vital) which drive the body shape stats; strenbuf, agilbuf, vitalbuf, which are changed 1 point at a time at midnight and are used to determine the ratios of various body parts: band to waist, waist to hips, and hips to height.  
   
* The other stat is 'fat', which you do not see with out hunting, and can vary all over the place through out the day, but again, only 1 point a day goes to the body shape stat, 'salo', which is used to move hips off the center point defined by the hips to height ratio.  
   
* If "salo" gets low enough, you're give the option to switch from the default image set to a "fit" image set. If taken; while "salo" stays in that low range, hip size is driven by the relationship of strength to agility ((strenbuf - agilbuf) / 2). If you select "no" three times, it does not ask you again.  
   
* If your magic gets high enough (5+) and "salo" is about to leave your current range category; you will be presented with the option to move fat to bust. If taken, every time "salo" is about to rise out of your current range category, it is instead transferred to bust; until a target is reached. You can repeat this process until you hit the max. If you select "no" three times, it does not ask you again.

------------
back to [Home](home) page.