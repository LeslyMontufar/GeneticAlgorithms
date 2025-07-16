first_pos = (-1,-1)
lado = -1

MAXIMIZAR = True  # Set to True if you want to maximize fitness, False to minimize

def set_first_pos(row,col):
    global first_pos
    first_pos = (row, col)

def get_first_pos():
    return first_pos

def set_lado(value):
    global lado
    lado = value

def get_lado():
    return lado