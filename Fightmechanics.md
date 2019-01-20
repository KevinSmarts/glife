# Fight Mechanics:  

### A few notes to terms
uron = damage<br>uvorot = dodge<br>popad  = attack<br>hod = stroke<br>tuman = fog,mist,vapor<br>dospeh = armor<br>
### Current system
The current system set all the enemy parameter before the fight directly. However, PCS has got her ovn system (in blue), which could be used for calculation at least a few parameters:

	!The stats
	strenV	= npc_stren
	speedV	= (2 * (npc_stren + npc_agil) + npc_vital) / 5
	agilV	= npc_agil
	reactV	=											&! At the time there is not a varible in npcstat
	vitalV	= npc_vital
	intelV	= npc_intel
	willV	= (npc_intel * 5 + npc_sprt * 5)

	!Skills
	magikV = 1
	boxingV = 100
	shootV = 100

	!Parameters
	healthV = vitalV*10 + strenV*5
	mannaV = intelV*magikV + magikV*100 + vitalV*10
	willpowerV = willV*10
	BonusAtakV = 0
	BonusDefV = 0
