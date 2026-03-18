# 1. Створіть програму, яка виводить на екран від 1 до 10.
def print_nums():
    for i in range(1, 11):
        print(i)


print_nums()


# 1. Напишіть програму, яка знаходить середнє значення з трьох чисел, введених користувачем.
def average():
    print('Enter 3 number: ')
    total = 0

    for i in range(3):
        num = input(f'Number {i + 1}: ')
        total += float(num)

    print(total / 3)


# 1. Реалізуйте програму, яка приймає на вхід рік народження користувача та виводить його вік.
from datetime import datetime


def get_age():
    birth_date = input('Enter birth date (YYYY-MM-DD): ')

    birth_date = datetime.strptime(birth_date, '%Y-%m-%d')
    today = datetime.today()

    age = today.year - birth_date.year

    if (today.month, today.day) < (birth_date.month, birth_date.day):
        age -= 1

    print(f'Your age is: {age}')


# 1. Напишіть клас "Книга" з властивостями, такими як назва, автор та рік видання.
# Створіть об'єкт цього класу та виведіть його характеристики.
class Book:
    def __init__(self, title, author, year_of_publication):
        self.title = title
        self.author = author
        self.year_of_publication = year_of_publication


book = Book('Ловець у житі', 'Девід Селінджер', 1951);
print(f'Назва: {book.title}, Автор: {book.author}, Рік: {book.year_of_publication}')
