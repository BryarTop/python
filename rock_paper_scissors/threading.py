from random import choice

def computer_choice():
    return choice(['Rock', 'Paper', 'Scissors'])

def gather_user_input():
    u_choice = input('Please choose one of the following:\n \
        1) Rock\n \
        2) Paper\n \
        3) Scissors\n')
    return u_choice

#accepts value and dict, checks equality and returns value
def substitution(val,obj):
    obj_items = list(obj.items())
    for o in obj_items:
        k,v = o
        if k == val:
            return v

def determine_winner(user,comp):
    if user == comp:
        return 'tie'
    elif (user == 'Rock' and comp == 'Paper') or (
        user == 'Paper' and comp == 'Scissors') or (
        user == 'Scissors' and comp == 'Rock'):
            return f'computer wins with {comp}'
    elif (comp == 'Rock' and user == 'Paper') or (
        comp == 'Paper' and user == 'Scissors') or (
        comp == 'Scissors' and user == 'Rock'):
            return f'you win with {user}'

def play_round():
    u_choice = None
    #define dict
    obj = {
            '1': 'Rock',
            '2': 'Paper',
            '3': 'Scissors'
        }

    while not u_choice:
        u_choice = substitution(gather_user_input(),obj)

    c_choice = computer_choice()
    print(determine_winner(u_choice, c_choice))

def play_again():
    kp = input('Would you like to play again?\n \
        1) Yes\n \
        2) No\n')
    return substitution(kp, {'1': True,'2':False})

keep_playing = True

while keep_playing:
    play_round()
    keep_playing = play_again()


