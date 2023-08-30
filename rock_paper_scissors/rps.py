from random import choice

def computer_choice():
    return choice(['Rock','Paper','Scissors'])

def user_choice():
    u_choice = input('Please Choose One of the following:\n \
        1) Rock\n \
        2) Paper\n \
        3) Scissors\n')
    return u_choice

def imputation(val):
    if val == '1':
        return 'Rock'
    elif val == '2':
        return 'Paper'
    elif val == '3':
        return 'Scissors'

def winner(u,c):
   u = imputation(u)
   if c == u:
       return 'Tie'
   elif (u == 'Rock' and c == 'Paper') or (u == 'Paper' and c == 'Scissors') or (u == 'Scissors' and c == 'Rock'):
       return f'computer wins with {c}'
   elif (c == 'Rock' and u == 'Paper') or (c == 'Paper' and u == 'Scissors') or (c == 'Scissors' and u == 'Rock'):
       return f'you win with {u}'

def play_game():
    u_choice = None

    while not u_choice:
        u_choice = user_choice()
        if u_choice not in ['1','2','3']:
            print("Please choose 1, 2, or 3\n\n")
            u_choice = None

    c_choice = computer_choice()

    print(winner(u_choice,c_choice))

def play_again_input():
    kp = input('Would you like to play again?\n \
            1) Yes\n \
            2) No \n')
    return kp

def play_again_parse():
    kp_choice = None
    while not kp_choice:
        kp_choice = play_again_input()
        if kp_choice not in ['1','2']:
            print("Please choose a valid answer.\n")
            kp_choice = None
        else:
            if kp_choice == '1':
                return True
            elif kp_choice == '2':
                return False


keep_playing = True 

while keep_playing:
    play_game()
    keep_playing = play_again_parse()
