# xstate-test

## XState машина: основные составляющие

## 1. context — данные/состояние системы

context: {
  tanks: { ... },
  pumps: { ... },
  valves: { ... },
  indicators: { ... },
  notification: ...
}

## 2. states — состояния машины

states: {
  idle: { ... },
  stage1: { ... },
  stage2: { ... },
  stage3: { ... },
  stage4: { ... },
  stage5: { ... },
  stage6: { ... },
  completed: { ... }
}

## 3. events — события

type AcidDrainEvent =
  | { type: "START" }
  | { type: "OPEN_12" }
  | { type: "CLOSE_13" }
  | { type: "PUMP_STARTED" }
  | { type: "VALVE_OPENED" }
  | { type: "NEXT" };

## 4. actions — действия

openValve12: assign({
  valves: ({ context }) => ({ ...context.valves, "12": "open" })
})

closeValve13: assign({
  valves: ({ context }) => ({ ...context.valves, "13": "closed" })
})

startPump86C: assign({
  pumps: ({ context }) => ({
    ...context.pumps,
    "86C": { status: "running", color: "green", current: 60 }
  })
})

notifyPump86CStarted: () => console.log("Уведомление...")

## 5. guards — условия переходов

isStage1Complete: ({ context }) =>
  context.valves["12"] === "open" &&
  context.valves["13"] === "closed" &&
  context.valves["14"] === "closed"

isStage2Complete: ({ context }) =>
  context.valves["1"] === "open" &&
  context.valves["5"] === "open" &&
  context.valves["3/2"] === "closed"

## 6. transitions — переходы

OPEN_12: { actions: "openValve12" }
NEXT: { target: "stage2", guard: "isStage1Complete" }
VALVE_CLOSED: "#acidDrain.stage4"

## 7. entry / exit

stage3.entry = "Этап 3 начат"
stage3.exit = "Этап 3 завершен"

pumpStart.entry = ["startPump86C", "notifyPump86CStarted"]

## 8. after — задержки

openValve4_1.after = {
  20000: { target: "closeValve4_1", actions: "completeFilling" }
}

## 9. initial — начальное состояние

stage3.initial = "pumpStart"

# Описание проекта

Проект реализует конечный автомат XState, моделирующий процесс слива серной кислоты из железнодорожных цистерн в хранилище 6.1В с использованием насоса 86С.

# Диаграммы состояний (Mermaid)

## Общая структура автомата

graph TD
    idle([idle]) -->|START| stage1
    stage1 -->|NEXT| stage2
    stage2 -->|NEXT| stage3
    stage3 --> stage4
    stage4 -->|NEXT| stage5
    stage5 -->|COLLECT_SCHEME_TRANSFER| stage6
    stage6 -->|COMPLETE| completed([completed])

## Этап 3 — Заполнение бака 6.5

graph TD
    subgraph stage3 [Этап 3: Заполнение бака 6.5]
        pumpStart([pumpStart]) -->|PUMP_STARTED| openValve4
        openValve4 -->|VALVE_OPENED| openValve4_1
        openValve4_1 -->|after 20s| closeValve4_1
        closeValve4_1 -->|VALVE_CLOSED| stage4
    end

## Этап 6 — Перекачка насосом 93

graph TD
    subgraph stage6 [Этап 6: Перекачка насосом 93]
        openGroup1([openGroup1]) -->|VALVES_OPENED| closeValve7
        closeValve7 -->|VALVE_CLOSED| openValve10
        openValve10 -->|VALVE_OPENED| startPump93
        startPump93 -->|PUMP_STARTED| openValve11
        openValve11 -->|after 20s| setLine6_10Red
        openValve11 -->|CLOSE_11| closingSequence
        closingSequence -->|COMPLETE| completed
    end

# Структура данных

## Емкости (tanks)

| Емкость | Уровень | Максимум | Цвет | Назначение |
|--------|---------|----------|------|------------|
| 6.1A | 7.0 | 8.05 | blue | Хранилище |
| 6.1B | 2.98 | 8.05 | blue | Принимающая емкость |
| 6.1C | 7.0 | 8.05 | blue | Хранилище |
| 6.5 | 0.0 | 8.05 | blue | Напорный бак |

## Насосы (pumps)

| Насос | Статус | Цвет | Ток | Назначение |
|-------|--------|------|-----|------------|
| 86C | stopped | gray | 0 | Основной |
| 93 | stopped | gray | 0 | Перекачка |
| 86A | stopped | gray | 0 | Резерв |
| 86B | stopped | gray | 0 | Резерв |

## Клапаны (valves)

| Клапан | Статус |
|--------|--------|
| 1 | closed |
| 2 | closed |
| 2/1 | closed |
| 3 | closed |
| 3/1 | closed |
| 3/2 | open |
| 4 | closed |
| 4/1 | closed |
| 5 | closed |
| 6 | closed |
| 7 | closed |
| 8 | closed |
| 9 | closed |
| 10 | closed |
| 11 | closed |
| 12 | closed |
| 13 | open |
| 14 | open |

## Индикаторы

| Индикатор | Значение | Описание |
|-----------|----------|----------|
| line6_10 | { active: false, color: "gray" } | Линия 6.10 |
| ampermeter_86C | { value: 0 } | Амперметр 86C |
| ampermeter_93 | { value: 0 } | Амперметр 93 |
| temperature | { value: 20 } | Температура |

## Цветовая индикация

| Объект | Начальный цвет | Конечный цвет | Условие |
|--------|----------------|---------------|---------|
| Насосы | серый | зеленый | Запуск |
| Емкость 6.5 | голубой | зеленый | Заполнена |
| Емкость 6.1B | голубой | зеленый | После заполнения |
| Линия 6.10 | серый | зеленый → красный | Заполнение → прокачка |

## Амперметры

| Насос | Нормальный ток | Максимальный ток |
|-------|----------------|------------------|
| 86C | 60А | 134А |
| 93 | 30А | 56.2А |

## Особые клапаны

| Клапан | Особенность |
|--------|-------------|
| 13 | Изначально открыт |
| 14 | Изначально открыт |
| 3/2 | Изначально открыт |
| 4/1 | Открывается медленно |

# События

| Событие | Описание |
|---------|----------|
| START | Начать процесс |
| COLLECT_SCHEME_6_1V | Схема 6.1В |
| OPEN_12 | Открыть 12 |
| CLOSE_13 | Закрыть 13 |
| CLOSE_14 | Закрыть 14 |
| COLLECT_SCHEME_6_5 | Схема 6.5 |
| OPEN_1 | Открыть 1 |
| OPEN_5 | Открыть 5 |
| CLOSE_3_2 | Закрыть 3/2 |
| OPEN_3 | Открыть 3 |
| OPEN_3_1 | Открыть 3/1 |
| OPEN_2_1 | Открыть 2/1 |
| OPEN_2 | Открыть 2 |
| PUMP_STARTED | Насос запущен |
| VALVE_OPENED | Клапан открыт |
| FILL_COMPLETE | Заполнение завершено |
| VALVE_CLOSED | Клапан закрыт |
| CLOSE_4 | Закрыть 4 |
| STOP_86C | Остановить 86C |
| CLOSE_2 | Закрыть 2 |
| CLOSE_2_1 | Закрыть 2/1 |
| CLOSE_3_1 | Закрыть 3/1 |
| CLOSE_3 | Закрыть 3 |
| CLOSE_5 | Закрыть 5 |
| CLOSE_1 | Закрыть 1 |
| NEXT | Следующий этап |
| COLLECT_SCHEME_TRANSFER | Схема перекачки |
| VALVES_OPENED | Клапаны открыты |
| CLOSE_11 | Закрыть 11 |
| STOP_93 | Остановить 93 |
| CLOSE_10 | Закрыть 10 |
| CLOSE_8 | Закрыть 8 |
| CLOSE_9 | Закрыть 9 |
| CLOSE_12 | Закрыть 12 |
| CLOSE_6 | Закрыть 6 |
| COMPLETE | Завершить процесс |

# Детальное описание этапов

## Этап 1 — Подготовка хранилища 6.1В

| Действие | Описание |
|----------|----------|
| COLLECT_SCHEME_6_1V | Закрыть 13, 14 |
| OPEN_12 | Открыть 12 |
| CLOSE_13 | Закрыть 13 |
| CLOSE_14 | Закрыть 14 |

Условие перехода: 12=open, 13=closed, 14=closed

## Этап 2 — Подготовка напорного бака 6.5

| Действие | Описание |
|----------|----------|
| COLLECT_SCHEME_6_5 | Закрыть 1,5,3,3/1,2/1,2 |
| OPEN_1 | Открыть 1 |
| OPEN_5 | Открыть 5 |
| CLOSE_3_2 | Закрыть 3/2 |
| OPEN_3 | Открыть 3 |
| OPEN_3_1 | Открыть 3/1 |
| OPEN_2_1 | Открыть 2/1 |
| OPEN_2 | Открыть 2 |

## Этап 3 — Заполнение бака 6.5

| Состояние | Действия |
|-----------|----------|
| pumpStart | startPump86C, notifyPump86CStarted |
| openValve4 | openValve4 |
| openValve4_1 | startFilling, notifyFillingStarted |
| closeValve4_1 | closeValve4_1 |

## Этап 4 — Останов насоса 86C

| Действие | Описание |
|----------|----------|
| CLOSE_4 | Закрыть 4 |
| STOP_86C | Остановить насос |
| CLOSE_2 | Закрыть 2 |
| CLOSE_2_1 | Закрыть 2/1 |
| CLOSE_3_1 | Закрыть 3/1 |
| CLOSE_3 | Закрыть 3 |
| CLOSE_5 | Закрыть 5 |
| CLOSE_1 | Закрыть 1 |

## Этап 5 — Подготовка к перекачке

| Действие | Описание |
|----------|----------|
| COLLECT_SCHEME_TRANSFER | Переход к этапу 6 |

## Этап 6 — Перекачка насосом 93

| Состояние | Действия |
|-----------|----------|
| openGroup1 | openValvesGroup1, notifyLineFilled |
| closeValve7 | closeValve7 |
| openValve10 | openValve10, notifyImpellerFilling |
| startPump93 | startPump93, notifyPump93Started |
| openValve11 | startFillingCistern, notifyCisternFilling |
| closingSequence | closeValve11, stopPump93, closeValve10, closeValve8, closeValve9, closeValve12, closeValve6 |

# Структура проекта

xstate-test/
├── src/
│   ├── scenario.ts
│   └── types.ts
├── README.md
├── package.json
└── tsconfig.json

# Требования

Node.js 14+
TypeScript 4+
XState 5+
