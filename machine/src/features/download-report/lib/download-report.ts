// export const useDownloadReport = createGlobalState(() => {
//   const signal = ref<boolean>(false)
//
//   function emit(): void {
//     signal.value = true
//     signal.value = false
//   }
//
//   function listen(cb: () => void): void {
//     watch(signal, () => cb(), { flush: 'sync' })
//   }
//
//   console.log('download report')
//
//   return {
//     emit,
//     listen,
//   }
// })
import { jsPDF } from 'jspdf'

import { useHistoryStore } from '@/entities/history'
import { useProgressStore } from '@/entities/progress'
import { useTaskStore } from '@/entities/task'
import { isLMS } from '@/shared/lib'

import { montserratBold } from '../../../../public/fonts/MontserratBold'
import { montserratNormal } from '../../../../public/fonts/MontserratNormal'

// TODO чем разбираться во всей схеме взаимодействий приложения, сделаю функцию тут,
// а ты уже сама оформишь во все необходимые подписки
let doc: jsPDF
const boldFontFamilyName = 'montserratBold'
const regularFontFamilyName = 'montserratRegular'

const paddingTop = 12
const paddingLeft = 10
const paddingBottom = 15

const fontSizeMini = 10
const fontSizeStandart = 12
const fontSizeTitle = 16
const subTextMargin = 8

const blackColor = '#1C1C21'
const redColor = '#b42e2e'

let positionY = 10
let currentPage = 1

let docWidth = 0
let docHeight = 0

export function downloadReport() {
  const task = useTaskStore()

  return new Promise((resolve, reject) => {
    createPDF().then((doc) => {
      const filename = `Результаты прохождения ${task.task.mission}`
      if (!doc)
        return

      // Открытие pdf в новой вкладке
      const pdfOutput = doc.output('blob')
      const pdfUrl = URL.createObjectURL(pdfOutput)
      window.open(pdfUrl, '_blank')

      doc.save(`${filename}.pdf`)
      resolve()
    }).catch((err) => {
      reject(err)
    })
  })
}

async function createPDF() {
  doc = new jsPDF({
    unit: 'mm',
    format: 'a4',
    putOnlyUsedFonts: true,
  })

  // Подготовка
  const historyStore = useHistoryStore()
  const task = useTaskStore()

  doc.addFileToVFS(regularFontFamilyName, montserratNormal)
  doc.addFileToVFS(boldFontFamilyName, montserratBold)
  doc.addFont(regularFontFamilyName, regularFontFamilyName, 'normal')
  doc.addFont(boldFontFamilyName, boldFontFamilyName, 'normal')
  doc.setFont(regularFontFamilyName)
  docWidth = doc.internal.pageSize.getWidth()
  docHeight = doc.internal.pageSize.getHeight()
  doc.setFontSize(fontSizeStandart)
  doc.setTextColor(blackColor)
  positionY = paddingTop
  // Заголовок
  addText('Результаты прохождения тренажёра', { position: 'center', weight: 'bold', size: fontSizeTitle })
  positionY += subTextMargin
  // Шапка
  const fullname = isLMS ?  window.API.LMSGetValue('cmi.core.student_name') : ''
  const score = historyStore.points
  const progress = useProgressStore()
  const formattedDate = formatDate(new Date())
  const allStepsCount = _.filter(progress.steps, step => 'quiz' in step || !step.optional || progress.passed[step.id]).length
  const completedStepsCount = _.size(progress.passed)
  createLine(paddingLeft, docWidth - paddingLeft, positionY, positionY)
  positionY += subTextMargin
  addText('ФИО проходящего:', { weight: 'bold' })
  addText(fullname, { x: 58 })
  positionY += subTextMargin
  addText('Дата прохождения:', { weight: 'bold' })
  addText(formattedDate, { x: 58 })
  positionY += subTextMargin
  addText('Пройдено шагов:', { weight: 'bold' })
  let stepsString = `${completedStepsCount} из ${allStepsCount}`
  if (completedStepsCount == allStepsCount)
    stepsString += ', завершено'
  addText(stepsString, { x: 58 })
  positionY += subTextMargin
  addText('Набрано баллов:', { weight: 'bold' })
  addText(score, { x: 58 })
  positionY += subTextMargin - 2
  createLine(paddingLeft, docWidth - paddingLeft, positionY, positionY)
  positionY += subTextMargin
  // История действий с пагинацией
  addText('Задание:', { weight: 'bold' })
  positionY += subTextMargin - 2
  // TODO применить функцию для разделения на строки
  addText(task.task.mission)
  positionY += subTextMargin

  addText('История действий:', { weight: 'bold' })
  positionY += subTextMargin
  const events = [...historyStore.events].sort((event1, event2) => event1.id - event2.id).filter(event => !['quiz', 'answer'].includes(event.type))
  const postIndexPositionX = paddingLeft + 7
  // console.log('pdf events', events)
  events.forEach((event, index) => {
    addText(`${index + 1}.`)
    let color = blackColor
    if (event.score && event.score < 0)
      color = redColor
    let eventString
    switch (event.type) {
      case 'trigger':
        const actionString = event.data.action ?? 'Выбрано неверно'
        eventString = `${actionString} ${event.data.element}`
        break
      case 'stage':
        eventString = `Завершён этап "${event.data.name}"`
        break
      case 'optional':
        eventString = event.data.step
        break
      default:
        console.warn('Обнаружено событие, тип которого неизвестен для PDF', event)
        eventString = 'Событие не определено'
        break
    }
    addText(eventString, { x: postIndexPositionX, color })
    positionY += subTextMargin
    if (positionY > docHeight - paddingBottom)
      nextPage()
    // addText(date, {x: postIndexPositionX});
  })
  if (currentPage > 1)
    addNumerification()
  return doc
}

function createLine(x0: number, x1: number, y0: number, y1: number) {
  doc.setDrawColor(blackColor)
  doc.line(x0, y0, x1, y1)
}

function nextPage() {
  doc.addPage(null, 'portrait')
  positionY = paddingTop
  currentPage += 1
}

function addText(text: string | number, args: {
  position?: 'default' | 'center'
  weight?: 'bold' | 'regular'
  size?: number
  color?: string
  x?: number
} = {}) {
  text = `${text}`
  if (args.weight === 'bold')
    doc.setFont(boldFontFamilyName)
  if (args.size)
    doc.setFontSize(args.size)
  if (args.color)
    doc.setTextColor(args.color)
  const lineWidth = docWidth - paddingLeft * 2 - (args.x ?? 0)
  const textArray = splitTextToFitWidth(text, lineWidth, 10)
  const curPositionX = args.position === 'center' ? countTextCenterXPos(text) : args.x ?? paddingLeft
  textArray.forEach((textString, index) => {
    doc.text(textString, curPositionX, positionY)
    if ((index + 1) != textArray.length)
      positionY += subTextMargin - 3
  })
  doc.setFont(regularFontFamilyName)
  doc.setFontSize(fontSizeStandart)
  doc.setTextColor(blackColor)
}

function splitTextToFitWidth(title: string, columnWidth: number, linesCount: number) {
  const parts = title.split(' ')
  let currentLine = ''
  let resultParts = []

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    const newLine = currentLine + (currentLine ? ' ' : '') + part

    if (doc.getTextWidth(newLine) > columnWidth) {
      if (currentLine) {
        resultParts.push(currentLine)
        currentLine = part
      }
      else {
        // Если одно слово превышает ширину столбца
        resultParts.push(part)
        currentLine = ''
      }
    }
    else {
      currentLine = newLine
    }

    // Условие для остановки после двух строк
    if (resultParts.length === linesCount - 1 && doc.getTextWidth(currentLine) > columnWidth) {
      break
    }
  }

  // Добавление последней строки, если она существует
  if (currentLine) {
    resultParts.push(currentLine)
  }

  // Если результат содержит более двух строк, объединяем вторую и последующие
  if (resultParts.length > linesCount) {
    resultParts[linesCount - 1] = resultParts.slice(linesCount - 1).join(' ')
    resultParts = resultParts.slice(0, linesCount)
  }

  return resultParts
}

function countTextCenterXPos(text: string) {
  // if (leftPoint && rightPoint) {
  //     return rightPoint - (rightPoint - leftPoint) / 2 - doc.getTextWidth(text ?? '') / 2;
  // }
  return (doc.internal.pageSize.width / 2) - (doc.getTextWidth(text ?? '') / 2)
}

function formatDate(date: Date): string {
  const pad = (num: number) => String(num).padStart(2, '0')
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function addNumerification() {
  positionY = docHeight - 8
  doc.setFontSize(fontSizeMini)
  for (let i = 1; i <= currentPage; i++) {
    doc.setPage(i)
    const line = `Страница ${i} из ${currentPage}`
    const lineWidth = doc.getTextWidth(`Страница ${i} из ${currentPage}`)
    doc.text(line, (docWidth / 2) - (lineWidth / 2), positionY)
  }
}
