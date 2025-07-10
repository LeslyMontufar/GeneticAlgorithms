import time
import random

def index2rowcol(index,lado):
	row = index//lado
	col = index%lado
	return row,col

def main(params:dict, update,close):
	lado = params.get("lado", 10)
	first_pos = params.get("first_pos",0)
 
	size = lado*lado
 
	moves = list(range(size))
 
	del moves[first_pos]
 
	random.shuffle(moves)
	moves.insert(0, first_pos)
	r0,c0 = index2rowcol(first_pos,lado)
 
	update({"run":True,"pos":first_pos ,"style_visit":'visited'})
 
	for index in range(1,size):
		# valida se  movimento é valido
		r1,c1 = index2rowcol(moves[index],lado)
		dr, dc = r1 - r0, c1 - c0
		r0,c0 = r1, c1
		if dr < dc:
			dr,dc = dc, dr
		style_visit = 'bad-visit'
		if dr == 2 and dc == 1:
			style_visit = 'visited'
		update({"run":True,"pos": moves[index],"style_visit":style_visit})
	update({"run":False})
		
	close()

