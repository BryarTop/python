import numpy as np 
from random import choice

def gather_user_input():
    is_valid_answer = False
    while not is_valid_answer:
        guess = input(f'Guess a number between 1 and 10: ')
        if guess.isdigit() and int(guess) <= 10 and int(guess) >= 1:
            return int(guess)
        else:
            print(f'\nThat is an invalid response.\n')

def comp_choice():
    return choice(range(1,11))

def choice_logic(comp_choice):
    guessed = False
    while not guessed:
        user_choice = gather_user_input()
        if user_choice > comp_choice:
            print('Too high! Guess again.')
        elif user_choice < comp_choice:
            print('Too low! Guess again.')
        elif user_choice == comp_choice:
            print('You guessed it! You won!')
            guessed = True
            return(keep_playing())

def keep_playing():
    is_valid_answer = False
    while not is_valid_answer:
        yes_no = input(f'\nWould you like to keep playing? (y/n): ')
        if yes_no == 'y':
            return True
        elif yes_no == 'n':
            return False

def play_game():
    play_on = True
    while play_on:
        number_to_guess = comp_choice()
        play_on = choice_logic(number_to_guess)
        
play_game()
