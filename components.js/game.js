import { GameKit, COLLISION_ENTER, COLLISION_EXIT, COLLIDING } from 'game-kit'
import { handleAnimationComponent, sideEnvGenerator, sceneAnimFirst } from './animate-scene'
// update
import { handleSceneA, handleGeneration } from '../scene-control'

import { checkPower } from './game-components'
import { gaEvent } from '../firebase'
import { submitScoreDetailsAndAnalytics, uuidv4 } from '../apiUtils'

const lvl1Sound = require('../assets/sfx/newSfx/Music_Level_01_30_Sec.mp3')
const lvl2Sound = require('../assets/sfx/newSfx/Music_Level_02_30_Sec.mp3')
const lvl3Sound = require('../assets/sfx/newSfx/Music_Level_03_30_Sec.mp3')
const lvl4Sound = require('../assets/sfx/newSfx/Music_Level_04_30_Sec.mp3')
const isLoggedIn = () => {
    if (localStorage.getItem('CIAM_UID') && localStorage.getItem('isLoggedIn') === 'YES') {
        return 'YES'
    } else {
        return 'NO'
    }
}
const sound1 = new window.Howl({
    src: lvl1Sound,
    volume: 0.5,
    loop: true,
})
const sound2 = new window.Howl({
    src: lvl2Sound,
    volume: 0.5,
    loop: true,
})
const sound3 = new window.Howl({
    src: lvl3Sound,
    volume: 0.5,
    loop: true,
})
const sound4 = new window.Howl({
    src: lvl4Sound,
    volume: 0.5,
    loop: true,
})

const lvlUpSound = new window.Howl({
    src: [require('../assets/sfx/Level_Up.mp3')],
    volume: 0.8,
})

const tokenSound = new window.Howl({
    src: [require('../assets/sfx/Coin_Collection_SFX.mp3')],
    volume: 0.8,
})

const enemySound = new window.Howl({
    src: [require('../assets/sfx/Obstacle_SFX.mp3')],
    volume: 0.8,
})

const dominoSound = new window.Howl({
    src: [require('../assets/sfx/newSfx/Audio_Extracted.mp3')],
    volume: 0.8,
})

const loseSound = new window.Howl({
    src: [require('../assets/sfx/newSfx/Loose_SFX_02.mp3')],
    volume: 0.8,
})

const congratsSound = new window.Howl({
    src: [require('../assets/sfx/newSfx/Win_SFX_02.mp3')],
    volume: 0.8,
})

let startTime
let currentTime
let elapsedTime = 0
let isCounting = false

const gameComponent = {
    init() {
        this.offset = 0
        this.offsetVal = 0.06
        this.isAnimating = false
        this.distance = 0

        this.gameStat = false
        this.isImmune = false

        this.multiplier = 0
        this.tokenDiff = 0
        this.timeScale = 1
        this.offSetAdder = 0

        this.scoreCount = 0
        this.tokenCount = 0

        this.currentLvl = 1
        this.genSpeed = 3000

        // let distanceTimer
        this.scene = this.el.sceneEl

        const model = document.getElementById('char-model')
        model.setAttribute('animation', 'property: model-relative-opacity.opacity;from: 1; to: 0; dur: 100; loop:4; dir:alternate')

        const lvlScreen = document.getElementById('levelScreen')
        const lvlCount = document.getElementById('lvlCount')
        this.generatorElement = document.getElementById('eleGen')

        this.gameElement = document.getElementById('simpleGame')

        this.game = new GameKit(this.gameState)
        this.game.setPlayer(document.getElementById('char-model'))

        const handleLvlUp = () => {
            if (this.tokenDiff <= 200) {
                if (this.isAnimating) {
                    this.currentLvl++

                    lvlUpSound.play()

                    this.multiplier += 250
                    this.tokenDiff += 100
                    this.timeScale += 0.5
                    this.offSetAdder += 0.01

                    if (this.currentLvl === 2) {
                        document.getElementById('congoLvl2').classList.add('trophy-won')
                        document.getElementById('congoLvl2').classList.remove('trophy-lose')
                        sound1.stop()
                        sound2.play()
                        handleGeneration('play', 'normal', this.currentLvl, this.genSpeed - this.multiplier)
                    } else if (this.currentLvl === 3) {
                        document.getElementById('congoLvl3').classList.add('trophy-won')
                        document.getElementById('congoLvl3').classList.remove('trophy-lose')
                        sound2.stop()
                        sound3.play()
                        handleGeneration('play', 'normal', this.currentLvl, this.genSpeed - this.multiplier)
                    } else if (this.currentLvl === 4) {
                        document.getElementById('congoLvl4').classList.add('trophy-won')
                        document.getElementById('congoLvl4').classList.remove('trophy-lose')
                        document.getElementById('congratsScreen').classList.add('sccore-gif')
                        document.getElementById('congoTxt').src = require('../assets/uiAssets/images/congrats-text.png')
                        document.getElementById('congoGif').src = require('../assets/uiAssets/videos/celebDance.gif')
                        sound3.stop()
                        sound4.play()
                        handleGeneration('play', 'normal', this.currentLvl, this.genSpeed - this.multiplier)
                    }
                    model.setAttribute('animation-mixer', {
                        clip: 'run',
                        crossFadeDuration: 0.4,
                        timeScale: this.timeScale,
                    })

                    lvlCount.innerText = `${this.currentLvl}`
                    lvlScreen.style.display = 'flex'
                    this.isImmune = true
                    isCounting = true

                    setTimeout(() => {
                        this.isImmune = false
                        isCounting = false
                        lvlScreen.style.display = 'none'
                    }, 6000)
                }
                setTimeout(handleLvlUp, 30000)
            } else {
                console.log('lvl 4 finished')
                setTimeout(checkLife(25), 2000)
            }
        }

        const handleDistance = () => {
            if (this.isAnimating) {
                this.distance += 10
                document.getElementById('distance').innerHTML = `${this.distance}M`
                //  console.log(this.distance)
                if (this.distance % 100 === 0) {
                    //  console.log('score:', scoreCount)
                    this.scoreCount += 100
                    document.getElementById('score-count').innerHTML = this.scoreCount
                }
            }
        }

        const getUrlParameter = (paramName) => {
            const urlSearchParams = new URLSearchParams(window.location.search)
            return urlSearchParams.get(paramName)
        }

        let gatimer

        const gamePlayConfig = () => {
            gatimer = setTimeout(() => {
                gaEvent('Time Spend on Gameplay Screen', 'Timer')
            }, 300000)
            model.setAttribute('animation-mixer', 'clip:idle')
            setTimeout(() => {
                this.isAnimating = true
                model.setAttribute('animation-mixer', {
                    clip: 'run',
                    crossFadeDuration: 0.4,
                })
                startTime = Date.now()
                //   if (this.isAnimating) {
                setTimeout(handleLvlUp, 30000)
                //     }
                this.distanceTimer = setInterval(handleDistance, 1000)
            }, 1350)
        }

        const goBtn = document.getElementById('goBtn')
        const timerElement = document.getElementById('timer')
        const startScreen = document.getElementById('startScreen')
        const gameScreen = document.getElementById('gameScreen')
        const scoreScreen = document.getElementById('scoreScreen')
        const congratsScreen = document.getElementById('congratsScreen')

        let btnClicked = false
        let count = 3
        let timerInterval
        let isTimerRunning = false  // Track whether the timer is currently running
        let isRotating = false

        const startTimer = () => {
            isTimerRunning = true
            goBtn.disabled = true
            //  playTimer.disabled = true  // Disable the button while the timer is running
            // Start rotating the image
            if (!isRotating) {
                const rotatingImg = document.querySelector('.rotating-img')
                rotatingImg.style.animationPlayState = 'running'
                isRotating = true
            }
            timerInterval = setInterval(() => {
                count--
                if (count >= 1) {
                    timerElement.textContent = count
                } else {
                    clearInterval(timerInterval)

                    timerElement.textContent = 'Go!'

                    // sceneAnimFirst('normal', this.multiplier, this.tokenDiff, this.gameStat)
                    isTimerRunning = false
                    goBtn.disabled = false
                    //    playTimer.disabled = false  // Enable the button when the timer is done
                    // Stop rotating the image when the timer is done
                    if (isRotating) {
                        const rotatingImg = document.querySelector('.rotating-img')
                        rotatingImg.style.animationPlayState = 'paused'
                        isRotating = false
                    }
                    startScreen.style.display = 'none'
                    startScreen.remove()
                    gameScreen.style.display = 'flex'
                    document.querySelector('.bar-progress').style.width = '100%'
                    handleSceneA()
                    setTimeout(() => {
                        gamePlayConfig()
                    }, 500)
                    setTimeout(() => {
                        //   console.log(this.currentLvl, this.genSpeed)
                        handleGeneration('play', 'normal', this.currentLvl, this.genSpeed)
                    }, 200)
                }
            }, 1000)
        }

        const handleGameStart = () => {
            localStorage.setItem('is-restarted', 'No')
            goBtn.removeEventListener('click', handleGameStart)
            // read CIAM_UID from url if any
            const CIAM_UID = getUrlParameter('u')

            if (CIAM_UID) {
                // alert('User is logged IN')
                localStorage.setItem('CIAM_UID', CIAM_UID)
                localStorage.setItem('isLoggedIn', 'YES')
            } else {
                // alert('User is a Guest')
                localStorage.removeItem('CIAM_UID')
                localStorage.setItem('isLoggedIn', 'NO')
            }
            const UNIQUE_UID = localStorage.getItem('UNIQUE_UID')
            if (!UNIQUE_UID) {
                localStorage.setItem('UNIQUE_UID', uuidv4())
            }
            sound1.play()

            this.scene.setAttribute('handle-char', '')
            if (!btnClicked) {
                this.gameElement.play()
                this.startGame()
                if (document.getElementById('scnImg')) {
                    document.getElementById('scnImg').style.display = 'none'
                }
                document.querySelector('.top-timer').style.display = 'flex'
                if (!isTimerRunning) {
                    count = 3
                    timerElement.textContent = count
                    startTimer()
                }
                document.getElementById('congoLvl1').classList.add('trophy-won')
                document.getElementById('congoLvl1').classList.remove('trophy-lose')
                btnClicked = true
                isCounting = false
                goBtn.classList.remove('fade-in')
                goBtn.classList.add('fade-out')
            }
            this.gameStat = true
        }
        goBtn.addEventListener('click', handleGameStart)

        const normalizeGame = () => {
            handleGeneration('play', 'normal', this.currentLvl, this.genSpeed)
            // sceneAnimFirst('normal', this.multiplier, this.tokenDiff, this.gameStat)
            this.offsetVal = this.offSetAdder + this.offsetVal
            this.isImmune = false
            model.removeAttribute('highlight-emission')
            model.setAttribute('highlight-emission', 'color:#000000')
            model.setAttribute('animation-mixer', {
                timeScale: this.timeScale,
            })
            model.setAttribute('animation__scaleUp', {
                property: 'scale',
                to: '.2 .2 .2',
                easing: 'easeInElastic',
                dur: 1500,
            })
        }
        this.countToken = 0
        this.countSheild = 0
        this.countBoost = 0
        this.countFocus = 0
        this.countProtein = 0
        this.countDomino = 0

        const checkLife = (lifeValue) => {
            clearTimeout(gatimer)
            if (lifeValue === 25) {
                normalizeGame()
                this.gameOver()
                isCounting = true
                btnClicked = false
                gameScreen.style.display = 'none'
                congratsScreen.style.display = 'flex'
                // scoreScreen.style.display = 'flex'
                sound1.stop()
                sound2.stop()
                sound3.stop()
                sound4.stop()
                currentTime = Date.now()
                elapsedTime = currentTime - startTime
                this.timeCount = Math.floor(elapsedTime / 1000)
                const level = lvlCount?.innerText || 0
                //  console.log(level)

                // log final counts
                console.log(this.countToken,
                    this.countSheild,
                    this.countBoost,
                    this.countFocus,
                    this.countProtein,
                    this.countDomino)

                const analyticsObj = {
                    scoreCount: this.scoreCount,
                    distance: this.distance,
                    tokenCount: this.tokenCount,
                    timeCount: this.timeCount,
                    startTime,
                    currentTime,
                    level: Number(level),
                    countSheild:
                        this.countSheild,
                    countBoost:
                        this.countBoost,
                    countFocus:
                        this.countFocus,
                    countProtein:
                        this.countProtein,
                    countDomino:
                        this.countDomino,
                }

                localStorage.setItem('SAVED_SCORE_ANALYTICS', JSON.stringify(analyticsObj))

                //  console.log(this.scoreCount, this.distance, this.tokenCount, this.timeCount)

                const scorePercent = (Number(this.scoreCount) / 100) * 5

                localStorage.setItem('SAVED_SCORE', JSON.stringify({
                    scoreCount: this.scoreCount,
                    scorePercent,
                    finalScoreCount: `${this.scoreCount} Skor`,
                    distance: `${this.distance} Mt`,
                    timeCount: `${this.timeCount}+ s`,
                    tokenCount: `${this.tokenCount} T`,

                }))

                const ciamUid = localStorage.getItem('CIAM_UID')
                if ((!ciamUid || ciamUid == '') && isLoggedIn() == 'NO') {
                    submitScoreDetailsAndAnalytics(
                        analyticsObj.scoreCount,
                        analyticsObj.distance,
                        analyticsObj.tokenCount,
                        analyticsObj.timeCount,
                        analyticsObj.startTime,
                        analyticsObj.currentTime,
                        Number(level),
                        analyticsObj.countSheild,
                        analyticsObj.countBoost,
                        analyticsObj.countFocus,
                        analyticsObj.countProtein,
                        analyticsObj.countDomino
                    )
                }

                document.getElementById('finalScore').innerText = `${this.scoreCount}`
                document.getElementById('finalClubScore').innerText = `${scorePercent}`

                // SKOR ANDA stats display variables
                document.getElementById('finalScore-count').innerText = `${this.scoreCount} Skor`
                document.getElementById('distance-count').innerText = `${this.distance} Mt`
                document.getElementById('time-count').innerText = `${this.timeCount}+ s`
                document.getElementById('token-count').innerText = `${this.tokenCount} T`
            }
            if (lifeValue === 75) {
                document.getElementById('health').classList.add('blink')
                document.getElementById('heartImg').src = require('../assets/uiAssets/images/heart-red.png')
                document.querySelector('.bar-progress').style.backgroundColor = '#ff0000'
            }
        }
        // const removeEl = () => {
        //   this.obj.parentNode.removeChild(this.obj)
        //   this.obj.parentNode.removeEventListener('animationcomplete__move', removeEl)
        // }

        const score = () => {
            if (!isCounting) {
                const target = document.querySelector('.colliderBox')
                // const model = document.getElementById('char-model')
                target.addEventListener('hitstart', (event) => {
                    this.charPos = model.getAttribute('position')
                    this.objName = event.target.components['aabb-collider'].closestIntersectedEl.id
                    this.obj = document.getElementById(`${this.objName}`)
                    this.objPos = this.obj.parentNode.getAttribute('position')
                    console.log(event.target.components['aabb-collider'].intersectedEls, 'hit obj')
                    if (this.obj.parentNode.classList.contains('token') && this.charPos.x >= this.objPos.x / 10) {
                        this.tokenCount++
                        this.countToken++
                        this.scoreCount += 100
                        tokenSound.play()
                        document.getElementById('score-count').innerHTML = this.scoreCount
                        this.obj.parentNode.setAttribute('visible', 'false')
                        // this.obj.parentNode.setAttribute('animation__scale', {
                        //   property: 'scale',
                        //   to: '15 15 15',
                        //   easing: 'linear',
                        //   dur: 800,
                        // })
                        // this.obj.parentNode.setAttribute('animation__move', {
                        //   property: 'position',
                        //   from: this.objPos,
                        //   to: `${this.objPos.x} 5 21`,
                        //   easing: 'linear',
                        //   dur: 800,
                        // })
                        //  this.obj.parentNode.addEventListener('animationcomplete__move', removeEl)
                    } else if (this.obj.parentNode.classList.contains('power') && this.charPos.x >= this.objPos.x / 10) {
                        this.scoreCount += 200
                        if (this.obj.parentNode.classList.contains('info')) {
                            this.pauseGame()
                            setTimeout(() => {
                                console.log('checkanim:', this.isAnimating)
                                if (!this.isAnimating) {
                                    this.resumeGame()
                                }
                                this.obj.parentNode.classList.remove('info')
                            }, 3500)
                        }
                        console.log(this.obj.parentNode.id)
                        checkPower(this.obj.parentNode)
                        document.getElementById('score-count').innerHTML = this.scoreCount

                        if (this.obj.parentNode.id === 'shield') {
                            this.countSheild++
                            this.isImmune = true
                            setTimeout(() => {
                                normalizeGame()
                            }, 4500)
                        } else if (this.obj.parentNode.id === 'boost') {
                            this.countBoost++
                            this.offsetVal = this.offSetAdder + 0.08
                            this.boostSpeed = this.genSpeed - 250
                            model.removeAttribute('highlight-emission')
                            model.setAttribute('highlight-emission', 'color: #00FFFF')
                            model.setAttribute('animation-mixer', {
                                timeScale: this.timeScale + 0.5,
                            })
                            setTimeout(() => {
                                normalizeGame()
                            }, 4500)
                        } else if (this.obj.parentNode.id === 'focus') {
                            this.countFocus++
                            this.offsetVal = this.offSetAdder + 0.04
                            this.boostSpeed = this.genSpeed + 250
                            model.setAttribute('animation-mixer', {
                                timeScale: this.timeScale - 0.5,
                            })
                            setTimeout(() => {
                                normalizeGame()
                            }, 4500)
                        } else if (this.obj.parentNode.id === 'protein') {
                            this.countProtein++
                            this.isImmune = true
                            model.setAttribute('animation__scaleUp', {
                                property: 'scale',
                                to: '.3 .3 .3',
                                easing: 'easeOutElastic',
                                dur: 1500,
                            })
                            setTimeout(() => {
                                normalizeGame()
                            }, 4500)
                        }

                        // this.obj.setAttribute('animation__scale', {
                        //   property: 'scale',
                        //   to: '15 15 15',
                        //   easing: 'linear',
                        //   dur: 800,
                        // })
                        // this.obj.setAttribute('animation__move', {
                        //   property: 'position',
                        //   from: this.objPos,
                        //   to: `${this.objPos.x} 5 21`,
                        //   easing: 'linear',
                        //   dur: 800,
                        // })
                        //  this.obj.addEventListener('animationcomplete__move', removeEl)
                    } else if (!this.isImmune && this.obj.parentNode.classList.contains('enemy')) {
                        // console.log('enemy hit')
                        enemySound.stop()
                        enemySound.play()

                        const lifeElement = document.getElementById('health')
                        const lifeValue = parseInt(lifeElement.textContent)
                        checkLife(lifeValue)
                        const newVal = lifeValue - 25
                        lifeElement.textContent = `${newVal.toString()}%`
                        document.querySelector('.bar-progress').style.width = `${newVal}%`
                        model.removeAttribute('animation-mixer')
                        model.setAttribute('animation-mixer', {
                            clip: 'wobble',
                        })

                        model.removeAttribute('animation')
                        model.setAttribute('animation', 'property: model-relative-opacity.opacity;from: 1; to: 0; dur: 100; loop:4; dir:alternate')

                        model.addEventListener('animation-loop', () => {
                            model.setAttribute('animation-mixer', {
                                clip: 'run',
                                crossFadeDuration: 0.4,
                                timeScale: this.timeScale,
                            })
                            model.removeEventListener('animation-loop', null)
                        })
                    } else if (this.obj.parentNode.classList.contains('domino')) {
                        this.countDomino++

                        dominoSound.play()
                        this.scoreCount += 400
                        document.getElementById('score-count').innerHTML = this.scoreCount

                        const spanElement = document.querySelector('#dominoNotif span')
                        let currentValue = parseInt(spanElement.textContent)
                        currentValue++
                        spanElement.textContent = currentValue.toString()
                        this.obj.parentNode.removeAttribute('animation-mixer')
                        this.obj.parentNode.setAttribute('animation-mixer', {
                            timeScale: 7,
                        })
                        this.obj.parentNode.addEventListener('animation-loop', () => {
                            this.obj.parentNode.setAttribute('animation-mixer', {
                                clip: '*',
                                loop: 'once',
                                timeScale: 7,
                                clampWhenFinished: true,
                            })
                            this.obj.parentNode.removeAttribute('animation-mixer')
                            this.obj.parentNode.removeEventListener('animation-loop', null)
                        })
                    }
                })
            }
        }
        score()

        const modals = document.querySelectorAll('.modal')
        document.querySelector('.close-btn').onclick = () => {
            modals.forEach((modal) => {
                modal.classList.remove('show-modal')
            })
            this.resumeGame()
        }
    },
    resetElements() {
        this.game.reset()
    },
    startGame() {
        this.resetElements()
        this.gameElement.play()
        this.game.start()
    },
    pauseGame() {
        handleGeneration('stop', 'normal', this.currentLvl, 3000)
        this.isAnimating = false
        this.gameElement.pause()
        this.gameStat = false
    },
    resumeGame() {
        handleGeneration('play', 'normal', this.currentLvl, 3000)
        this.isAnimating = true
        this.gameElement.play()
        this.gameStat = true
    },
    gameOver() {
        console.log('game over exec', this.currentLvl)
        this.pauseGame()
        handleGeneration('end', 'normal', this.currentLvl, 3000)
        if (this.currentLvl === 4) {
            congratsSound.play()
        } else {
            loseSound.play()
        }
        setTimeout(() => {
            document.getElementById('congratsScreen').style.display = 'none'
            document.getElementById('scoreScreen').style.display = 'flex'
        }, 3500)
        this.game.end()
        if (this.scene) {
            this.scene.remove()
        }
    },
    tick() {
        if (this.isAnimating) {
            const mesh = document.getElementById('roadWay').getObject3D('mesh')
            if (!mesh) {
                console.log('curr lvl', this.currentLvl)
                return
            }
            mesh.traverse((node) => {
                if (node.isMesh) {
                    node.material.map.offset.y = this.offset
                    node.material.needsUpdate = true
                }
            })
            this.offset += this.offsetVal
        }
    },
}
export { gameComponent }
