def get_choice():
    conv = input( 
        """which conversion would you like to perform?
        1)km -> mi
        2)mi -> km\n"""
    )
    return conv

def infer_choice(choice):
    if choice == '1':
        return {"choice": 'km', 
                'opp_ch': 'mi',
                'num': 0.621371}
    elif choice == '2':
        return {"choice": 'mi', 
               'opp_ch': 'km',
                'num': 1.609344}
    else:
        return None

def conversion_outline(calc):
    name1 = calc.get('opp_ch')
    name2 = calc.get('choice')
    val = input(
            f"\n How many {name2} would you like to convert into {name1}?\n" 
            )
    return "value: " + str(round(float(val) * float(calc.get('num')),2)) + \
         f" {calc.get('opp_ch')}"

#create object that will be used for next input and final calculation
opt = infer_choice(get_choice())

#loop to ensure that permissable value was submitted
while opt == None:
    opt = infer_choice(get_choice())

print(conversion_outline(opt))
