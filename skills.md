# Skills:  

## List of Skills:

### Sport Skills
* Jabs
* Power Strikes
* Kicks
* Defence
* Wrestling
 
* Runnig
* Ice Skating
* ~~Skying~~
 
* Volleyball
* Football

* Chess
* Gaming
* Markmanship
* ~~Computer Gaming~~

### Mental Skills
* People skill
* Persuasion
* Observation
* ~~Seduction~~
* Spell Casting
* ~~Gambling~~

### Beauty/Modelling Skills
* Makeup
* Modern Dancind
* Erotic Dancing
* Pole Dancing
* Modelling

### Artistic Skills
* Singing
* Instrumental Music
* Photography
* Artistic Skills

### Job Skills
* Computer
* Hacking
* Handy-work
* Tailoring
* Medicine
* Serving
* ~~Mechanic~~
* ~~Larceny~~

## List of Traits:
* Dancer
* Athlete
* Scholarly

## Table of Skills and relevant variables

<table border="1" bordercolor="green">
<tr>
<th><b>Name of the Skil</b>l</th>
<th><b>Base Variable</b><br> "read only" </th>
<th><b>Level Variable</b><br>"read only"<br>use this if you want trigger an event</th>
<th><b>Progress Variable</b><br>"read/write"<br>use this, if you want to make a change</th>
<th><b>Affected by Attributes</b><br></th>
<th><b>Trigger Levels</b><br></th>
</tr>
<tr> <td> Jabs         	</td><td>jab_lvl  		</td><td>pcs_jab		</td><td>jab_exp		</td><td>Agility, Strength</td><td>none</td> </tr>
<tr> <td> Power Strikes	</td><td>punch_lvl		</td><td>pcs_punch   	</td><td>punch_exp		</td><td>Agility, Strength</td><td>none</td> </tr>
<tr> <td> Kicks        	</td><td>kick_lvl 		</td><td>pcs_kick 		</td><td>kick_exp		</td><td>Agility, Strength</td><td>50</td> </tr>
<tr> <td> Defence      	</td><td>def_lvl 		</td><td>pcs_def 		</td><td>def_exp		</td><td>Agility, Strength, Reaction</td><td>none</td> </tr>
<tr> <td> Markmanship  	</td><td>shoot_lvl 		</td><td>pcs_shoot 		</td><td>shoot_exp		</td><td>Agility, Reaction</td><td>1,10,20,40,60,80,100,150,200,300,400,500</td> </tr>
<tr> <td> Singing    	</td><td>vokal_lvl 		</td><td>pcs_vokal 		</td><td>vokal_exp		</td><td>Intelligence, Charisma</td><td>none</td> </tr>
<tr> <td> Tailoring 	</td><td>sewng_lvl 		</td><td>pcs_sewng		</td><td>sewng_exp		</td><td>Agility, Intelligence</td><td>40,50,100,200</td> </tr>
<tr> <td> Instrumental Music</td><td>instrmusic_lvl</td><td>pcs_instrmusic</td><td>instrmusic_exp</td><td>Agility, Intelligence</td><td>none</td> </tr>
<tr> <td> Photography 	</td><td>photoskl_lvl 	</td><td>pcs_photoskl	</td><td>photoskl_exp	</td><td>Intelligence, Reaction</td><td>none</td> </tr>
<tr> <td> Artistic Skills </td><td>artskls_lvl 	</td><td>pcs_artskls	</td><td>artskls_exp	</td><td>Intelligence, Reaction</td><td>none</td> </tr>
<tr> <td> Modern Dancind</td><td>danc_lvl 		</td><td>pcs_danc		</td><td>danc_exp		</td><td>Agility, Endurance, Reaction</td><td>30,40,50,60</td> </tr>
<tr> <td> Erotic Dancing</td><td>dancero_lvl 	</td><td>pcs_dancero	</td><td>dancero_exp	</td><td>Agility, Endurance, Charisma, Flexibility</td><td>10,15,20,50,100</td> </tr>
<tr> <td> Pole Dancing 	</td><td>dancpol_lvl 	</td><td>pcs_dancpol	</td><td>dancpol_exp	</td><td>Agility, Strength, Charisma, Flexibility</td><td>100</td> </tr>
<tr> <td> Chess 		</td><td>chess_lvl 		</td><td>pcs_chess		</td><td>chess_exp		</td><td>Intelligence, Logic</td><td>none</td> </tr>
<tr> <td> Gaming 		</td><td>ttgmng_lvl 	</td><td>pcs_ttgmng		</td><td>ttgmng_exp		</td><td>Intelligence, Reaction</td><td>none</td> </tr>
<tr> <td> People skill 	</td><td>humint_lvl 	</td><td>pcs_humint		</td><td>humint_exp		</td><td>Reaction, Charisma</td><td>none</td> </tr>
<tr> <td> Persuasion 	</td><td>persuas_lvl 	</td><td>pcs_persuas	</td><td>persuas_exp	</td><td>Charisma, Perception</td><td>none</td> </tr>
<tr> <td> Runnig 		</td><td>run_lvl 		</td><td>pcs_run		</td><td>run_exp		</td><td>Agility, Endurance</td><td>10,20, .. ,90,110,130,150,170</td> </tr>
<tr> <td> Volleyball 	</td><td>vball_lvl 		</td><td>pcs_vball		</td><td>vball_exp		</td><td>Agility, Endurance, Reaction</td><td>15,20,25,30,35,40,50,60,75,80,100</td> </tr>
<tr> <td> Ice Skating 	</td><td>icesktng_lvl 	</td><td>pcs_icesktng	</td><td>icesktng_exp	</td><td>Agility, Strength</td><td>10,30</td> </tr>
<tr> <td> Wrestling 	</td><td>wrstlng_lvl 	</td><td>pcs_wrstlng	</td><td>wrstlng_exp	</td><td>Agility, Endurance, Strength</td><td>none</td> </tr>
<tr> <td> Football 		</td><td>ftbll_lvl 		</td><td>pcs_ftbll		</td><td>ftbll_exp		</td><td>Agility, Endurance, Strength</td><td>none</td> </tr>
<tr> <td> Spell Casting </td><td>splcstng_lvl 	</td><td>pcs_splcstng	</td><td>splcstng_exp	</td><td>Intelligence, Reaction</td><td>none</td> </tr>
<tr> <td> Observation 	</td><td>observ_lvl 	</td><td>pcs_observ		</td><td>observ_exp		</td><td>Intelligence, Reaction, Perception</td><td>none</td> </tr>
<tr> <td> Makeup 		</td><td>makupskl_lvl 	</td><td>pcs_makupskl	</td><td>makupskl_exp	</td><td>Agility, Intelligence,</td><td>none</td> </tr>
<tr> <td> Heels 		</td><td><s>heels_lvl</s>	</td><td>pcs_heels	</td><td>heels_exp	</td><td></td><td>5,15,25,40,60</td> </tr>
<tr> <td> Computer 		</td><td>compskl_lvl 	</td><td>pcs_compskl	</td><td>compskl_exp	</td><td>Intelligence, Logic </td><td>none</td> </tr>
<tr> <td> Hacking 		</td><td>comphckng_lvl 	</td><td>pcs_comphckng	</td><td>comphckng_exp	</td><td>Intelligence, Reaction, Logic</td><td>none</td> </tr>
<tr> <td> Handy-work 	</td><td>hndiwrk_lvl 	</td><td>pcs_hndiwrk	</td><td>hndiwrk_exp	</td><td>Agility, Intelligence,</td><td>none</td> </tr>
<tr> <td> Serving 		</td><td>servng_lvl 	</td><td>pcs_servng		</td><td>servng_exp		</td><td>Endurance, Intelligence,</td><td>100</td> </tr>
<tr> <td> Modelling 	</td><td>mdlng_lvl 		</td><td>pcs_mdlng		</td><td>mdlng_exp		</td><td>Agility, Endurance, </td><td>none</td> </tr>
<tr> <td> Medicine 		</td><td>medcn_lvl 		</td><td>pcs_medcn		</td><td>medcn_exp		</td><td>Intelligence, Reaction, Perception</td><td>none</td> </tr>

<tr> <td><del>Skying</del> </td> 	<td> </td> <td> </td> <td> </td> <td> </td> <td> </td> </tr>
<tr> <td><del> Computer Gaming</del></td> <td> </td> <td> </td> <td> </td> <td> </td> <td></td> </tr>
<tr> <td><del>Seduction</del> </td> <td> </td> <td> </td> <td> </td> <td> </td> <td> </td> </tr>
<tr> <td><del>Gambling</del> </td> <td> </td> <td> </td> <td> </td> <td> </td> <td> </td> </tr>
<tr> <td><del>Mechanic</del> </td> <td> </td> <td> </td> <td> </td> <td> </td> <td> </td> </tr>
<tr> <td><del>Larceny</del> </td> <td> </td> <td> </td> <td> </td> <td> </td> <td> </td> </tr>

</table>

Skill progress samples:
<table>
<tr><th>Level</th><th>Reached when PC gets</th></tr>
<tr><td>1</td><td>1 point</td></tr>
<tr><td>2</td><td>1 point</td></tr>
<tr><td>3</td><td>2 points</td></tr>
<tr><td>4</td><td>4 points</td></tr>
<tr><td>5</td><td>6 points</td></tr>
<tr><td>6</td><td>9 points</td></tr>
<tr><td>7</td><td>13 points</td></tr>
<tr><td>8</td><td>17 points</td></tr>
<tr><td> ... </td><td> ... point</td></tr>
<tr><td>10</td><td>28 points</td></tr>
<tr><td>20</td><td>121 points</td></tr>
<tr><td>30</td><td>281 points</td></tr>
<tr><td>40</td><td>508 points</td></tr>
<tr><td>50</td><td>801 points</td></tr>
<tr><td>60</td><td>1161 points</td></tr>
<tr><td>70</td><td>1588 points</td></tr>
<tr><td>80</td><td>2081 points</td></tr>
<tr><td>90</td><td>2641 points</td></tr>
<tr><td>100</td><td>3268 points</td></tr>
</table>
