const validateValue = require('./validateValue');

describe('Валидация значений с применением функции validateValue()', () => {
    test('Корректное значение (50)', () => {
        expect(validateValue(50)).toBe(true);
    })

    test('Меньше корректного значения (-1)', () => {
        expect(validateValue(-1)).toBe(false);
    })

    test('Больше корректного значения (101)', () => {
        expect(validateValue(101)).toBe(false);
    })

    test('Пограничное значение снизу (0)', () => {
        expect(validateValue(0)).toBe(true);
    })

    test('Пограничное значение сверху (100)', () => {
        expect(validateValue(100)).toBe(true);
    })
})
