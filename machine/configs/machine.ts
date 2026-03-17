import type { ExerciseMachineConfig } from '@/entities/exercise'
import { change, check, copy, history, main, modal, notify, penalty, stage, status, step } from '@/entities/exercise'
import type { ExerciseTaskIdExact } from '@/entities/task'

export const MACHINE_CONFIG: Record<ExerciseTaskIdExact, ExerciseMachineConfig> = {
  'engine-warm': {
    initial: 'Действия до прогрева турбины',
    entry: main('Основная'),
    states: {
      'Действия до прогрева турбины': {
        type: 'parallel',
        entry: notify(` В работе насосы с приводом от электродвигателя поз. 103-J-J1/J2AM;
                      Насосы поз. 103-J-J1/J2Т заполнены маслом.
                      Необходимо: 
                      • проверить подачу охлаждающей воды;
                      • проверить наличие масла;
                      • выполнить прогрев турбины и вывод ее на рабочие обороты.
                      `),
        states: {
          'Включение воды': {
            initial: 'Ожидание включения воды',
            states: {
              'Ожидание включения воды': {
                on: {
                  'button_water.on': {
                    target: 'Ожидание загорания турбины',
                    actions: [
                      status('button_oil', 'Новый статус'),
                      change('Rectangle 1', { color: 'yellow' }),
                      step(2),
                    ],
                  },
                },
              },
              'Ожидание загорания турбины': {
                after: {
                  2000: {
                    actions: change('Rectangle 1', { color: 'green' }),
                    target: 'Вода включена',
                  },
                },
                on: {
                  stop: {
                    actions: change('Rectangle 1', { color: 'green' }),
                    target: 'Вода включена',
                  },
                },
              },
              'Вода включена': { type: 'final' },
            },
          },
          'Подача масла на левый насос': {
            initial: 'Ожидание подачи масла',
            states: {
              'Ожидание подачи масла': {
                on: {
                  'button_oil.click': [
                    {
                      guard: check('Union', s => s.range + 10 === 80),
                      actions: [
                        change('Union', { range: 80 }),
                        step(3),
                        notify('Перед прогревом турбины необходимо проверить подключение охлаждающей воды'),
                      ],
                      target: 'Масло подано',
                    },
                    {
                      actions: [change('Union', s => ({ range: s.range + 10 }))],
                    },
                  ],
                },
              },
              'Масло подано': { type: 'final' },
            },
          },
          'Подача масла на правый насос': {
            initial: 'Ожидание подачи масла',
            states: {
              'Ожидание подачи масла': {
                on: {
                  'button_oil_2.click': [
                    {
                      guard: check('Union_2', s => s.range + 10 === 80),
                      actions: [
                        change('Union_2', { range: 80 }),
                        step(4),
                        notify('Перед прогревом турбины необходимо проверить наличие масла'),
                      ],
                      target: 'Масло подано',
                    },
                    {
                      actions: [change('Union_2', s => ({ range: s.range + 10 }))],
                    },
                  ],
                },
              },
              'Масло подано': { type: 'final' },
            },
          },
        },
        onDone: {
          target: 'Ввести значения для демонстрации',
          actions: [stage('Действия до прогрева турбины'), notify('Турбина прогрета')],
        },
      },
      'Ввести значения для демонстрации': {
        initial: 'Ожидание',
        states: {
          Ожидание: {
            on: {
              'stop': {
                actions: [change('Rectangle 8_2', { text: 20 }), copy('Rectangle 8_2', 'Rectangle 8_3')],
                target: 'Завершено',
              },
              'panel__2.input.submit': [
                {
                  guard: { type: 'inputMatch', params: { expected: [0, 50] } },
                  actions: [
                    history('Поле ввода', { details: 'Введено верное значение' }),
                    change('Rectangle 8_2', ((state: any, event: any) => ({
                      text: String(event.value),
                    })) as any),
                    copy('Rectangle 8_2', 'Rectangle 8_3'),
                  ],
                  target: 'Завершено',
                },
                {
                  actions: [penalty('Неверное значение', '', -1), notify('Неверно')],
                  target: 'Ожидание',
                },
              ],
            } as any,
          },
          Завершено: {
            type: 'final',
            entry: step(5),
          },
        },
        onDone: { target: 'Регулировка скорости до 500' },
      },
      'Регулировка скорости до 500': {
        initial: 'Ожидание',
        states: {
          'Ожидание': {
            on: {
              'valve_10.500': {
                actions: step(6),
                target: 'Увеличение оборотов',
              },
            },
          },
          'Увеличение оборотов': {
            after: {
              20: [
                {
                  guard: check('Rectangle 8', s => Number(s.text) >= 500),
                  target: 'Скорость набрана',
                },
                {
                  actions: change('Rectangle 8', state => ({ text: Number(state.text) + 10 })),
                  target: 'Увеличение оборотов',
                  reenter: true,
                },
              ],
            },
            on: {
              stop: { target: 'Скорость набрана' },
            },
          },
          'Скорость набрана': {
            type: 'final',
            entry: change('Rectangle 8', { text: 500 }),
          },
        },
        onDone: { target: 'Регулировка скорости до 3000' },
      },
      'Регулировка скорости до 3000': {
        initial: 'Ожидание',
        states: {
          'Ожидание': {
            on: {
              'valve_10.3000': {
                actions: step(7),
                target: 'Увеличение оборотов',
              },
            },
          },
          'Увеличение оборотов': {
            after: {
              20: [
                {
                  guard: check('Rectangle 8', s => Number(s.text) >= 3000),
                  target: 'Скорость набрана',
                },
                {
                  actions: change('Rectangle 8', state => ({ text: Number(state.text) + 40 })),
                  target: 'Увеличение оборотов',
                  reenter: true,
                },
              ],
            },
            on: {
              stop: {
                actions: change('Rectangle 8', { text: 3000 }),
                target: 'Скорость набрана',
              },
            },
          },
          'Скорость набрана': {
            type: 'final',
            entry: change('Rectangle 8', { text: 3000 }),
          },
        },
        onDone: { target: 'Взведение автомата безопасности' },
      },
      'Взведение автомата безопасности': {
        on: {
          'equipment_9.raise': {
            actions: [change('Rectangle 6', { rotate: 90 }), step(8)],
            target: 'Открытие клапанов',
          },
        },
      },
      'Открытие клапанов': {
        type: 'parallel',
        states: {
          'Открытие клапана 2': {
            initial: 'Ожидание открытия клапана 2',
            states: {
              'Ожидание открытия клапана 2': {
                on: {
                  'valve_2_2.partially': {
                    actions: [change('valve_2_2', { color: 'yellow' }), step(10)],
                    target: 'Клапан 2 открыт',
                  },
                },
              },
              'Клапан 2 открыт': { type: 'final' },
            },
          },
          'Открытие клапанов 1 и 3': {
            type: 'parallel',
            states: {
              'Открытие клапана 1': {
                initial: 'Ожидание открытия клапана 1',
                states: {
                  'Ожидание открытия клапана 1': {
                    on: {
                      'valve_1.open': {
                        actions: [change('valve_1', { color: 'green' }), step(9)],
                        target: 'Клапан 1 открыт',
                      },
                    },
                  },
                  'Клапан 1 открыт': { type: 'final' },
                },
              },
              'Открытие клапана 3': {
                initial: 'Ожидание открытия клапана 3',
                states: {
                  'Ожидание открытия клапана 3': {
                    on: {
                      'valve_3.open': {
                        target: 'Настройка клапана 3',
                      },
                    },
                  },
                  'Настройка клапана 3': {
                    initial: 'Ожидание',
                    entry: modal('ГТУ 8', 'Кастом'),
                    states: {
                      'Ожидание': {
                        on: {
                          'button_deformation.click': {
                            actions: [change('Group 17_2', { color: 'yellow' }), step(11)],
                            target: 'Загорание лампочки',
                          },
                        },
                      },
                      'Загорание лампочки': {
                        after: {
                          1000: { target: 'Конец' },
                        },
                        on: {
                          stop: { target: 'Конец' },
                        },
                      },
                      'Конец': { type: 'final' },
                    },
                    on: {
                      close: {
                        target: 'Ожидание открытия клапана 3',
                      },
                    },
                    onDone: {
                      target: 'Клапан 3 открыт',
                    },
                    exit: modal(),
                  },
                  'Клапан 3 открыт': { type: 'final' },
                },
              },
            },
            onDone: {
              target: '#Конец',
            },
          },
        },
      },
      'Конец': { id: 'Конец', type: 'final' },
    },
  },
  'engine-start': {
    initial: 'Действия до прогрева турбины',
    entry: main('Основная'),
    states: {
      'Действия до прогрева турбины': {
        type: 'parallel',
        entry: notify(` В работе насосы с приводом от электродвигателя поз. 103-J-J1/J2AM;
                      Насосы поз. 103-J-J1/J2Т заполнены маслом.
                      Необходимо: 
                      • проверить подачу охлаждающей воды;
                      • проверить наличие масла;
                      • выполнить прогрев турбины и вывод ее на рабочие обороты.
                      `),
        states: {
          'Включение воды': {
            initial: 'Ожидание включения воды',
            states: {
              'Ожидание включения воды': {
                on: {
                  'button_water.on': {
                    target: 'Ожидание загорания турбины',
                    actions: [change('Rectangle 1', { color: 'yellow' }), step(2)],
                  },
                },
              },
              'Ожидание загорания турбины': {
                after: {
                  2000: {
                    actions: change('Rectangle 1', { color: 'green' }),
                    target: 'Вода включена',
                  },
                },
                on: {
                  stop: {
                    actions: change('Rectangle 1', { color: 'green' }),
                    target: 'Вода включена',
                  },
                },
              },
              'Вода включена': { type: 'final' },
            },
          },
          'Подача масла на левый насос': {
            initial: 'Ожидание подачи масла',
            states: {
              'Ожидание подачи масла': {
                on: {
                  'button_oil.click': [
                    {
                      guard: check('Union', s => s.range + 10 === 80),
                      actions: [
                        change('Union', { range: 80 }),
                        step(3),
                        notify('Перед прогревом турбины необходимо проверить подключение охлаждающей воды'),
                      ],
                      target: 'Масло подано',
                    },
                    {
                      actions: [change('Union', s => ({ range: s.range + 10 }))],
                    },
                  ],
                },
              },
              'Масло подано': { type: 'final' },
            },
          },
          'Подача масла на правый насос': {
            initial: 'Ожидание подачи масла',
            states: {
              'Ожидание подачи масла': {
                on: {
                  'button_oil_2.click': [
                    {
                      guard: check('Union_2', s => s.range + 10 === 80),
                      actions: [
                        change('Union_2', { range: 80 }),
                        step(4),
                        notify('Перед прогревом турбины необходимо проверить наличие масла'),
                      ],
                      target: 'Масло подано',
                    },
                    {
                      actions: [change('Union_2', s => ({ range: s.range + 10 }))],
                    },
                  ],
                },
              },
              'Масло подано': { type: 'final' },
            },
          },
        },
        onDone: {
          target: 'Регулировка скорости до 500',
          actions: [stage('Действия до прогрева турбины'), notify('Турбина прогрета')],
        },
      },
      'Регулировка скорости до 500': {
        initial: 'Ожидание',
        states: {
          'Ожидание': {
            on: {
              'valve_10.500': {
                actions: step(5),
                target: 'Увеличение оборотов',
              },
            },
          },
          'Увеличение оборотов': {
            after: {
              20: [
                {
                  guard: check('Rectangle 8', s => Number(s.text) >= 500),
                  target: 'Скорость набрана',
                },
                {
                  actions: change('Rectangle 8', state => ({ text: Number(state.text) + 10 })),
                  target: 'Увеличение оборотов',
                  reenter: true,
                },
              ],
            },
            on: {
              stop: { target: 'Скорость набрана' },
            },
          },
          'Скорость набрана': {
            type: 'final',
            entry: change('Rectangle 8', { text: 500 }),
          },
        },
        onDone: { target: 'Регулировка скорости до 3000' },
      },
      'Регулировка скорости до 3000': {
        initial: 'Ожидание',
        states: {
          'Ожидание': {
            on: {
              'valve_10.3000': {
                actions: step(6),
                target: 'Увеличение оборотов',
              },
            },
          },
          'Увеличение оборотов': {
            after: {
              20: [
                {
                  guard: check('Rectangle 8', s => Number(s.text) >= 3000),
                  target: 'Скорость набрана',
                },
                {
                  actions: change('Rectangle 8', state => ({ text: Number(state.text) + 40 })),
                  target: 'Увеличение оборотов',
                  reenter: true,
                },
              ],
            },
            on: {
              stop: {
                actions: change('Rectangle 8', { text: 3000 }),
                target: 'Скорость набрана',
              },
            },
          },
          'Скорость набрана': {
            type: 'final',
            entry: change('Rectangle 8', { text: 3000 }),
          },
        },
        onDone: { target: 'Взведение автомата безопасности' },
      },
      'Взведение автомата безопасности': {
        on: {
          'equipment_9.raise': {
            actions: [change('Rectangle 6', { rotate: 90 }), step(7)],
            target: 'Открытие клапанов',
          },
        },
      },
      'Открытие клапанов': {
        type: 'parallel',
        states: {
          'Открытие клапана 2': {
            initial: 'Ожидание открытия клапана 2',
            states: {
              'Ожидание открытия клапана 2': {
                on: {
                  'valve_2_2.partially': {
                    actions: [change('valve_2_2', { color: 'yellow' }), step(9)],
                    target: 'Клапан 2 открыт',
                  },
                },
              },
              'Клапан 2 открыт': { type: 'final' },
            },
          },
          'Открытие клапанов 1 и 3': {
            type: 'parallel',
            states: {
              'Открытие клапана 1': {
                initial: 'Ожидание открытия клапана 1',
                states: {
                  'Ожидание открытия клапана 1': {
                    on: {
                      'valve_1.open': {
                        actions: [change('valve_1', { color: 'green' }), step(8)],
                        target: 'Клапан 1 открыт',
                      },
                    },
                  },
                  'Клапан 1 открыт': { type: 'final' },
                },
              },
              'Открытие клапана 3': {
                initial: 'Ожидание открытия клапана 3',
                states: {
                  'Ожидание открытия клапана 3': {
                    on: {
                      'valve_3.open': {
                        target: 'Настройка клапана 3',
                      },
                    },
                  },
                  'Настройка клапана 3': {
                    initial: 'Ожидание',
                    entry: modal('ГТУ 8'),
                    states: {
                      'Ожидание': {
                        on: {
                          'button_deformation.click': {
                            actions: [change('Group 17_2', { color: 'yellow' }), step(10)],
                            target: 'Загорание лампочки',
                          },
                        },
                      },
                      'Загорание лампочки': {
                        after: {
                          1000: { target: 'Конец' },
                        },
                        on: {
                          stop: { target: 'Конец' },
                        },
                      },
                      'Конец': { type: 'final' },
                    },
                    on: {
                      close: {
                        target: 'Ожидание открытия клапана 3',
                      },
                    },
                    onDone: {
                      target: 'Клапан 3 открыт',
                    },
                    exit: modal(),
                  },
                  'Клапан 3 открыт': { type: 'final' },
                },
              },
            },
            onDone: {
              target: '#Конец',
            },
          },
        },
      },

      'Конец': { id: 'Конец', type: 'final' },
    },
  },
  'hydraulic-test': {
    initial: 'Осмотр оборудования',
    entry: main('Гидравлическая'),
    states: {
      'Осмотр оборудования': {
        on: {
          reset: { target: 'Осмотр оборудования' },
        },
        entry: [
          step(1),
          notify(`1. Уровень воды в деаэраторе нормальный (средний);
2. Качество питательной воды отвечает нормативным требованиям;
3. Закрыты лазовые люки на барабанах котлов-утилизаторов, пароперегревателях и экономайзерах;
4. Включены манометры, открыты краны и соответствующие вентили;
5. Открыты краны водоуказательных колонок на барабане котла-утилизатора и закрыты сбросовые краны, включено освещение водоуказательных колонок`),
          stage('Осмотр оборудования'),
        ],
        after: {
          3000: {
            target: 'Закрытие задвижек 21 и 22',
          },
        },
      },

      'Закрытие задвижек 21 и 22': {
        type: 'parallel',
        states: {
          'Закрытие задвижки 21': {
            initial: 'Ожидание закрытия 21',
            states: {
              'Ожидание закрытия 21': {
                on: {
                  'button_21.click': {
                    target: 'Закрыта',
                    actions: [status('valve_21', 'Закрыта'), change('valve_21', { color: '#FD0000' })],
                  },
                },
              },
              'Закрыта': { type: 'final' },
            },
          },
          'Закрытие задвижки 22': {
            initial: 'Ожидание закрытия 22',
            states: {
              'Ожидание закрытия 22': {
                on: {
                  'button_22.click': {
                    target: 'Закрыта',
                    actions: [status('valve_22', 'Закрыта'), change('valve_22', { color: '#FD0000' })],
                  },
                },
              },
              'Закрыта': { type: 'final' },
            },
          },
        },
        onDone: {
          target: 'Открытие клапана 00R11S001',
        },
      },

      'Открытие клапана 00R11S001': {
        initial: 'Ожидание открытия',
        states: {
          'Ожидание открытия': {
            on: {
              'button_99.click': {
                target: 'Ввод значения',
              },
            },
          },

          'Ввод значения': {
            entry: [modal('Гидропанель', 'Установите значение 5-10%')],
            exit: modal(),
            on: {
              'button_da.click': [
                {
                  guard: { type: 'inputMatch', params: { expected: [5, 10] } },
                  actions: [
                    change('valve_OORL11S001', { range: 7, color: '#00B20F' }),
                    status('valve_OORL11S001', 'Открыт на 5-10%'),
                    change('panel_00RL11H001', { text: '10%' }),
                    change('panel_TT-14', { text: '40°C' }),
                    change('panel_P-2408', { text: '3.0' }),
                    change('panel_P-2411', { text: '2.90' }),
                    change('panel_P-2306', { text: '2.80' }),
                    step(3),
                    notify('Вода заполнила ЭКО 4А, с дренажа №1 и воздушника №2 идет вода'),
                  ],
                  target: 'Клапан открыт',
                },
                {
                  actions: [penalty('Неверное значение', 'Должно быть 5-10%', -1)],
                  target: 'Ввод значения',
                },
              ],
              'button_otmena.click': {
                target: 'Ожидание открытия',
              },
            },

            initial: 'value_0',
            states: {
              value_0: {
                entry: change('panel_3', { text: '0,0' }),
                on: {
                  '1.click': 'value_1',
                  '5.click': 'value_5',
                },
              },
              value_1: {
                entry: change('panel_3', { text: '1,0' }),
                on: {
                  '-1.click': 'value_0',
                  '1.click': 'value_2',
                  '5.click': 'value_6',
                },
              },
              value_2: {
                entry: change('panel_3', { text: '2,0' }),
                on: {
                  '-1.click': 'value_1',
                  '1.click': 'value_3',
                  '5.click': 'value_7',
                },
              },
              value_3: {
                entry: change('panel_3', { text: '3,0' }),
                on: {
                  '-1.click': 'value_2',
                  '1.click': 'value_4',
                  '5.click': 'value_8',
                },
              },
              value_4: {
                entry: change('panel_3', { text: '4,0' }),
                on: {
                  '-1.click': 'value_3',
                  '1.click': 'value_5',
                  '5.click': 'value_9',
                },
              },
              value_5: {
                entry: change('panel_3', { text: '5,0' }),
                on: {
                  '-5.click': 'value_0',
                  '-1.click': 'value_4',
                  '1.click': 'value_6',
                  '5.click': 'value_10',
                },
              },
              value_6: {
                entry: change('panel_3', { text: '6,0' }),
                on: {
                  '-5.click': 'value_1',
                  '-1.click': 'value_5',
                  '1.click': 'value_7',
                },
              },
              value_7: {
                entry: change('panel_3', { text: '7,0' }),
                on: {
                  '-5.click': 'value_2',
                  '-1.click': 'value_6',
                  '1.click': 'value_8',
                },
              },
              value_8: {
                entry: change('panel_3', { text: '8,0' }),
                on: {
                  '-5.click': 'value_3',
                  '-1.click': 'value_7',
                  '1.click': 'value_9',
                },
              },
              value_9: {
                entry: change('panel_3', { text: '9,0' }),
                on: {
                  '-5.click': 'value_4',
                  '-1.click': 'value_8',
                  '1.click': 'value_10',
                },
              },
              value_10: {
                entry: change('panel_3', { text: '10,0' }),
                on: {
                  '-5.click': 'value_5',
                  '-1.click': 'value_9',
                },
              },
            },
          },

          'Клапан открыт': { type: 'final' },
        },
        onDone: { target: 'Закрытие дренажа №1' },
      },

      // Шаг 3 (подшаг) — закрытие дренажа №1 с таймером 10 минут
      'Закрытие дренажа №1': {
        initial: 'Ожидание закрытия',
        states: {
          'Ожидание закрытия': {
            on: {
              'button_1.click': {
                target: 'Таймер 10 мин',
                actions: [status('valve_1', 'Закрыт (дренаж №1)'), change('valve_1', { color: '#FD0000' })],
              },
            },
          },
          'Таймер 10 мин': {
            entry: notify('Таймер: 10 минут (от 10 до 0 мин)'),
            after: {
              600000: {
                // 10 минут = 600000 мс
                target: 'Завершено',
              },
            },
          },
          'Завершено': {
            type: 'final',
            entry: step(4),
          },
        },
        onDone: { target: 'Закрытие воздушника №2' },
      },

      'Закрытие воздушника №2': {
        on: {
          'button_2.click': {
            target: 'Закрытие дренажа №3',
            actions: [status('valve_2', 'Закрыт (воздушник №2)'), change('valve_2', { color: '#FD0000' }), step(5)],
          },
        },
      },

      'Закрытие дренажа №3': {
        on: {
          'button_3.click': {
            target: 'Закрытие дренажа №5',
            actions: [
              status('valve_3', 'Закрыт (дренаж №3)'),
              change('valve_3', { color: '#FD0000' }),
              step(6),
              notify('Вода заполнила ЭКО 3В, с дренажа №5 и воздушника №6 идет вода'),
            ],
          },
        },
      },

      'Закрытие дренажа №5': {
        on: {
          'button_5.click': {
            target: 'Закрытие воздушника №6',
            actions: [
              status('valve_5', 'Закрыт (дренаж №5)'),
              change('valve_5', { color: '#FD0000' }),
              step(8), // Пропускаем 7 — в документе пусто
            ],
          },
        },
      },

      'Закрытие воздушника №6': {
        on: {
          'button_6.click': {
            target: 'Закрытие задвижки 7',
            actions: [
              status('valve_6', 'Закрыт (воздушник №6)'),
              change('valve_6', { color: '#FD0000' }),
              step(9),
              notify('Вода заполнена до питательного узла, с дренажей №7,9 и воздушников №8,10 идет вода'),
            ],
          },
        },
      },

      // Последовательное закрытие 7-10 (не параллельное!)
      'Закрытие задвижки 7': {
        on: {
          'button_7.click': {
            target: 'Закрытие задвижки 8',
            actions: [status('valve_7', 'Закрыта'), change('valve_7', { color: '#FD0000' }), step(10)],
          },
        },
      },

      'Закрытие задвижки 8': {
        on: {
          'button_8.click': {
            target: 'Закрытие задвижки 9',
            actions: [status('valve_8', 'Закрыта'), change('valve_8', { color: '#FD0000' }), step(11)],
          },
        },
      },

      'Закрытие задвижки 9': {
        on: {
          'button_9.click': {
            target: 'Закрытие задвижки 10',
            actions: [status('valve_9', 'Закрыта'), change('valve_9', { color: '#FD0000' }), step(12)],
          },
        },
      },

      'Закрытие задвижки 10': {
        on: {
          'button_10.click': {
            target: 'Пуск ПЭН на циркуляцию',
            actions: [status('valve_10', 'Закрыта'), change('valve_10', { color: '#FD0000' }), step(13)],
          },
        },
      },

      'Пуск ПЭН на циркуляцию': {
        on: {
          'button_98.click': {
            target: 'Закрытие дренажа №11',
            actions: [
              status('pump', 'Работает на рециркуляцию'),
              status('valve_OORL11S001', '10% (максимум)'),
              change('pump', { color: 'green' }),
              change('panel_P-2408', { text: '4.50' }),
              change('panel_P-2411', { text: '4.50' }),
              change('panel_P-2306', { text: '4.50' }),
              change('panel_P-2415', { text: '4.50' }),
              change('panel_P-9457', { text: '4.50' }),
              step(14),
              notify('Вода заполнила ЭКО 4С, с дренажа №11 и воздушника №12 идет вода'),
            ],
          },
        },
      },

      'Закрытие дренажа №11': {
        on: {
          'button_11.click': {
            target: 'Закрытие воздушника №12',
            actions: [status('valve_11', 'Закрыт (дренаж №11)'), change('valve_11', { color: '#FD0000' }), step(15)],
          },
        },
      },

      'Закрытие воздушника №12': {
        on: {
          'button_12.click': {
            target: 'Заполнение котла-утилизатора',
            actions: [status('valve_12', 'Закрыт (воздушник №12)'), change('valve_12', { color: '#FD0000' }), step(16)],
          },
        },
      },

      'Заполнение котла-утилизатора': {
        initial: 'Ожидание заполнения',
        states: {
          'Ожидание заполнения': {
            entry: [
              notify('1) Вода заполняет КУ'),
              // Начальные уровни -590 мм (красные)
              change('panel_L-9401', { text: '-590', color: 'red' }),
              change('panel_L-9409', { text: '-590', color: 'red' }),
              change('panel_L-9410', { text: '-590', color: 'red' }),
              change('panel_L-9411', { text: '-590', color: 'red' }),
            ],
            after: {
              30000: {
                target: 'Заполнение завершено',
                actions: [
                  // Уровни +700 мм
                  status('panel_L-9401', '+700 мм'),
                  status('panel_L-9409', '+700 мм'),
                  status('panel_L-9410', '+700 мм'),
                  status('panel_L-9411', '+700 мм'),
                  change('panel_L-9401', { text: '+700', color: 'green' }),
                  change('panel_L-9409', { text: '+700', color: 'green' }),
                  change('panel_L-9410', { text: '+700', color: 'green' }),
                  change('panel_L-9411', { text: '+700', color: 'green' }),
                  // Давление 4.50 МПа
                  change('panel_P-9403', { text: '4.50' }),
                  change('panel_P-9452', { text: '4.50' }),
                  change('panel_P-2421', { text: '4.50' }),
                  change('panel_P-2424', { text: '4.50' }),
                  change('panel_P-2226', { text: '4.50' }),
                  notify('2) Пошла вода с воздушника №14,16,17,18,19,20 и свеча VP-2'),
                  notify('Уровень достиг +700 мм, давление поднялось до 4.50 МПа'),
                ],
              },
            },
          },
          'Заполнение завершено': {
            type: 'final',
          },
        },
        onDone: { target: 'Закрытие воздушников 14-20 и свечей' },
      },

      'Закрытие воздушников 14-20 и свечей': {
        type: 'parallel',
        states: {
          'Закрытие 14': {
            initial: 'Ожидание',
            states: {
              Ожидание: {
                on: {
                  'button_14.click': {
                    target: 'Закрыт',
                    actions: [status('valve_14', 'Закрыт'), change('valve_14', { color: '#FD0000' }), step(17)],
                  },
                },
              },
              Закрыт: { type: 'final' },
            },
          },
          'Закрытие 16': {
            initial: 'Ожидание',
            states: {
              Ожидание: {
                on: {
                  'button_16.click': {
                    target: 'Закрыт',
                    actions: [status('valve_16', 'Закрыт'), change('valve_16', { color: '#FD0000' }), step(18)],
                  },
                },
              },
              Закрыт: { type: 'final' },
            },
          },
          'Закрытие 17': {
            initial: 'Ожидание',
            states: {
              Ожидание: {
                on: {
                  'button_17.click': {
                    target: 'Закрыт',
                    actions: [status('valve_17', 'Закрыт'), change('valve_17', { color: '#FD0000' }), step(19)],
                  },
                },
              },
              Закрыт: { type: 'final' },
            },
          },
          'Закрытие 18': {
            initial: 'Ожидание',
            states: {
              Ожидание: {
                on: {
                  'button_18.click': {
                    target: 'Закрыт',
                    actions: [status('valve_18', 'Закрыт'), change('valve_18', { color: '#FD0000' }), step(20)],
                  },
                },
              },
              Закрыт: { type: 'final' },
            },
          },
          'Закрытие 19': {
            initial: 'Ожидание',
            states: {
              Ожидание: {
                on: {
                  'button_19.click': {
                    target: 'Закрыт',
                    actions: [status('valve_19', 'Закрыт'), change('valve_19', { color: '#FD0000' }), step(21)],
                  },
                },
              },
              Закрыт: { type: 'final' },
            },
          },
          'Закрытие 20': {
            initial: 'Ожидание',
            states: {
              Ожидание: {
                on: {
                  'button_20.click': {
                    target: 'Закрыт',
                    actions: [status('valve_20', 'Закрыт'), change('valve_20', { color: '#FD0000' }), step(22)],
                  },
                },
              },
              Закрыт: { type: 'final' },
            },
          },
          'Закрытие XV-114': {
            initial: 'Ожидание',
            states: {
              Ожидание: {
                on: {
                  'button_97.click': {
                    target: 'Закрыт',
                    actions: [
                      status('valve_XV-114', 'Закрыта'),
                      change('valve_XV-114', { color: '#FD0000' }),
                      step(23),
                    ],
                  },
                },
              },
              Закрыт: { type: 'final' },
            },
          },
          'Закрытие VP-2': {
            initial: 'Ожидание',
            states: {
              Ожидание: {
                on: {
                  'button_96.click': {
                    target: 'Закрыт',
                    actions: [
                      status('valve_VP-2', 'Закрыта'),
                      change('valve_VP-2', { color: '#FD0000' }),
                      notify('1) Начались гидравлические испытания'),
                    ],
                  },
                },
              },
              Закрыт: { type: 'final' },
            },
          },
        },
        onDone: { target: 'Гидравлические испытания' },
      },

      'Гидравлические испытания': {
        initial: 'Испытания',
        states: {
          'Испытания': {
            entry: [stage('Гидравлические испытания'), notify('Таймер: 10 минут (обратный отсчет)')],
            after: {
              600000: {
                // 10 минут
                target: 'Испытания завершены',
                actions: [notify('2) Гидравлические испытания в течение 10 минут успешно завершены')],
              },
            },
          },
          'Испытания завершены': {
            type: 'final',
            entry: step(24),
          },
        },
        onDone: { target: 'Остановка ПЭН' },
      },

      'Остановка ПЭН': {
        on: {
          'button_98.click': {
            target: 'Слив паропровода',
            actions: [status('pump', 'Остановлен'), change('pump', { color: '#9E9E9E' }), step(25)],
          },
        },
      },

      'Слив паропровода': {
        entry: [
          change('panel_P-9432', { text: '0' }),
          change('panel_P-2421', { text: '0' }),
          change('panel_P-2424', { text: '0' }),
          change('panel_P-2207', { text: '0' }),
          change('panel_P-2226', { text: '0' }),
          notify('Паропровод опорожнен от воды'),
        ],
        after: {
          3000: { target: 'Финальный осмотр' },
        },
      },

      'Финальный осмотр': {
        entry: [stage('Завершение работы'), notify('Обход коммуникаций')],
        after: {
          3000: { target: 'Конец' },
        },
      },

      'Конец': {
        type: 'final',
        entry: [
          notify(
            'Задание выполнено: Запитать КУ поз.94, провести гидравлические испытания паропровода до ГПЗ, слить паропровод',
          ),
        ],
      },
    },
  },
}
