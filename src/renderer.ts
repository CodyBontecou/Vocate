console.log('hello from renderer')

const clock: HTMLElement | null = document.querySelector('.clock')
const hour: HTMLElement | null = document.querySelector('#hour')
const minute: HTMLElement | null = document.querySelector('#minute')
const timersContainer: HTMLElement | null =
  document.querySelector('#timers-container')

function updateClocks() {
  const now = new Date()
  const minutes = now.getMinutes()
  const seconds = now.getSeconds()
  const timers = document.querySelectorAll('.clock')

  timers.forEach(timer => {
    const min = <HTMLElement>timer.firstElementChild
    const sec = <HTMLElement>timer.lastElementChild

    if (min) {
      min.innerText = minutes.toString()
    }

    if (sec) {
      sec.innerText = seconds.toString()
    }
  })
}

// updateClocks()
// setInterval(updateClocks, 100)

function countdown(element: string, minutes: number, seconds: number) {
  // Fetch the display element
  const el: HTMLElement | null = document.getElementById(element)

  // Set the timer
  const interval = setInterval(function () {
    if (seconds == 0) {
      if (minutes == 0) {
        if (el) {
          el.innerHTML = 'STOP!'
        }

        clearInterval(interval)
        return
      } else {
        minutes--
        seconds = 60
      }
    }

    if (minutes > 0) {
      var minute_text = minutes + (minutes > 1 ? ' minutes' : ' minute')
    } else {
      var minute_text = ''
    }

    var second_text = seconds > 1 ? '' : ''
    if (el) {
      el.innerHTML = minute_text + ' ' + seconds + ' ' + second_text + ''
    }
    seconds--
  }, 1000)
}

// @ts-ignore
api.receive('create-clock', (args: any) => {
  const transcription = args[0].toLowerCase()
  let timers = document.querySelectorAll('.clock')
  let timerId = 'timer' + timers.length
  const element = document.createElement('li')

  element.innerHTML = `<div class='clock' id='${timerId}'></div>`

  if (timersContainer) {
    timersContainer.appendChild(element)
  }

  if (transcription === 'mid flash') {
    countdown(timerId, 5, 0)
  }
})

// @ts-ignore
api.receive('send-mid-update', (args: any) => {
  console.log(args)
})
