CHAPTER = [
    {'Wprowadzenie': 'gramatyka/skladnia/zdania-zlozone/index.md'},
    {'Ile informacji i ile orzeczeń?': 'gramatyka/skladnia/zdania-zlozone/ile-informacji-ile-orzeczen.md'},
    {'Zdania składowe i elementy wspólne': 'gramatyka/skladnia/zdania-zlozone/zdania-skladowe-i-elementy-wspolne.md'},
    {'Podstawy współrzędności': 'gramatyka/skladnia/zdania-zlozone/wspolrzednosc-podstawy.md'},
    {'Łączne, rozłączne, przeciwstawne i wynikowe': 'gramatyka/skladnia/zdania-zlozone/zdania-wspolrzedne-laczne-rozlaczne-przeciwstawne-i-wynikowe.md'},
    {'Część nadrzędna i podrzędna': 'gramatyka/skladnia/zdania-zlozone/podrzednosc-nadrzedne-i-podrzedne.md'},
    {'Podmiotowe i orzecznikowe': 'gramatyka/skladnia/zdania-zlozone/zdania-podmiotowe-i-orzecznikowe.md'},
    {'Dopełnieniowe i przydawkowe': 'gramatyka/skladnia/zdania-zlozone/zdania-dopelnieniowe-i-przydawkowe.md'},
    {'Zdania okolicznikowe': 'gramatyka/skladnia/zdania-zlozone/zdania-okolicznikowe.md'},
    {'Spójniki, zaimki i wskaźniki': 'gramatyka/skladnia/zdania-zlozone/spojniki-zaimki-i-wskazniki-zespolenia.md'},
    {'Wykresy zdań złożonych': 'gramatyka/skladnia/zdania-zlozone/wykresy-zdan-zlozonych.md'},
    {'Interpunkcja wynikająca z budowy': 'gramatyka/skladnia/zdania-zlozone/interpunkcja.md'},
    {'Granice klasyfikacji': 'gramatyka/skladnia/zdania-zlozone/granice-klasyfikacji.md'},
    {'Zdania złożone w tekście': 'gramatyka/skladnia/zdania-zlozone/zdania-zlozone-w-tekscie.md'},
]

def on_config(config):
    for item in config['nav']:
        if isinstance(item, dict) and 'Gramatyka' in item:
            for grammar in item['Gramatyka']:
                if isinstance(grammar, dict) and 'Składnia' in grammar:
                    for syntax in grammar['Składnia']:
                        if isinstance(syntax, dict) and 'Zdania złożone' in syntax:
                            syntax['Zdania złożone'] = CHAPTER
                            return config
    raise RuntimeError('Brak sekcji Zdania złożone w nawigacji')
