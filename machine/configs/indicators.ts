import type { SchemeIndicator } from '@/entities/exercise'

export const INDICATORS_CONFIG = [
  // Левое окно заполнения маслом
  {
    id: 'Union',
    scheme: 'Основная',
    params: {
      range: {
        value: [0, 100],
        color: { hsl: { h: [60, 0] }, group: 'g > path:first-of-type' },
      },
    },
  },

  // Правое окно заполнения маслом
  {
    id: 'Union_2',
    scheme: 'Основная',
    params: {
      range: {
        value: [0, 100],
        color: { hsl: { h: [60, 0] }, group: 'g > path:first-of-type' },
      },
    },
  },

  // Окно с текстом
  {
    id: 'Rectangle 8',
    scheme: 'Основная',
    params: {
      text: {
        textId: '0',
      },
    },
  },

  {
    id: 'button_oil',
    scheme: 'Основная',
    params: {
      status: {
        text: '',
      },
    },
  },

  // Клапаны 1,2,3
  {
    id: 'valve_1',
    scheme: 'Основная',
    params: {
      color: {
        group: 'g > path:first-of-type',
      },
    },
  },
  {
    id: 'valve_2_2',
    scheme: 'Основная',
    params: {
      color: {
        group: 'g > path:first-of-type',
      },
    },
  },
  {
    id: 'valve_3',
    scheme: 'Основная',
    params: {
      color: {
        group: 'g > path:first-of-type',
      },
    },
  },

  // Автомат безопасности
  {
    id: 'Rectangle 6',
    scheme: 'Основная',
    params: {
      rotate: {
        origin: '2px 3px',
      },
    },
  },

  // Турбина
  {
    id: 'Rectangle 1',
    scheme: 'Основная',
    params: {
      color: {},
      range: {
        value: [0, 100],
        size: {
          origin: 'bottom',
          axis: 'y',
        },
      },
    },
  },

  // Ломпочка основ ГТУ-8
  {
    id: 'Group 17_2',
    scheme: 'ГТУ 8',
    params: {
      color: {
        group: 'g > path:nth-of-type(2), :scope > path:last-of-type',
      },
    },
  },

  // для демонстрации input и copy
  {
    id: 'Rectangle 8_2',
    scheme: 'Основная',
    params: {
      text: {
        textId: '0_2',
      },
    },
  },
  {
    id: 'Rectangle 8_3',
    scheme: 'Основная',
    params: {
      text: {
        textId: '0_3',
      },
    },
  },
  // ========== ГИДРАВЛИЧЕСКАЯ СХЕМА ==========

  // Клапаны и задвижки (все открыты - зеленые)
  {
    id: 'valve_1',
    scheme: 'Гидравлическая',
    params: {
      color: {
        group: 'g > path:first-of-type',
      },
    },
  },
  {
    id: 'valve_2',
    scheme: 'Гидравлическая',
    params: {
      range: {
        value: [0, 100],
      },
      color: {
        group: 'g > path:first-of-type',
      },
    },
  },
  {
    id: 'valve_3',
    scheme: 'Гидравлическая',
    params: {
      color: {
        group: 'g > path:first-of-type',
      },
    },
  },
  {
    id: 'valve_5',
    scheme: 'Гидравлическая',
    params: {
      color: {
        group: 'g > path:first-of-type',
      },
    },
  },
  {
    id: 'valve_6',
    scheme: 'Гидравлическая',
    params: {
      color: {
        group: 'g > path:first-of-type',
      },
    },
  },
  {
    id: 'valve_7',
    scheme: 'Гидравлическая',
    params: {
      color: {
        group: 'g > path:first-of-type',
      },
    },
  },
  {
    id: 'valve_8',
    scheme: 'Гидравлическая',
    params: {
      color: {
        group: 'g > path:first-of-type',
      },
    },
  },
  {
    id: 'valve_9',
    scheme: 'Гидравлическая',
    params: {
      color: {
        group: 'g > path:first-of-type',
      },
    },
  },
  {
    id: 'valve_10',
    scheme: 'Гидравлическая',
    params: {
      color: {
        group: 'g > path:first-of-type',
      },
    },
  },
  {
    id: 'valve_11',
    scheme: 'Гидравлическая',
    params: {
      color: {
        group: 'g > path:first-of-type',
      },
    },
  },
  {
    id: 'valve_12',
    scheme: 'Гидравлическая',
    params: {
      color: {
        group: 'g > path:first-of-type',
      },
    },
  },
  {
    id: 'valve_14',
    scheme: 'Гидравлическая',
    params: {
      color: {
        group: 'g > path:first-of-type',
      },
    },
  },
  {
    id: 'valve_16',
    scheme: 'Гидравлическая',
    params: {
      color: {
        group: 'g > path:first-of-type',
      },
    },
  },
  {
    id: 'valve_17',
    scheme: 'Гидравлическая',
    params: {
      color: {
        group: 'g > path:first-of-type',
      },
    },
  },
  {
    id: 'valve_18',
    scheme: 'Гидравлическая',
    params: {
      color: {
        group: 'g > path:first-of-type',
      },
    },
  },
  {
    id: 'valve_19',
    scheme: 'Гидравлическая',
    params: {
      color: {
        group: 'g > path:first-of-type',
      },
    },
  },
  {
    id: 'valve_20',
    scheme: 'Гидравлическая',
    params: {
      color: {
        group: 'g > path:first-of-type',
      },
    },
  },
  {
    id: 'valve_21',
    scheme: 'Гидравлическая',
    params: {
      color: {
        group: 'g > path:first-of-type',
      },
    },
  },
  {
    id: 'valve_22',
    scheme: 'Гидравлическая',
    params: {
      color: {
        group: 'g > path:first-of-type',
      },
    },
  },
  {
    id: 'valve_XV-114',
    scheme: 'Гидравлическая',
    params: {
      color: {
        group: 'g > path:first-of-type',
      },
    },
  },
  {
    id: 'valve_VP-2',
    scheme: 'Гидравлическая',
    params: {
      color: {
        group: 'g > path:first-of-type',
      },
    },
  },

  // Клапан с регулировкой (изначально закрыт - красный)
  {
    id: 'valve_OORL11S001',
    scheme: 'Гидравлическая',
    params: {
      range: {
        value: [0, 100],
      },
      color: {
        group: 'g > path:first-of-type',
      },
    },
  },

  // Дренажи и воздушники (все открыты - зеленые)
  {
    id: 'drain_1',
    scheme: 'Гидравлическая',
    params: {
      color: {
        group: 'g > path:first-of-type',
      },
    },
  },
  {
    id: 'drain_3',
    scheme: 'Гидравлическая',
    params: {
      color: {
        group: 'g > path:first-of-type',
      },
    },
  },
  {
    id: 'drain_5',
    scheme: 'Гидравлическая',
    params: {
      color: {
        group: 'g > path:first-of-type',
      },
    },
  },
  {
    id: 'drain_11',
    scheme: 'Гидравлическая',
    params: {
      color: {
        group: 'g > path:first-of-type',
      },
    },
  },
  {
    id: 'vent_2',
    scheme: 'Гидравлическая',
    params: {
      color: {
        group: 'g > path:first-of-type',
      },
    },
  },
  {
    id: 'vent_6',
    scheme: 'Гидравлическая',
    params: {
      color: {
        group: 'g > path:first-of-type',
      },
    },
  },
  {
    id: 'vent_12',
    scheme: 'Гидравлическая',
    params: {
      color: {
        group: 'g > path:first-of-type',
      },
    },
  },
  {
    id: 'vent_14',
    scheme: 'Гидравлическая',
    params: {
      color: {
        group: 'g > path:first-of-type',
      },
    },
  },
  {
    id: 'vent_16',
    scheme: 'Гидравлическая',
    params: {
      color: {
        group: 'g > path:first-of-type',
      },
    },
  },
  {
    id: 'vent_17',
    scheme: 'Гидравлическая',
    params: {
      color: {
        group: 'g > path:first-of-type',
      },
    },
  },
  {
    id: 'vent_18',
    scheme: 'Гидравлическая',
    params: {
      color: {
        group: 'g > path:first-of-type',
      },
    },
  },
  {
    id: 'vent_19',
    scheme: 'Гидравлическая',
    params: {
      color: {
        group: 'g > path:first-of-type',
      },
    },
  },
  {
    id: 'vent_20',
    scheme: 'Гидравлическая',
    params: {
      color: {
        group: 'g > path:first-of-type',
      },
    },
  },

  // Насос (выключен - серый)
  {
    id: 'pump',
    scheme: 'Гидравлическая',
    params: {
      color: {
        group: 'circle, path',
      },
    },
  },

  {
    id: 'panel_P-2408',
    scheme: 'Гидравлическая',
    params: {
      text: {
        textId: 'value_15',
      },
    },
  },
  {
    id: 'panel_P-2411',
    scheme: 'Гидравлическая',
    params: {
      text: {
        textId: 'value_14',
      },
    },
  },
  {
    id: 'panel_P-2306',
    scheme: 'Гидравлическая',
    params: {
      text: {
        textId: 'value_17',
      },
    },
  },
  {
    id: 'panel_P-2415',
    scheme: 'Гидравлическая',
    params: {
      text: {
        textId: 'value_13',
      },
    },
  },
  {
    id: 'panel_P-9457',
    scheme: 'Гидравлическая',
    params: {
      text: {
        textId: 'value_8',
      },
    },
  },
  {
    id: 'panel_P-9403',
    scheme: 'Гидравлическая',
    params: {
      text: {
        textId: 'value_6',
      },
    },
  },
  {
    id: 'panel_P-9452',
    scheme: 'Гидравлическая',
    params: {
      text: {
        textId: 'value_7',
      },
    },
  },
  {
    id: 'panel_P-2421',
    scheme: 'Гидравлическая',
    params: {
      text: {
        textId: 'value_11',
      },
    },
  },
  {
    id: 'panel_P-2226',
    scheme: 'Гидравлическая',
    params: {
      text: {
        textId: 'value_10',
      },
    },
  },
  {
    id: 'panel_P-9432',
    scheme: 'Гидравлическая',
    params: {
      text: {
        textId: 'value',
      },
    },
  },
  {
    id: 'panel_P-2207',
    scheme: 'Гидравлическая',
    params: {
      text: {
        textId: 'value_16',
      },
    },
  },
  {
    id: 'panel_P-2424',
    scheme: 'Гидравлическая',
    params: {
      text: {
        textId: 'value_12',
      },
    },
  },

  {
    id: 'panel_L-9401',
    scheme: 'Гидравлическая',
    params: {
      text: {
        textId: 'value_22',
      },
      color: {
        group: 'rect:nth-of-type(2)',
      },
    },
  },
  {
    id: 'panel_L-9409',
    scheme: 'Гидравлическая',
    params: {
      text: {
        textId: 'value_20',
      },
      color: {
        group: 'rect:nth-of-type(2)',
      },
    },
  },
  {
    id: 'panel_L-9410',
    scheme: 'Гидравлическая',
    params: {
      text: {
        textId: 'value_23',
      },
      color: {
        group: 'rect:nth-of-type(2)',
      },
    },
  },
  {
    id: 'panel_L-9411',
    scheme: 'Гидравлическая',
    params: {
      text: {
        textId: 'value_24',
      },
      color: {
        group: 'rect:nth-of-type(2)',
      },
    },
  },

  // Датчики температуры
  {
    id: 'panel_TT-14',
    scheme: 'Гидравлическая',
    params: {
      text: {
        textId: 'value_19',
      },
    },
  },

  // Индикатор клапана
  {
    id: 'panel_00RL11H001',
    scheme: 'Гидравлическая',
    params: {
      text: {
        textId: 'value_18',
      },
    },
  },

  // Таймер
  {
    id: 'timer',
    scheme: 'Гидравлическая',
    params: {
      text: {
        textId: 'value',
      },
    },
  },

  // Кнопки управления
  {
    id: 'button_1',
    scheme: 'Гидравлическая',
    params: {
      status: {
        text: '',
      },
    },
  },
  {
    id: 'button_2',
    scheme: 'Гидравлическая',
    params: {
      status: {
        text: '',
      },
    },
  },
  {
    id: 'button_3',
    scheme: 'Гидравлическая',
    params: {
      status: {
        text: '',
      },
    },
  },
  {
    id: 'button_5',
    scheme: 'Гидравлическая',
    params: {
      status: {
        text: '',
      },
    },
  },
  {
    id: 'button_6',
    scheme: 'Гидравлическая',
    params: {
      status: {
        text: '',
      },
    },
  },
  {
    id: 'button_7',
    scheme: 'Гидравлическая',
    params: {
      status: {
        text: '',
      },
    },
  },
  {
    id: 'button_8',
    scheme: 'Гидравлическая',
    params: {
      status: {
        text: '',
      },
    },
  },
  {
    id: 'button_9',
    scheme: 'Гидравлическая',
    params: {
      status: {
        text: '',
      },
    },
  },
  {
    id: 'button_10',
    scheme: 'Гидравлическая',
    params: {
      status: {
        text: '',
      },
    },
  },
  {
    id: 'button_11',
    scheme: 'Гидравлическая',
    params: {
      status: {
        text: '',
      },
    },
  },
  {
    id: 'button_12',
    scheme: 'Гидравлическая',
    params: {
      status: {
        text: '',
      },
    },
  },
  {
    id: 'button_14',
    scheme: 'Гидравлическая',
    params: {
      status: {
        text: '',
      },
    },
  },
  {
    id: 'button_16',
    scheme: 'Гидравлическая',
    params: {
      status: {
        text: '',
      },
    },
  },
  {
    id: 'button_17',
    scheme: 'Гидравлическая',
    params: {
      status: {
        text: '',
      },
    },
  },
  {
    id: 'button_18',
    scheme: 'Гидравлическая',
    params: {
      status: {
        text: '',
      },
    },
  },
  {
    id: 'button_19',
    scheme: 'Гидравлическая',
    params: {
      status: {
        text: '',
      },
    },
  },
  {
    id: 'button_20',
    scheme: 'Гидравлическая',
    params: {
      status: {
        text: '',
      },
    },
  },
  {
    id: 'button_21',
    scheme: 'Гидравлическая',
    params: {
      status: {
        text: '',
      },
    },
  },
  {
    id: 'button_22',
    scheme: 'Гидравлическая',
    params: {
      status: {
        text: '',
      },
    },
  },
  {
    id: 'button_96',
    scheme: 'Гидравлическая',
    params: {
      status: {
        text: '',
      },
    },
  },
  {
    id: 'button_97',
    scheme: 'Гидравлическая',
    params: {
      status: {
        text: '',
      },
    },
  },
  {
    id: 'button_98',
    scheme: 'Гидравлическая',
    params: {
      status: {
        text: '',
      },
    },
  },
  {
    id: 'button_99',
    scheme: 'Гидравлическая',
    params: {
      status: {
        text: '',
      },
    },
  },
  // ===== ГИДРОПАНЕЛЬ =====
  {
    id: 'panel_3',
    scheme: 'Гидропанель',
    params: {
      text: {
        textId: 'value',
      },
    },
  },
  {
    id: 'panel_2',
    scheme: 'Гидропанель',
    params: {
      text: {
        textId: 'value',
      },
    },
  },
  {
    id: 'panel',
    scheme: 'Гидропанель',
    params: {
      text: {
        textId: 'value',
      },
    },
  },

  // Кнопки изменения значения
  {
    id: '-5',
    scheme: 'Гидропанель',
    params: {
      status: {
        text: '',
      },
    },
  },
  {
    id: '-1',
    scheme: 'Гидропанель',
    params: {
      status: {
        text: '',
      },
    },
  },
  {
    id: '1',
    scheme: 'Гидропанель',
    params: {
      status: {
        text: '',
      },
    },
  },
  {
    id: '5',
    scheme: 'Гидропанель',
    params: {
      status: {
        text: '',
      },
    },
  },

  // Кнопки подтверждения
  {
    id: 'button_da',
    scheme: 'Гидропанель',
    params: {
      status: {
        text: '',
      },
    },
  },
  {
    id: 'button_otmena',
    scheme: 'Гидропанель',
    params: {
      status: {
        text: '',
      },
    },
  },
] as const satisfies SchemeIndicator[]
