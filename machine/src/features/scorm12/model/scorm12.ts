import { StorageKey } from '@/shared/lib'
import { isLMS } from '@/shared/lib/configs'
import { HistoryEvent } from '@/entities/history'
import { Snapshot } from 'xstate'
import { ProgressStepId } from '@/entities/progress'
import { TASKS_CONFIG } from '@configs/tasks'
export const MAX_RAW = String(100);//String(TASKS_CONFIG.length * 1000 + 100)
// export const MAX_RAW_ONE = String(0.100)
//на cmi.suspend_data ограничение 4096 символов
export const SUSPEND_BORDER = 4000;//350

//описание ключей которые сохраняю
/*
название переменной|тип|назначени| сохр в lms?|ключ в localstorage
showed      |   bool                |   показ модалки   |   +(тк если остановились на пункте с откр модалкой)
backup      |   Snapshot<unknown>   |   текущ шаг, стили, инпуты   |   +       | (exercise:snapshot)
events      |   HistoryEvent[]      |   сохр данных истории(текст, -1/0, действие)   |   +   | history:events
passed      |   Record<ProgressStepId, true>    |   сколько шагов пройдено успешно   |   +  |   progress.passed прогресс
main        |   SchemeMainIdExact   |      |   + |
id          |   ExerciseTaskIdExact |   id алгоритма из TASKS_CONFIG из всех алгоритмов   |   + |  task:id	"stop"
modals      |   SchemeModalIdExact[]|   title для модалки   |   +    |   modal:modals
generator   |   number              |   количество записей в истории   |   +
finished    |   bool                |   закончили алгоритм?   |   +
answers     |   QuizAnswer[]        |   ответы на тест   |   +  |   quiz-answers:answers
answer      |   QuizAnswerId        |   id текущ ответа на тест   |   +
index       |   number              |   мб номер вопроса в тесте  |   + |'quiz:index'

buffer      |   SchemeTriggerEventExact         |   возможно для админки снепшоты?   |   -    |   trigger-modal:buffer
collapsed   |   bool                |   показ правого сайдбара   |   -
toasts      |  <UIToastData[]       |   Уведомление (id, message) Пишем в историю? Нет   |   -    |   'toaster:toasts'
scale       |   UIZoomScale         |   зум канваса |   -
transform   |   UIZoomTransform     |   перемещение канваса  |   -
offset      |   UIModalOffset       |   сдвиг модалки  |   -    |   scheme-modal:offset


 */
export const useScorm12Store = defineStore('scorm12', () => {
  const parseData = (key: string): Record<string, any> => {
    const raw = window.API?.LMSGetValue(key)
    if (!raw) return {}
    try { return JSON.parse(raw) } catch { return {} }
  }
  const parseArray = (key: string) => {
    const raw = window.API?.LMSGetValue(key)
    if (!raw) return []
    try { return JSON.parse(raw) } catch { return [] }
  }
  const parseString = (key: string): string => {
    const raw = window.API?.LMSGetValue(key) ?? ''
    if (!raw) return ''
    try { return JSON.parse(raw) } catch { return '' }
  }
  const getStatus = () => parseString('cmi.core.lesson_status')
  const getSuspend = () => parseData('cmi.suspend_data')
  const getRaw = () => parseString('cmi.core.score.raw')
  //////////
  const getObjectivesId = (id: string) => {
    const path = "cmi.objectives." + String(id) + ".id"
    return parseString(path)
  }
  const getObjectivesCount = () => {
    const cc =  parseString('cmi.objectives._count')
    return cc?.length ? cc : '0'
  }
  const getObjectivesRaw = (id: string) => {
    const path = "cmi.objectives." + String(id) + ".score.raw"
    return parseString(path)
  }


  const history = ref<HistoryEvent[]>([])
  const snapshot = ref<any>('')
  const raw = ref<string>()
  const progress = ref<Record<ProgressStepId, true>>({})
  //название алгоритма из конфига id(сохр для восстановления после перезагрузки)
  const algorithmName = ref<string>('')
  //индекс алгоритма внутри лмс
  const algorithmIndex = ref<string>('0')
  const showed = ref<boolean>(false)
  const main = ref<string>()
  const modals = ref<any>([])
  const generator = ref<string>('0')
  //“passed”, “completed”, “failed”, “incomplete”, “browsed”, “not attempted”
  const finished = ref<boolean>(false)

  const answers = ref<any>([])
  const answer = ref<string>()
  const indexQuiz = ref<string>('0')

  let map:Map<string, Ref<any>|string> = new Map([
    ['raw', raw],
    ['history:events', history],//история
    ['exercise:snapshot', snapshot],//стили
    ['progress:passed', progress],//прогресс
    ['task:id', algorithmName],//выбранный алгоритм(индекс алгоритма в массиве TASKS_CONFIG)
    ['open-task-modal:showed', showed],
    ['scheme:main', main],
    ['modal:modals', modals],
    ['history:generator', generator],
    ['exercise:finished', finished],
    ['quiz-answers:answers', answers],
    ['quiz-answers:answer', answer],
    ['quiz:index', indexQuiz],
  ]);


  //getters
  const getByKey = <T>(key: StorageKey, initial?: T): Ref<T|undefined> => {
    if (!isLMS) return ref(undefined);
    let obj = map.get(key) as Ref<T> | undefined;
    const isInitial = initial !== undefined && initial !== null;

    if (!obj) {
      obj = ref(initial as T) as Ref<T>
      map.set(key, obj as Ref<T>)
      return obj
    }
    if (obj && !obj.value && isInitial) {
      obj.value = initial
      return obj
    }

    // console.log("GET", key, obj, obj?.value, "HH", history, getSuspend())
    return obj
  }


  //setters
  const setData = () => {
    if (!isLMS) return
    const suspend = getSuspend()
    const rawInit = getRaw()
    //максимальный индекс для установки цели
    const indexMax = getObjectivesCount()
    const status = getStatus()
    // const nameFirst = TASKS_CONFIG[0].id

    history.value = (suspend && suspend?.history) ? suspend?.history : []
    progress.value = (suspend && suspend?.progress) ? suspend.progress : {}
    snapshot.value = (suspend && suspend?.snapshot) ? suspend.snapshot : ''
    raw.value = rawInit ? rawInit : MAX_RAW;
    showed.value = (suspend && suspend?.showed) ? Boolean(suspend.showed) : false
    main.value = (suspend && suspend?.main) ? suspend.main : ''
    modals.value = (suspend && suspend?.modals) ? suspend.modals : []
    generator.value = (suspend && suspend?.generator) ? suspend.generator : '0'
    answer.value = (suspend && suspend?.answer) ? suspend.answer : '0'
    indexQuiz.value = (suspend && suspend?.indexQuiz) ? suspend.indexQuiz : '0'
    answers.value = (suspend && suspend?.answers) ? suspend.answers : []
    //активный индекс алгоритма
    algorithmIndex.value = (suspend && suspend?.index) ? suspend.index : indexMax
    algorithmName.value = (suspend && suspend?.algName) ? suspend.algName : ''
    if (status === 'completed' || status === 'passed') {
      finished.value = true
    } else {
      window.API.LMSSetValue('cmi.core.lesson_status', 'incomplete')//незавершен
    }
    // else if (history.value?.length) {
    //   window.API.LMSSetValue('cmi.core.lesson_status', 'incomplete')//незавершен
    // } else {
    //   window.API.LMSSetValue('cmi.core.lesson_status', 'browsed')//просмотрен
    // }
    window.API.LMSCommit('')
  }
  //установка начальных данных
  const setInit = () => {
    if (!isLMS) return;
    window.API.LMSInitialize('')
    window.API.LMSSetValue('cmi.core.score.max', MAX_RAW)
    window.API.LMSSetValue('cmi.core.score.min', '0')
    window.API.LMSCommit('')

  }
  const setStatus = (status = 'completed') => {
    window.API.LMSSetValue('cmi.core.lesson_status', status)
    window.API.LMSCommit('')
  }
  //actions
  const finish = () => {
    window.API.LMSSetValue("cmi.core.exit", "");
    window.API.LMSCommit("");
    window.API.LMSFinish(String(finished.value))
  }
  const resetDataToInit = () => {
    //сбросить общие данные (не трогая данные целей)
    history.value = []
    snapshot.value = ''
    raw.value = MAX_RAW
    progress.value = {}
    modals.value = []
    generator.value = '0'
  }
  const resetAllData = () => {
    resetDataToInit()
    algorithmName.value = ''
    algorithmIndex.value = '0'
    showed.value = false
    finished.value = false
    answers.value = []
    answer.value = ''
    indexQuiz.value = '0'
  }
  const deleteOldHistory = (history: any, sizeAll: number) => {
    while (sizeAll >= SUSPEND_BORDER) {
      const item = history.pop()
      sizeAll -= (JSON.stringify(item)?.length ?? 0)
    }
    return history
  }
  const changeSuspend = (key: string, newData: object|string) => {
    //{history: [data:{}, source: -1, ...]}
    const oldData = getSuspend()
    oldData[key] = newData
    let data = JSON.stringify(oldData)
    if (data.length >= SUSPEND_BORDER) {
      // todo +сжатие
      oldData['history'] = deleteOldHistory(oldData['history'], data.length)
      data = JSON.stringify(oldData)
    }
    window.API.LMSSetValue('cmi.suspend_data', data)
    window.API.LMSCommit('')
  }

  const changeRaw = () => {
    // Баллы по прохождению отправляем в scorm в виде id задания +.+ балл toFixed(3)
    // const index = +getIndexAlgorithm(algorithmName.value)
    // const result = String(index + +(raw.value ?? 0))
    // console.log("raw", raw.value)
    const path = "cmi.objectives." + String(algorithmIndex.value) + ".score.raw"
    window.API.LMSSetValue('cmi.core.score.raw',  String(raw.value ?? 0))
    window.API.LMSSetValue(path, String(raw))
    window.API.LMSCommit('')
  }

  const changeObjectivesId = () => {
    const value = getObjectivesDataAlgorithm(algorithmName.value)
    if (!algorithmIndex || !value || !value.length) return;
    const path = "cmi.objectives." + String(algorithmIndex.value) + ".id"

    const ok = window.API.LMSSetValue(path, value)
    if (ok !== 'true') {
      const code = window.API.LMSGetLastError();
      console.log('Set id failed:', code, window.API.LMSGetErrorString(code), window.API.LMSGetDiagnostic(''));
      return;
    }
    window.API.LMSSetValue(path, value)
    window.API.LMSCommit('')
  }
  const changeStatus = () => {
    const status = getStatus()
    if (!status || (status === 'browsed' && history.value.length)) {
      window.API.LMSSetValue('cmi.core.lesson_status', 'incomplete')
      window.API.LMSCommit('')
    }
  }

  const getObjectivesDataAlgorithm = (name: string): string => {
    const i = TASKS_CONFIG.findIndex(x => x.id === name)
    return i === -1 ? String(name+'1') : String(name+String(i+1))
  }

  const getIndexAlgorithm = (name: string): string => {
    const i = TASKS_CONFIG.findIndex(x => x.id === name)
    return i === -1 ? '0' : String(i)
  }

  //watch
  watch(raw, () => {
    changeRaw()
  }, {
    immediate: true,
  })
  watch(history, () => {
    changeSuspend('history', history.value)
    // changeStatus()
  }, {
    immediate: true,
    deep: true
  })
  watch(snapshot, () => {
    if (!snapshot.value) return
    changeSuspend('snapshot', snapshot.value)
  }, {
    immediate: true,
    deep: true
  })
  watch(progress, () => {
    changeSuspend('progress', progress.value)
  }, {
    immediate: true,
    deep: true
  })
  watch(algorithmName, () => {
    if (!algorithmName || !algorithmName?.value?.length) return
    changeSuspend('algName', String(algorithmName.value))
    const dataAlgName = getObjectivesId(algorithmIndex.value);
    if(dataAlgName) {
      resetDataToInit()
    }
    changeObjectivesId()
  }, {
    immediate: true,
  })
  watch(showed, () => {
    changeSuspend('showed', String(showed.value))
  }, {
    immediate: true,
  })
  watch(main, () => {
    changeSuspend('main', String(main.value))
  }, {
    immediate: true,
  })
  watch(modals, () => {
    changeSuspend('modals', modals.value)
  }, {
    immediate: true,
  })
  watch(generator, () => {
    changeSuspend('generator', String(generator.value))
  }, {
    immediate: true,
  })
  watch(answers, () => {
    changeSuspend('answers', answers.value)
  }, {
    immediate: true,
  })
  watch(answer, () => {
    changeSuspend('answer', String(answer.value))
  }, {
    immediate: true,
  })
  watch(indexQuiz, () => {
    changeSuspend('indexQuiz', String(indexQuiz.value))
  }, {
    immediate: true,
  })

  watch(finished, () => {
    if (finished.value === false) return
    finish()
    // setInit()
    // resetAllData()
  }, {
    immediate: true,
  })
  return {
    history,
    getStatus,
    getByKey,
    setInit,
    setData,
    setStatus,
    resetAllData
  }
})
