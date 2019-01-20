# Variables

The variables can be divided into several categories:
*  PC's variables - describe player character and her activity
 * [Some of the PS's variables related to skills](https://git.catrenelle.com/Kevin_Smarts/glife/wiki/skills)
*  NPC's variables - describe np characters, their relations to pc and their activity
*  Environment varaiables

If you want to add row into table, use this pattern or last row as a template:
```
 <tr>
  <td>Category</td>
  <td>Sub-category</td>
  <td>Title</td>
  <td>Obsolete</td>
  <td>Variable</td>
  <td>Description</td>
 </tr>
```

Note (2017 May 16): the table was created according the Excel file, which I found somewhere and now I cannot find the link. I have not checked all the variables mentioned there.

<table cellpadding=5 cellspacing=0 border=1>
 <tr>
  <th>Category</th>
  <th>Sub-category</th>
  <th>Title</th>
  <th>Obsolete</th>
  <th>Variable</th>
  <th>Description</th>
 </tr>
 <tr>
  <td>Appearance</td>
  <td>Base</td>
  <td></td>
  <td>glacol</td>
  <td>pcs_eyecol</td>
  <td>Eye Color</td>
 </tr>
 <tr>
  <td>Appearance</td>
  <td>Base</td>
  <td></td>
  <td>glaraz</td>
  <td>pcs_eyesize</td>
  <td>Eye size</td>
 </tr>
 <tr>
  <td>Appearance</td>
  <td>Base</td>
  <td></td>
  <td></td>
  <td>glass</td>
  <td>Weres glasses</td>
 </tr>
 <tr>
  <td>Appearance</td>
  <td>Base</td>
  <td></td>
  <td>lip</td>
  <td>pcs_lip</td>
  <td>lip size</td>
 </tr>
 <tr>
  <td>Appearance</td>
  <td>Base</td>
  <td>Natural Hair Color</td>
  <td>nathcol</td>
  <td>pcs_nhcol</td>
  <td>Natural Hair color</td>
 </tr>
 <tr>
  <td>Appearance</td>
  <td>Base</td>
  <td>Hair Length</td>
  <td></td>
  <td>pcs_hairlng</td>
  <td>Should be self-explanatory</td>
 </tr>
 <tr>
  <td>Appearance</td>
  <td>Base</td>
  <td></td>
  <td>resnic</td>
  <td>pcs_lashes</td>
  <td>eyelash length</td>
 </tr>
 <tr>
  <td>Appearance</td>
  <td>Base</td>
  <td>Skin Condition</td>
  <td>skinvan</td>
  <td>pcs_skin</td>
  <td>skin condition</td>
 </tr>
 <tr>
  <td>Appearance</td>
  <td>Base</td>
  <td></td>
  <td></td>
  <td>supnatvnesh</td>
  <td>supernatural vnesh bonus; currently from Bimbo or Succubus</td>
 </tr>
 <tr>
  <td>Appearance</td>
  <td>Base</td>
  <td>Apparent Age</td>
  <td></td>
  <td>vidage</td>
  <td>apparent age, used to set appearance bonus</td>
 </tr>
 <tr>
  <td>Appearance</td>
  <td>Base</td>
  <td></td>
  <td></td>
  <td>vidagebonus</td>
  <td>ratio used in the appearance calculation /100</td>
 </tr>
 <tr>
  <td>Appearance</td>
  <td>Base</td>
  <td></td>
  <td>vneshbase</td>
  <td></td>
  <td>base appearance score</td>
 </tr>
 <tr>
  <td>Appearance</td>
  <td>Base</td>
  <td></td>
  <td>zub</td>
  <td>pcs_teeth</td>
  <td>Missing teeth or cosmetically improved teeth (-1)</td>
 </tr>
 <tr>
  <td>Appearance</td>
  <td>Dynamic</td>
  <td></td>
  <td></td>
  <td>CloAdjustedBeauty</td>
  <td>clothing adjustment to appearance</td>
 </tr>
 <tr>
  <td>Appearance</td>
  <td>Dynamic</td>
  <td></td>
  <td>curly</td>
  <td>pcs_haircurl</td>
  <td>Measures remaining hair curliness</td>
 </tr>
 <tr>
  <td>Appearance</td>
  <td>Dynamic</td>
  <td></td>
  <td>dyevmod</td>
  <td>pcs_dye</td>
  <td>fading hair dye penalty to appearance</td>
 </tr>
 <tr>
  <td>Appearance</td>
  <td>Dynamic</td>
  <td></td>
  <td>fbreath</td>
  <td>pcs_breath</td>
  <td>Fresh breath flag, brushed teeth or used mouthwash</td>
 </tr>
 <tr>
  <td>Appearance</td>
  <td>Dynamic</td>
  <td></td>
  <td></td>
  <td>glassvnesh</td>
  <td>glasses penalty to appearance</td>
 </tr>
 <tr>
  <td>Appearance</td>
  <td>Dynamic</td>
  <td></td>
  <td></td>
  <td>hairkoef</td>
  <td>very short hair penalty</td>
 </tr>
 <tr>
  <td>Appearance</td>
  <td>Dynamic</td>
  <td></td>
  <td>hapri</td>
  <td>pcs_hairbsh</td>
  <td>hair brushed/styled status</td>
 </tr>
 <tr>
  <td>Appearance</td>
  <td>Dynamic</td>
  <td>Hotness Category</td>
  <td></td>
  <td>hotcat</td>
  <td>used in some checks as an abstaction of "hotness"</td>
 </tr>
 <tr>
  <td>Appearance</td>
  <td>Dynamic</td>
  <td></td>
  <td>leghair</td>
  <td>pcs_leghair</td>
  <td>Legs shaved status</td>
 </tr>
 <tr>
  <td>Appearance</td>
  <td>Dynamic</td>
  <td></td>
  <td></td>
  <td>legkoef</td>
  <td>legs unshaved penalty to appearance</td>
 </tr>
 <tr>
  <td>Appearance</td>
  <td>Dynamic</td>
  <td></td>
  <td></td>
  <td>lipbalmKoef</td>
  <td>appearance bonus due to wearing lip balm</td>
 </tr>
 <tr>
  <td>Appearance</td>
  <td>Dynamic</td>
  <td></td>
  <td>lipbalmstat</td>
  <td>pcs_lipbalm</td>
  <td>lip balm application remaining</td>
 </tr>
 <tr>
  <td>Appearance</td>
  <td>Dynamic</td>
  <td></td>
  <td>lobok</td>
  <td>pcs_pubes</td>
  <td>Pubic hair status</td>
 </tr>
 <tr>
  <td>Appearance</td>
  <td>Dynamic</td>
  <td></td>
  <td>mop</td>
  <td>pcs_makeup</td>
  <td>Current Makeup Status</td>
 </tr>
 <tr>
  <td>Appearance</td>
  <td>Dynamic</td>
  <td></td>
  <td></td>
  <td>mopkoef</td>
  <td>makeup bonus to appearance</td>
 </tr>
 <tr>
  <td>Appearance</td>
  <td>Dynamic</td>
  <td>Hair Color</td>
  <td></td>
  <td>pcs_haircol</td>
  <td>Current hair color</td>
 </tr>
 <tr>
  <td>Appearance</td>
  <td>Dynamic</td>
  <td>Sun Tan</td>
  <td></td>
  <td>pcs_tan</td>
  <td>PC Sun Tan Status</td>
 </tr>
 <tr>
  <td>Appearance</td>
  <td>Dynamic</td>
  <td></td>
  <td>sweat</td>
  <td>pcs_sweat</td>
  <td>sweat status</td>
 </tr>
 <tr>
  <td>Appearance</td>
  <td>Dynamic</td>
  <td></td>
  <td></td>
  <td>sweatKoef</td>
  <td>appearance penalty due to sweat</td>
 </tr>
 <tr>
  <td>Appearance</td>
  <td>Dynamic</td>
  <td></td>
  <td>vnesh</td>
  <td>pcs_apprnc</td>
  <td>Final appearance score</td>
 </tr>
 <tr>
  <td>Attribute</td>
  <td>0</td>
  <td>Strength</td>
  <td></td>
  <td>pcs_stren</td>
  <td>Abstracts physical power, how much oomph the PC can put behind what shes
  doing physically</td>
 </tr>
 <tr>
  <td>Attribute</td>
  <td>1</td>
  <td>Agility</td>
  <td></td>
  <td>pcs_agil</td>
  <td>Abstract muscle response speed,
  accuracy, and kinaesthetic sense; basically covering anything where physical
  finesse was needed instead of raw power</td>
 </tr>
 <tr>
  <td>Attribute</td>
  <td>2</td>
  <td>Endurance</td>
  <td></td>
  <td>pcs_vital</td>
  <td>Abstract base physical stamina, staying power and also cover overall
  health</td>
 </tr>
 <tr>
  <td>Attribute</td>
  <td>3</td>
  <td>Intelligence</td>
  <td></td>
  <td>pcs_intel</td>
  <td>Abstracts raw processing power and memory retention</td>
 </tr>
 <tr>
  <td>Attribute</td>
  <td>4</td>
  <td>Mental Agility</td>
  <td></td>
  <td>pcs_react</td>
  <td>Abstracts how quickly the PC can respond to input</td>
 </tr>
 <tr>
  <td>Attribute</td>
  <td>5</td>
  <td>Sprit</td>
  <td></td>
  <td>pcs_sprt</td>
  <td>Abstracts mental stamina and overall mental health; the "sprt"
  variable replaces the "will" variable to limit confusion with
  "willpower"</td>
 </tr>
 <tr>
  <td>Attribute</td>
  <td>6</td>
  <td>Charisma</td>
  <td></td>
  <td>pcs_chrsm</td>
  <td>Abstracts force of personality, sort
  of the mental equivalent of "stren" as it relates to dealing with
  others; replaces dom/sub checks in some places (willpower is used in others)</td>
 </tr>
 <tr>
  <td>Attribute</td>
  <td>7</td>
  <td>Perception</td>
  <td></td>
  <td>pcs_prcptn</td>
  <td>abstracts all aspects of the natural ability at personal, interpersonal,
  and situational awareness</td>
 </tr>
 <tr>
  <td>Attribute</td>
  <td>8</td>
  <td>Magic</td>
  <td></td>
  <td>pcs_magik</td>
  <td>Measures how much power the PC can
  handle, which effects which spells the PC can cast (but not learn), the power
  behind those spells, and their duration; magik_exp = orgasm</td>
 </tr>
 <tr>
  <td>Body Shape
  </td>
  <td>Base</td>
  <td>Hips</td>
  <td>bedra</td>
  <td>pcs_hips</td>
  <td>hips</td>
 </tr>
 <tr>
  <td>Body Shape
  </td>
  <td>Base</td>
  <td>Bust</td>
  <td>grudi</td>
  <td>pcs_bust</td>
  <td>Bust</td>
 </tr>
 <tr>
  <td>Body Shape
  </td>
  <td>Base</td>
  <td>Band</td>
  <td>grutal</td>
  <td>pcs_band</td>
  <td>Band</td>
 </tr>
 <tr>
  <td>Body Shape
  </td>
  <td>Base</td>
  <td>Height</td>
  <td>rost</td>
  <td>pcs_hgt</td>
  <td>height</td>
 </tr>
 <tr>
  <td>Body Shape
  </td>
  <td>Base</td>
  <td>Waist</td>
  <td>talia</td>
  <td>pcs_waist</td>
  <td>waist</td>
 </tr>
 <tr>
  <td>Body Shape
  </td>
  <td>Base</td>
  <td>Cup Size</td>
  <td>titK</td>
  <td>pcs_cup</td>
  <td>breast cup size</td>
 </tr>
 <tr>
  <td>Body Shape
  </td>
  <td>Base</td>
  <td>Weight</td>
  <td>ves</td>
  <td>pcs_weight</td>
  <td>weight</td>
 </tr>
 <tr>
  <td>Body Shape
  </td>
  <td></td>
  <td></td>
  <td></td>
  <td>bratio</td>
  <td>band to waist ratio set in body_shape</td>
 </tr>
 <tr>
  <td>Body Shape
  </td>
  <td></td>
  <td></td>
  <td></td>
  <td>btwarn</td>
  <td>used to flag if to display the gaining/losing weight message when bathing</td>
 </tr>
 <tr>
  <td>Body Shape
  </td>
  <td></td>
  <td></td>
  <td></td>
  <td>fat</td>
  <td>measures fat that has not made it to being carried</td>
 </tr>
 <tr>
  <td>Body Shape
  </td>
  <td></td>
  <td></td>
  <td></td>
  <td>genbsize</td>
  <td>the set genetic bust size</td>
 </tr>
 <tr>
  <td>Body Shape
  </td>
  <td></td>
  <td></td>
  <td></td>
  <td>hratio</td>
  <td>hip to height ratio set in body_shape</td>
 </tr>
 <tr>
  <td>Body Shape
  </td>
  <td></td>
  <td></td>
  <td></td>
  <td>magf2bdo</td>
  <td>flag for magic bust increase; 0, ready; 1, do it; 2, ask; 3, no</td>
 </tr>
 <tr>
  <td>Body Shape
  </td>
  <td></td>
  <td></td>
  <td></td>
  <td>magicf2b</td>
  <td>set in body_shape for the fat moved to bust</td>
 </tr>
 <tr>
  <td>Body Shape
  </td>
  <td></td>
  <td></td>
  <td></td>
  <td>magtarcup</td>
  <td>set in the dream code as the target cup size</td>
 </tr>
 <tr>
  <td>Body Shape
  </td>
  <td></td>
  <td></td>
  <td></td>
  <td>mgf2bnocnt</td>
  <td>used to count the number of times a bust increase was turned down and
  stop asking after 3</td>
 </tr>
 <tr>
  <td>Body Shape
  </td>
  <td></td>
  <td></td>
  <td></td>
  <td>nbsize</td>
  <td>starts at a set genetic bust size, but can be adjusted down if salo drops
  too low</td>
 </tr>
 <tr>
  <td>Body Shape
  </td>
  <td></td>
  <td></td>
  <td>nipple_size</td>
  <td>pcs_nips</td>
  <td>Nipple Size</td>
 </tr>
 <tr>
  <td>Body Shape
  </td>
  <td></td>
  <td></td>
  <td></td>
  <td>salo</td>
  <td>measures carried body fat</td>
 </tr>
 <tr>
  <td>Body Shape
  </td>
  <td></td>
  <td></td>
  <td></td>
  <td>salocatlast</td>
  <td>the previous category of salo</td>
 </tr>
 <tr>
  <td>Body Shape
  </td>
  <td></td>
  <td></td>
  <td></td>
  <td>salocatnow</td>
  <td>the current category of salo</td>
 </tr>
 <tr>
  <td>Body Shape
  </td>
  <td></td>
  <td></td>
  <td></td>
  <td>salolast</td>
  <td>used when doing a soft rest to control the cycling of the main code</td>
 </tr>
 <tr>
  <td>Body Shape
  </td>
  <td></td>
  <td></td>
  <td></td>
  <td>sftrstflag</td>
  <td>used to prevent a code chunk from firing on a soft reset</td>
 </tr>
 <tr>
  <td>Body Shape
  </td>
  <td></td>
  <td></td>
  <td></td>
  <td>vhips</td>
  <td>derived from salo in body_shape</td>
 </tr>
 <tr>
  <td>Body Shape
  </td>
  <td></td>
  <td></td>
  <td></td>
  <td>vhtmp</td>
  <td>slows the change to vhips in body_shape</td>
 </tr>
 <tr>
  <td>Body Shape
  </td>
  <td></td>
  <td></td>
  <td></td>
  <td>vofat</td>
  <td>used as a place to put extra salo at extreme high values (i.e. really,
  really fat) set in body_shape</td>
 </tr>
 <tr>
  <td>Body Shape
  </td>
  <td></td>
  <td></td>
  <td></td>
  <td>wratio</td>
  <td>waist to hips ratio set in body_shape</td>
 </tr>
 <tr>
  <td>Image Set</td>
  <td></td>
  <td></td>
  <td></td>
  <td>$bodimgsets[x]</td>
  <td>body shape descriptors, tens place is the set (using bodset), 0 - 7 the
  descriptors (using salocatnow), 8 filler, 9 is the folder name</td>
 </tr>
 <tr>
  <td>Image Set</td>
  <td></td>
  <td></td>
  <td></td>
  <td>bdsetlock</td>
  <td>flag to indicate set control override, 0 is use the formula to pick a
  set, 1 is use a fixed set</td>
 </tr>
 <tr>
  <td>Image Set</td>
  <td></td>
  <td></td>
  <td></td>
  <td>bodset</td>
  <td>body image and descriptor control variable, used to indicate which image
  and descriptor set is in use</td>
 </tr>
 <tr>
  <td>Image Set</td>
  <td></td>
  <td></td>
  <td></td>
  <td>bodsetcnt</td>
  <td>the number of sets present</td>
 </tr>
 <tr>
  <td>Image Set</td>
  <td></td>
  <td></td>
  <td></td>
  <td>fixbodset</td>
  <td>the identification number of the fixed image set</td>
 </tr>
 <tr>
  <td>Image Set</td>
  <td></td>
  <td></td>
  <td></td>
  <td>imgset6ovr[x]</td>
  <td>a flag to indicate that an image set (x) has its own image 6</td>
 </tr>
 <tr>
  <td>Image Set</td>
  <td></td>
  <td></td>
  <td></td>
  <td>imgset7ovr[x]</td>
  <td>a flag to indicate that an image set (x) has its own image 7</td>
 </tr>
 <tr>
  <td>Pool</td>
  <td></td>
  <td>Health</td>
  <td>health</td>
  <td>pcs_health</td>
  <td>Health state in terms of both HP and illness</td>
 </tr>
 <tr>
  <td>Pool</td>
  <td></td>
  <td>Health Max</td>
  <td></td>
  <td>healthmax</td>
  <td>Max health state value</td>
 </tr>
 <tr>
  <td>Pool</td>
  <td></td>
  <td>Manna</td>
  <td>manna</td>
  <td>pcs_manna</td>
  <td>magic power available for spell casting</td>
 </tr>
 <tr>
  <td>Pool</td>
  <td></td>
  <td>Manna Max</td>
  <td></td>
  <td>mannamax</td>
  <td>Max magic power</td>
 </tr>
 <tr>
  <td>Pool</td>
  <td></td>
  <td>Mood Max</td>
  <td></td>
  <td>maxmood</td>
  <td>Should be self-explanatory</td>
 </tr>
 <tr>
  <td>Pool</td>
  <td></td>
  <td>Mood</td>
  <td>mood</td>
  <td>pcs_mood</td>
  <td>Should be self-explanatory</td>
 </tr>
 <tr>
  <td>Pool</td>
  <td></td>
  <td>Willpower</td>
  <td>willpower</td>
  <td>pcs_willpwr</td>
  <td>this will be expended for mental activities, also as a replacement for
  dom/sub checks some in places</td>
 </tr>
 <tr>
  <td>Pool</td>
  <td></td>
  <td>Willpower Max</td>
  <td></td>
  <td>willpowermax</td>
  <td>Should be self-explanatory</td>
 </tr>
 <tr>
  <td>Pool</td>
  <td></td>
  <td>Staminia</td>
  <td></td>
  <td>pcs_stam</td>
  <td>physical activities pool</td>
 </tr>
 <tr>
  <td>Pool</td>
  <td></td>
  <td>Staminia Max</td>
  <td></td>
  <td>stammax</td>
  <td>physical activities pool max</td>
 </tr>
 <tr>
  <td>Pregnancy</td>
  <td></td>
  <td></td>
  <td></td>
  <td>$wombthfath</td>
  <td>Father of current pregnancy</td>
 </tr>
 <tr>
  <td>Skill</td>
  <td>combat</td>
  <td>Defence</td>
  <td></td>
  <td>pcs_def</td>
  <td>Covers both blocking and dodging</td>
 </tr>
 <tr>
  <td>Skill</td>
  <td>combat</td>
  <td>Jabs</td>
  <td></td>
  <td>pcs_jab</td>
  <td>Quick strikes that do not have much power</td>
 </tr>
 <tr>
  <td>Skill</td>
  <td>combat</td>
  <td>Kicks</td>
  <td></td>
  <td>pcs_kick</td>
  <td>Kicking, enough said</td>
 </tr>
 <tr>
  <td>Skill</td>
  <td>combat</td>
  <td>Power Strikes</td>
  <td></td>
  <td>pcs_punch</td>
  <td>Hard strikes that are harder to land</td>
 </tr>
 <tr>
  <td>Skill</td>
  <td>combat</td>
  <td>Marksmanship</td>
  <td></td>
  <td>pcs_shoot</td>
  <td>Could be guns, bows, or spells</td>
 </tr>
 <tr>
  <td>Skill</td>
  <td>craft</td>
  <td>Artistic Skills</td>
  <td></td>
  <td>pcs_artskls</td>
  <td>painting, drawing etc.</td>
 </tr>
 <tr>
  <td>Skill</td>
  <td>craft</td>
  <td>Instrumental Music</td>
  <td></td>
  <td>pcs_instrmusic</td>
  <td>Skill at playing an instrument(s)</td>
 </tr>
 <tr>
  <td>Skill</td>
  <td>craft</td>
  <td>Photography</td>
  <td></td>
  <td>pcs_photoskl</td>
  <td>Should be self-explanatory</td>
 </tr>
 <tr>
  <td>Skill</td>
  <td>craft</td>
  <td>Tailoring</td>
  <td></td>
  <td>pcs_sewng</td>
  <td>Should be self-explanatory</td>
 </tr>
 <tr>
  <td>Skill</td>
  <td>craft</td>
  <td>Singing</td>
  <td></td>
  <td>pcs_vokal</td>
  <td>Should be self-explanatory</td>
 </tr>
 <tr>
  <td>Skill</td>
  <td>dance</td>
  <td>Modern Dancing</td>
  <td></td>
  <td>pcs_danc</td>
  <td>This is the basic dance skill and replaces 'dance'</td>
 </tr>
 <tr>
  <td>Skill</td>
  <td>dance</td>
  <td>Erotic Dancing</td>
  <td></td>
  <td>pcs_dancero</td>
  <td>This is used when individual eroticism is being displayed, also covers
  &amp; replaces strip tease</td>
 </tr>
 <tr>
  <td>Skill</td>
  <td>dance</td>
  <td>Pole Dancing</td>
  <td></td>
  <td>pcs_dancpol</td>
  <td>Should be self-explanatory</td>
 </tr>
 <tr>
  <td>Skill</td>
  <td>game</td>
  <td>Chess</td>
  <td></td>
  <td>pcs_chess</td>
  <td>Should be self-explanatory</td>
 </tr>
 <tr>
  <td>Skill</td>
  <td>game</td>
  <td>Gaming</td>
  <td></td>
  <td>pcs_ttgmng</td>
  <td>Abstracts skills at all types of Table Top games</td>
 </tr>
 <tr>
  <td>Skill</td>
  <td>Social</td>
  <td>People skills</td>
  <td></td>
  <td>pcs_humint</td>
  <td>basic human interaction skill set</td>
 </tr>
 <tr>
  <td>Skill</td>
  <td>Social</td>
  <td>Persuasion</td>
  <td></td>
  <td>pcs_persuas</td>
  <td>Trained skill at getting people to agree with you or like you</td>
 </tr>
 <tr>
  <td>Skill</td>
  <td>sport</td>
  <td>Football</td>
  <td></td>
  <td>pcs_ftbll</td>
  <td>Should be self-explanatory</td>
 </tr>
 <tr>
  <td>Skill</td>
  <td>sport</td>
  <td>Ice Skating</td>
  <td></td>
  <td>pcs_icesktng</td>
  <td>Should be self-explanatory</td>
 </tr>
 <tr>
  <td>Skill</td>
  <td>sport</td>
  <td>Running</td>
  <td></td>
  <td>pcs_run</td>
  <td>Should be self-explanatory</td>
 </tr>
 <tr>
  <td>Skill</td>
  <td>sport</td>
  <td>Volleyball</td>
  <td></td>
  <td>pcs_vball</td>
  <td>Should be self-explanatory</td>
 </tr>
 <tr>
  <td>Skill</td>
  <td>sport</td>
  <td>Wrestling</td>
  <td></td>
  <td>pcs_wrstlng</td>
  <td>Should be self-explanatory</td>
 </tr>
 <tr>
  <td>Skill</td>
  <td>util</td>
  <td>Hacking</td>
  <td></td>
  <td>pcs_comphckng</td>
  <td>Skill at hacking computer systems</td>
 </tr>
 <tr>
  <td>Skill</td>
  <td>util</td>
  <td>Computer Skill</td>
  <td></td>
  <td>pcs_compskl</td>
  <td>Skill at using and repairing computers</td>
 </tr>
 <tr>
  <td>Skill</td>
  <td>util</td>
  <td>Handy-work</td>
  <td></td>
  <td>pcs_hndiwrk</td>
  <td>Used for non-mechanic work, i.e. plumbing</td>
 </tr>
 <tr>
  <td>Skill</td>
  <td>util</td>
  <td>Makeup Skill</td>
  <td></td>
  <td>pcs_makupskl</td>
  <td>Skill at applying makeup, goes into the vnesh calc as makupapp/5</td>
 </tr>
 <tr>
  <td>Skill</td>
  <td>util</td>
  <td>Observation</td>
  <td></td>
  <td>pcs_observ</td>
  <td>trained skill in noticing one''s surroundings and events (nothing but
  surface detail)</td>
 </tr>
 <tr>
  <td>Skill</td>
  <td>util</td>
  <td>Spell Casting</td>
  <td></td>
  <td>pcs_splcstng</td>
  <td>The ability to Successfully cast spells</td>
 </tr>
 <tr>
  <td>Skill</td>
  <td>work</td>
  <td>Modeling</td>
  <td></td>
  <td>pcs_mdlng</td>
  <td>Knowing how to pose and hold poses for long periods of time</td>
 </tr>
 <tr>
  <td>Skill</td>
  <td>work</td>
  <td>Medicine</td>
  <td></td>
  <td>pcs_medcn</td>
  <td>Basic medical knowledge up to the level of Nursing</td>
 </tr>
 <tr>
  <td>Skill</td>
  <td>work</td>
  <td>Serving</td>
  <td></td>
  <td>pcs_servng</td>
  <td>Covers all aspects of waitressing and bartending</td>
 </tr>
 <tr>
  <td>Stat</td>
  <td>Base</td>
  <td>PC First Name</td>
  <td></td>
  <td>$pcs_firstname</td>
  <td>PC First Name</td>
 </tr>
 <tr>
  <td>Stat</td>
  <td>Base</td>
  <td>PC Last Name</td>
  <td></td>
  <td>$pcs_lastname</td>
  <td>PC Last Name</td>
 </tr>
 <tr>
  <td>Stat</td>
  <td>Base</td>
  <td>PC Nickname</td>
  <td></td>
  <td>$pcs_nickname</td>
  <td>PC Nickname</td>
 </tr>
 <tr>
  <td>Stat</td>
  <td>Dynamic</td>
  <td>Drunk Level</td>
  <td></td>
  <td>alko</td>
 </tr>
 <tr>
  <td>Stat</td>
  <td>Dynamic</td>
  <td>Hunger</td>
  <td>energy</td>
  <td>pcs_energy</td>
  <td>Should be self-explanatory</td>
 </tr>
 <tr>
  <td>Stat</td>
  <td>Dynamic</td>
  <td>Nerd Status</td>
  <td>nerdism</td>
  <td>pcs_nerd</td>
  <td>Should be self-explanatory</td>
 </tr>
 <tr>
  <td>Stat</td>
  <td>Dynamic</td>
  <td>Pain</td>
  <td></td>
  <td>pain ['total']</td>
  <td>Current totoal of all pain types</td>
 </tr>
 <tr>
  <td>Stat</td>
  <td>Dynamic</td>
  <td></td>
  <td></td>
  <td>pcs_grades</td>
  <td>SG School grades</td>
 </tr>
 <tr>
  <td>Stat</td>
  <td>Dynamic</td>
  <td>Sleep</td>
  <td>son</td>
  <td>pcs_sleep</td>
  <td>Tiredness measurement</td>
 </tr>
 <tr>
  <td>Stat</td>
  <td>Dynamic</td>
  <td></td>
  <td>tanga</td>
  <td>pcs_undies</td>
  <td>Panty status</td>
 </tr>
 <tr>
  <td>Stat</td>
  <td>General</td>
  <td>Speed</td>
  <td>speed</td>
  <td></td>
  <td>Can be used as a generalization overall movement speed (maybe walking
  times or escape checks) and also for backward compatibility.</td>
 </tr>
 <tr>
  <td>Stat</td>
  <td>General</td>
  <td>Creativity</td>
  <td></td>
  <td>pcs_creatvty</td>
  <td>Should be self-explanatory</td>
 </tr>
 <tr>
  <td>Stat</td>
  <td>General</td>
  <td>Empathy</td>
  <td></td>
  <td>pcs_empath</td>
  <td>used to reflect PC actions</td>
 </tr>
 <tr>
  <td>Stat</td>
  <td>Magic</td>
  <td>Natural Power</td>
  <td></td>
  <td>rikudo</td>
  <td>A measure of how much of the amulets magic the PC has access to</td>
 </tr>
 <tr>
  <td>Stat</td>
  <td>NPC</td>
  <td></td>
  <td>Astat_rel[28]</td>
  <td>npc_rel[28]</td>
  <td>SG PC Relationship to Step-Father</td>
 </tr>
 <tr>
  <td>Stat</td>
  <td>NPC</td>
  <td></td>
  <td>Astat_rel[29]</td>
  <td>npc_rel[29]</td>
  <td>SG PC relationship to Mother</td>
 </tr>
 <tr>
  <td>Stat</td>
  <td>NPC</td>
  <td></td>
  <td>Astat_rel[33]</td>
  <td>npc_rel[33]</td>
  <td>SG PC relationship to Sister</td>
 </tr>
 <tr>
  <td>Stat</td>
  <td>NPC</td>
  <td></td>
  <td>Astat_rel[34]</td>
  <td>npc_rel[34]</td>
  <td>SG PC Relationship to Brother</td>
 </tr>
 <tr>
  <td>Stat</td>
  <td>NPC</td>
  <td>NPC Relationship</td>
  <td>Astat_rel[x]</td>
  <td>npc_rel[x]</td>
  <td>Relationship with NPC x, where x is the index number of an NPC</td>
 </tr>
 <tr>
  <td>Stat</td>
  <td>Other</td>
  <td></td>
  <td></td>
  <td>GorSlut</td>
  <td>Pavlosk reputation</td>
 </tr>
 <tr>
  <td>Stat</td>
  <td>Sex</td>
  <td></td>
  <td>anus</td>
  <td>pcs_ass</td>
  <td>Anus capasity</td>
 </tr>
 <tr>
  <td>Stat</td>
  <td>Sex</td>
  <td>Arousal</td>
  <td></td>
  <td>pcs_horny</td>
  <td>Current arousal level</td>
 </tr>
 <tr>
  <td>Stat</td>
  <td>Sex</td>
  <td></td>
  <td>throat</td>
  <td>pcs_throat</td>
  <td>Throat Capasity</td>
 </tr>
 <tr>
  <td>Stat</td>
  <td>Sex</td>
  <td></td>
  <td>vagina</td>
  <td>pcs_vag</td>
  <td>Vaginal capasity</td>
 </tr>
 <tr>
  <td>Stat</td>
  <td>STD</td>
  <td></td>
  <td></td>
  <td>Gerpes</td>
  <td>Herpes Status</td>
 </tr>
 <tr>
  <td>Stat</td>
  <td>Candidiasis (yeast infection)</td>
  <td></td>
  <td></td>
  <td>Kandidoz</td>
  <td>Candida albicans</td>
 </tr>
 <tr>
  <td>Stat</td>
  <td>STD</td>
  <td></td>
  <td></td>
  <td>Sifilis</td>
  <td>Syphlis Status</td>
 </tr>
 <tr>
  <td>Stat</td>
  <td>STD</td>
  <td></td>
  <td></td>
  <td>Triper</td>
  <td>Gonorea Status</td>
 </tr>
 <tr>
  <td>Succubus TF</td>
  <td></td>
  <td></td>
  <td></td>
  <td>$scargrt</td>
  <td>a string to set by the $ARGS from the calling location if $metca may not
  have been set, set at the calling location when needed</td>
 </tr>
 <tr>
  <td>Succubus TF</td>
  <td></td>
  <td></td>
  <td></td>
  <td>$sclocrt</td>
  <td>a string to indicate where a call came from if $loc may not have been
  set, set at the calling location when needed</td>
 </tr>
 <tr>
  <td>Succubus TF</td>
  <td></td>
  <td></td>
  <td></td>
  <td>$scsubloc</td>
  <td>a string to allow a sub-routine in this location to call another and
  still get back to the first</td>
 </tr>
 <tr>
  <td>Succubus TF</td>
  <td></td>
  <td></td>
  <td></td>
  <td>$sucabs1</td>
  <td>strings used in displaying energy absorption</td>
 </tr>
 <tr>
  <td>Succubus TF</td>
  <td></td>
  <td></td>
  <td></td>
  <td>$sucabs2</td>
  <td>strings used in displaying energy absorption</td>
 </tr>
 <tr>
  <td>Succubus TF</td>
  <td></td>
  <td></td>
  <td></td>
  <td>$sucabs3</td>
  <td>strings used in displaying energy absorption</td>
 </tr>
 <tr>
  <td>Succubus TF</td>
  <td></td>
  <td></td>
  <td></td>
  <td>$sucgoloc</td>
  <td>used for the location name of where one ends up after a
  "suc-walking" event</td>
 </tr>
 <tr>
  <td>Succubus TF</td>
  <td></td>
  <td></td>
  <td></td>
  <td>$sucgometka</td>
  <td>used for the location $args of where one ends up after a
  "suc-walking" event</td>
 </tr>
 <tr>
  <td>Succubus TF</td>
  <td></td>
  <td></td>
  <td></td>
  <td>$sucself1</td>
  <td>a string used to show how you view the succubus side of yourself</td>
 </tr>
 <tr>
  <td>Succubus TF</td>
  <td></td>
  <td></td>
  <td></td>
  <td>karinsucsex</td>
  <td>counts the number of times the PC has had sex with Karin as a succubus.</td>
 </tr>
 <tr>
  <td>Succubus TF</td>
  <td></td>
  <td></td>
  <td></td>
  <td>karinsucsexask</td>
  <td>used to make it that you only ask Karin about sex once a day</td>
 </tr>
 <tr>
  <td>Succubus TF</td>
  <td></td>
  <td></td>
  <td></td>
  <td>karinsucsexday</td>
  <td>use to indicate when the PC can next have sex with Karin</td>
 </tr>
 <tr>
  <td>Succubus TF</td>
  <td></td>
  <td></td>
  <td></td>
  <td>scfwon</td>
  <td>a flag to indicate that a call is from a fight that was won or you were
  hunting, set at the calling location</td>
 </tr>
 <tr>
  <td>Succubus TF</td>
  <td></td>
  <td></td>
  <td></td>
  <td>scpopt</td>
  <td>a flag to indicate that a call is optional for some reason, set at the
  calling location: 0: No, 1: Yes, 2: option taken</td>
 </tr>
 <tr>
  <td>Succubus TF</td>
  <td></td>
  <td></td>
  <td></td>
  <td>sctrainprep</td>
  <td>used to flag that preparation for a Succubus train session are or need to
  be done</td>
 </tr>
 <tr>
  <td>Succubus TF</td>
  <td></td>
  <td></td>
  <td></td>
  <td>sexnutrition</td>
  <td>used as an intermediate step variable from the point of absorption to the
  point of conversion</td>
 </tr>
 <tr>
  <td>Succubus TF</td>
  <td></td>
  <td></td>
  <td></td>
  <td>sucabscum</td>
  <td>a flag used in displaying energy absorbed from semen</td>
 </tr>
 <tr>
  <td>Succubus TF</td>
  <td></td>
  <td></td>
  <td></td>
  <td>sucabslez</td>
  <td>a flag used in displaying energy absorbed from lesbian sex</td>
 </tr>
 <tr>
  <td>Succubus TF</td>
  <td></td>
  <td>"Food" Energy Reserve</td>
  <td></td>
  <td>succhungry</td>
  <td>an indicator of your succubus energy debt (lower is better)</td>
 </tr>
 <tr>
  <td>Succubus TF</td>
  <td></td>
  <td></td>
  <td></td>
  <td>succonfail</td>
  <td>a flag used to indicate that you tried to hold back and failed</td>
 </tr>
 <tr>
  <td>Succubus TF</td>
  <td></td>
  <td>Succubus Level</td>
  <td></td>
  <td>succublvl</td>
  <td>an indicator of how strong a succubus you are</td>
 </tr>
 <tr>
  <td>Succubus TF</td>
  <td></td>
  <td></td>
  <td></td>
  <td>succubusflag</td>
  <td>a flag that indicates you are a succubus</td>
 </tr>
 <tr>
  <td>Succubus TF</td>
  <td></td>
  <td></td>
  <td></td>
  <td>succubusQW</td>
  <td>used to show succubus states: 1: Seed planted, 2: Had 1st dream, 3:
  Rejected, 4: Scavenger, 5: Predator</td>
 </tr>
 <tr>
  <td>Succubus TF</td>
  <td></td>
  <td>Succubus XP</td>
  <td></td>
  <td>succubxp</td>
  <td>succubus xp, added to by lesbian sex and absorbing semen</td>
 </tr>
 <tr>
  <td>Succubus TF</td>
  <td></td>
  <td></td>
  <td></td>
  <td>suceatinit</td>
  <td>a flag to indicate that the initiation sub-routine was done</td>
 </tr>
 <tr>
  <td>Succubus TF</td>
  <td></td>
  <td>Stored Sexual Energy</td>
  <td></td>
  <td>sucexcess</td>
  <td>an indicator of absorbed sex energy in excess of what was needed for
  survival (energy &amp; water), also used for suc energy debt</td>
 </tr>
 <tr>
  <td>Succubus TF</td>
  <td></td>
  <td></td>
  <td></td>
  <td>suchuntday</td>
  <td>use to indicate a successful hunt to limit the number of hunts in a day.</td>
 </tr>
 <tr>
  <td>Succubus TF</td>
  <td></td>
  <td></td>
  <td></td>
  <td>sucinfoday</td>
  <td>used to control the timing on the next succubus info release</td>
 </tr>
 <tr>
  <td>Succubus TF</td>
  <td></td>
  <td></td>
  <td></td>
  <td>suclezsex</td>
  <td>used to show if a lesbian sex act has occurred</td>
 </tr>
 <tr>
  <td>Succubus TF</td>
  <td></td>
  <td></td>
  <td></td>
  <td>sucpcinfo</td>
  <td>used to indicate what the PC knowledge level about succubae is</td>
 </tr>
 <tr>
  <td>Succubus TF</td>
  <td></td>
  <td></td>
  <td></td>
  <td>sucpowzeroed</td>
  <td>a counter that indicates a succubus either had willpower had hit 0 or was
  in energy debt for a number of days</td>
 </tr>
 <tr>
  <td>Succubus TF</td>
  <td></td>
  <td></td>
  <td></td>
  <td>sucskill</td>
  <td>used a single point to track how high up the succubus skill ladder you
  are</td>
 </tr>
 <tr>
  <td>Succubus TF</td>
  <td></td>
  <td>Sexual Energy Storage Capacity</td>
  <td></td>
  <td>sucstorecap</td>
  <td>used to indicate your excess energy storage capacity</td>
 </tr>
 <tr>
  <td>Succubus TF</td>
  <td></td>
  <td></td>
  <td></td>
  <td>sucwalkday</td>
  <td>used to limit how often one goes "suc-walking"</td>
 </tr>
 <tr>
  <td>Succubus TF</td>
  <td></td>
  <td></td>
  <td></td>
  <td>sucxpsnapshot</td>
  <td>yesterday's succubxp, used to determine if you fed today</td>
 </tr>
 <tr>
  <td></td>
  <td></td>
  <td></td>
  <td>birthday</td>
  <td>pcs_dob</td>
  <td></td>
 </tr>
 <tr>
  <td></td>
  <td></td>
  <td></td>
  <td>birthmonth</td>
  <td>pcs_dob</td>
  <td></td>
 </tr>
 <tr>
  <td></td>
  <td></td>
  <td></td>
  <td>birthyear</td>
  <td>pcs_dob</td>
  <td></td>
 </tr>
 <tr>
  <td></td>
  <td></td>
  <td></td>
  <td>dom</td>
  <td>pcs_dom</td>
  <td></td>
 </tr>
 <tr>
  <td></td>
  <td></td>
  <td></td>
  <td>tan</td>
  <td>pcs_tan</td>
  <td></td>
 </tr>
 <tr>
  <td></td>
  <td></td>
  <td></td>
  <td></td>
  <td>cumspclnt</td>
  <td>used to determine cum cleanup</td>
 </tr>
 <tr>
  <td></td>
  <td></td>
  <td></td>
  <td></td>
  <td>stim</td>
  <td>array of stimulation - used in arousal procedure</td>
 </tr>
 <tr>
  <td></td>
  <td></td>
  <td></td>
  <td></td>
  <td>counter</td>
  <td>array of events - be aware of $counter</td>
 </tr>
<tr>
  <td></td>
  <td></td>
  <td></td>
  <td></td>
  <td>JulMilBestFrend</td>
  <td>trigger level 50</td>
 </tr>
<tr>
  <td></td>
  <td></td>
  <td></td>
  <td></td>
  <td>smoker</td>
  <td>This variable increases with each cigarette and express PC's addiction. If bigger then 19, PC is addicted</td>
 </tr>
<tr>
  <td></td>
  <td></td>
  <td></td>
  <td></td>
  <td>smokeDay</td>
  <td>Together with smokeHour and smokeMinut gives the time when PC smoked her last cigarette</td>
 </tr>
<tr>
  <td></td>
  <td></td>
  <td></td>
  <td></td>
  <td>smokeHour</td>
  <td></td>
 </tr>
<tr>
  <td></td>
  <td></td>
  <td></td>
  <td></td>
  <td>smokeminut</td>
  <td>n</td>
 </tr>
<tr>
  <td></td>
  <td></td>
  <td></td>
  <td></td>
  <td>smokerNeed</td>
  <td>if PC is addicted, this expresses the need of smoking. Trigger 10 and 300</td>
 </tr>
<tr>
  <td></td>
  <td>Contraception</td>
  <td></td>
  <td></td>
  <td>pilldays</td>
  <td></td>
 </tr>
<tr>
  <td></td>
  <td>Contraception</td>
  <td></td>
  <td></td>
  <td>tabletki</td>
  <td>Number of packages of hormonal anticonception</td>
 </tr>
<tr>
  <td></td>
  <td>Contraception</td>
  <td></td>
  <td></td>
  <td>tabletkicheck</td>
  <td>2 .. birth control shot, 1 .. PC takes pills automaticaly</td>
 </tr>
<tr>
  <td></td>
  <td>Contraception</td>
  <td></td>
  <td></td>
  <td>tabletkishot</td>
  <td>represents how many days lasts birth control shot</td>
 </tr>
<tr>
  <td></td>
  <td>Contraception</td>
  <td></td>
  <td></td>
  <td>prezik</td>
  <td>total number of condoms in the purse</td>
 </tr>
<tr>
  <td></td>
  <td>Contraception</td>
  <td></td>
  <td></td>
  <td>sexcontra</td>
  <td>Type of contraception</td>
 </tr>
<tr>
  <td></td>
  <td>Contraception</td>
  <td></td>
  <td></td>
  <td>prezikcount</td>
  <td>total number of condoms stored at home</td>
 </tr>
<tr>
  <td></td>
  <td>Contraception</td>
  <td></td>
  <td></td>
  <td>preziksabo</td>
  <td>total number of sabotaged condoms</td>
 </tr>
<tr>
  <td></td>
  <td>Contraception</td>
  <td></td>
  <td></td>
  <td>badprezik</td>
  <td>total number of defected condoms</td>
 </tr>
<tr>
  <td></td>
  <td>Contraception</td>
  <td></td>
  <td></td>
  <td>preziktype</td>
  <td>preferred type of condom for use  0 .. common, 1.. none, 2 .. sabotaged</td>
 </tr>
<tr>
  <td></td>
  <td>Contraception</td>
  <td></td>
  <td></td>
  <td>protect</td>
  <td>1 = a condom on (STD protection)  0 = no condom</td>
 </tr>
<tr>
  <td></td>
  <td>Contraception</td>
  <td></td>
  <td></td>
  <td>noprotect</td>
  <td>1 = a bad condom on (sabotaged or defected - no contraception)</td>
 </tr>
<tr>
  <td></td>
  <td></td>
  <td></td>
  <td></td>
  <td>knowpreg</td>
  <td>Pc knows, that she is pregnant</td>
 </tr>
<tr>
  <td></td>
  <td></td>
  <td></td>
  <td></td>
  <td>thinkpreg</td>
  <td>Pc thinks that she is pregnant</td>
 </tr>
<tr>
  <td></td>
  <td></td>
  <td></td>
  <td></td>
  <td>lubri</td>
  <td>Amount of lubrication gel, which Pc has got in her purse</td>
 </tr>
<tr>
  <td></td>
  <td>BoyStat</td>
  <td></td>
  <td></td>
  <td>$boy</td>
  <td>index of a person with which PC deals (there are also variants $boy1-$boy4 and $boy[i] for group actions)</td>
 </tr>
<tr>
  <td></td>
  <td>BoyStat</td>
  <td></td>
  <td></td>
  <td>$boydesc</td>
  <td>$npc_usedname of a person with which PC deals ($boydesc1-$boydesc4 and $boydesc[i] for group actions)</td>
 </tr>
<tr>
  <td></td>
  <td>BoyStat</td>
  <td></td>
  <td></td>
  <td>dick</td>
  <td>npc_dick of a person with which PC deals ($dick1-$dick4 and $dick[i] for group actions)</td>
 </tr>
<tr>
  <td></td>
  <td>BoyStat</td>
  <td></td>
  <td></td>
  <td>$dick_girth</td>
  <td>$npc_thdick of a person with which PC deals ($dick_girth1-$dick_girth4 and $dick_girth[i] for group actions)</td>
 </tr>
<tr>
  <td></td>
  <td>BoyStat</td>
  <td></td>
  <td></td>
  <td>silavag</td>
  <td>npc_sexskill of a person with which PC deals (silavag1-silavag4 and silavag[i] for group actions)</td>
 </tr>
<tr>
  <td></td>
  <td>BoyStat</td>
  <td></td>
  <td></td>
  <td>$xe</td>
  <td>'he', 'she' or 'xe' personal pronoun - object ($xe1-$xe4 and $xe[i] for group actions)</td>
 </tr>
<tr>
  <td></td>
  <td>BoyStat</td>
  <td></td>
  <td></td>
  <td>$xec</td>
  <td>'He', 'She' or 'Xe' personal pronoun - object ($xec1-$xec4 and $xec[i] for group actions)</td>
 </tr>
<tr>
  <td></td>
  <td>BoyStat</td>
  <td></td>
  <td></td>
  <td>$xem</td>
  <td>'his', 'her' or 'xem' personal pronoun - dependent possessive ($xem1-$xem4 and $xem[i] for group actions)</td>
 </tr>
<tr>
  <td></td>
  <td>BoyStat</td>
  <td></td>
  <td></td>
  <td>$xemc</td>
  <td>'His', 'Her' or 'Xem' personal pronoun - dependent possessive ($xemc1-$xemc4 and $xemc[i] for group actions)</td>
 </tr>
<tr>
  <td></td>
  <td>BoyStat</td>
  <td></td>
  <td></td>
  <td>$xyr</td>
  <td>'him', 'her' or 'xyr' personal pronoun - subject ($xyr1-$xyr4 and $xyr[i] for group actions)</td>
 </tr>
<tr>
  <td></td>
  <td>BoyStat</td>
  <td></td>
  <td></td>
  <td>$xyrc</td>
  <td>'Him', 'Her' or 'Xyr' personal pronoun - subject ($xyrc1-$xyrc4 and $xyrc[i] for group actions)</td>
 </tr>
<tr>
  <td></td>
  <td>BoyStat</td>
  <td></td>
  <td></td>
  <td>$xyrs</td>
  <td>'his', 'hers' or 'xyrs' personal pronoun - independent possessive ($xyrs1-$xyrs4 and $xyrs[i] for group actions)</td>
 </tr>
<tr>
  <td></td>
  <td>BoyStat</td>
  <td></td>
  <td></td>
  <td>$xyrsc</td>
  <td>'His', 'Hers' or 'Xyrs' personal pronoun - independent possessive ($xyrsc1-$xyrsc4 and $xyrsc[i] for group actions)</td>
 </tr>
<tr>
  <td></td>
  <td>BoyStat</td>
  <td></td>
  <td></td>
  <td>$xemself</td>
  <td>'himself', 'herself' or 'xerself' personal pronoun - reflexive ($xemself1-$xemself4 and $xemself[i] for group actions)</td>
 </tr>
<tr>
  <td></td>
  <td>BoyStat</td>
  <td></td>
  <td></td>
  <td>$xemselfc</td>
  <td>'Himself', 'Herself' or 'Xerself' personal pronoun - reflexive ($xemselfc1-$xemselfc4 and $xemselfc[i] for group actions)</td>
 </tr>
<tr>
  <td>Category</td>
  <td>Sub-category</td>
  <td>Title</td>
  <td>Obsolete</td>
  <td>Variable</td>
  <td>Description</td>
 </tr>
 </table>
