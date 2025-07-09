import re
from django.core.exceptions import ValidationError

def validate_username(value):
    # Kontrollera att användarnamnet följer mönstret: bokstäver + exakt 3 siffror
    pattern = r'^[a-zA-ZåäöÅÄÖ]+\d{3}$'
    if not re.match(pattern, value):
        raise ValidationError(
            'Användarnamnet måste vara bokstäver följt av exakt 3 siffror (t.ex. johan123)'
        )

def validate_password_complexity(value):
    if len(value) < 4:
        raise ValidationError('Lösenordet måste vara minst 4 tecken långt')
    
    has_letter = any(c.isalpha() for c in value)
    has_digit = any(c.isdigit() for c in value)
    has_special = any(not c.isalnum() for c in value)
    
    if not (has_letter and has_digit and has_special):
        raise ValidationError(
            'Lösenordet måste innehålla bokstäver, siffror och specialtecken'
        )

def validate_age(value):
    if value < 18:
        raise ValidationError('Du måste vara minst 18 år gammal')