import re

def contains_numbers_and_words(text: str) -> bool:
    return bool(re.search(r'\d+', text)) and bool(re.search(r'[a-zA-Z]', text))