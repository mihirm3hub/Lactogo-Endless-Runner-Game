import { disposeRemove } from './components/game-components'
let sceneAPlayed = false
export const handleSceneA = () => {
    const env1b = document.querySelectorAll('.env1')
    const env2b = document.querySelectorAll('.env2')
    const env3b = document.querySelectorAll('.env3')
    const env4b = document.querySelectorAll('.env4')
    const charM = document.getElementById('char-model')
    const scene = document.querySelector('a-scene')
    if (!sceneAPlayed) {
        sceneAPlayed = true
        charM.setAttribute('animation__scale', {
            property: 'scale',
            to: '.2 .2 .2',
            easing: 'linear',
            dur: 1500,
        })
        charM.setAttribute('animation__rot', {
            property: 'rotation',
            to: '0 180 0',
            easing: 'linear',
            dur: 500,
        })
        charM.addEventListener('animationcomplete__rot', () => {
            document.getElementById('targetBox').setAttribute('aabb-collider', 'objects: .obj; debug: false;')
            charM.removeEventListener('animationcomplete__rot', null)
        })

        setTimeout(() => {
            env1b.forEach((ele) => {
                ele.setAttribute('animation__move', {
                    property: 'position',
                    to: '0 0 .3',
                    easing: 'linear',
                    dur: 625,
                })
                ele.addEventListener('animationcomplete__move', () => {
                    ele.removeEventListener('animationcomplete__move', null)
                    disposeRemove(ele, scene)
                    ele.parentNode.removeChild(ele)
                })
            })
            env2b.forEach((ele) => {
                ele.setAttribute('animation__move', {
                    property: 'position',
                    to: '0 0 .5',
                    easing: 'linear',
                    dur: 1250,
                })
                ele.addEventListener('animationcomplete__move', () => {
                    ele.removeEventListener('animationcomplete__move', null)
                    disposeRemove(ele, scene)
                    ele.parentNode.removeChild(ele)
                })
            })
            env3b.forEach((ele) => {
                ele.setAttribute('animation__move', {
                    property: 'position',
                    to: '0 0 .7',
                    easing: 'linear',
                    dur: 1875,
                })
                ele.addEventListener('animationcomplete__move', () => {
                    ele.removeEventListener('animationcomplete__move', null)
                    disposeRemove(ele, scene)
                    ele.parentNode.removeChild(ele)
                })
            })
            env4b.forEach((ele) => {
                ele.setAttribute('animation__move', {
                    property: 'position',
                    to: '0 0 .9',
                    easing: 'linear',
                    dur: 2500,
                })
                ele.addEventListener('animationcomplete__move', () => {
                    ele.removeEventListener('animationcomplete__move', null)
                    disposeRemove(ele, scene)
                    ele.parentNode.removeChild(ele)
                })
            })
        }, 1500)
    }
}

const left = -2
const middle = 0
const right = 1.8
const positionX = [
    left, middle, right,
]
// let powerInterval = 5000
let pointTimer
let envTimer
let eleTimer
let powTimer
const travelSpeed = 3000
const pointInterval = 1250  // Initial interval for points (2 seconds)
const enemyInterval = 1750  // Initial interval for enemies (5 seconds)
const powerInterval = 7500

const laserDestroyer = (el, pool) => {
    const ele = el
    const component = this
    return function () {
        if (!ele.isPlaying) {
            setTimeout(component.laserDestroyer(ele), 3200)
            return
        }
        pool.returnEntity(ele)
    }
}
let poolEl = null
const elementMaker = (pool) => {
    const rndPosX = positionX[Math.floor(Math.random() * positionX.length)]
    // const rndPoint = Math.floor(Math.random() * pointsArr.length)

    const element = pool.requestEntity()
    if (!element) {
        return
    }
    element.setAttribute('position', `${rndPosX}, 0.1 0`)
    element.play()
    // setTimeout(laserDestroyer(element, pool), 3200)
}

let poolpow = null
const powerMaker = (pool) => {
    const rndPosX = positionX[Math.floor(Math.random() * positionX.length)]
    // const rndPoint = Math.floor(Math.random() * pointsArr.length)

    const power = pool.requestEntity()
    if (!power) {
        return
    }
    power.setAttribute('position', `${rndPosX}, 0.1 0`)
    power.play()
    // setTimeout(laserDestroyer(power, pool), 3200)
}
let poolpoint = null
const pointMaker = (pool) => {
    const rndPosX = positionX[Math.floor(Math.random() * positionX.length)]
    // const rndPoint = Math.floor(Math.random() * pointsArr.length)

    const point = pool.requestEntity()
    if (!point) {
        return
    }
    point.setAttribute('position', `${rndPosX}, 0.1 0`)
    point.setAttribute('visible', 'true')
    point.setAttribute('animation-mixer', {
        clip: 'idle',
        clampWhenFinished: true,
        loop: 'once',
        timeScale: 0,
    })
    point.play()
    // setTimeout(laserDestroyer(point, pool), 3200)
}

let poolsideele = null
let poolsidelvl2 = null
let poolsidelvl3 = null
let poolsidelvl4 = null
let getPosltX
const sideltMaker = (pool, lvl) => {
    const rndPosX = positionX[Math.floor(Math.random() * positionX.length)]
    // const rndElLt = Math.floor(Math.random() * sideElementsLt.length)
    // console.log('pool', pool.requestEntity())
    const sideltEle = pool.requestEntity()

    if (!sideltEle) {
        return
    }
    // console.log(lvl)
    // if (lvl === 2) {
    //   sideltEle.setAttribute('position', '-2.5 0 0')
    // } else {
    //   sideltEle.setAttribute('position', '-0.5 0 0')
    // }
    sideltEle.setAttribute('position', '-0.5 0 0')
    sideltEle.setAttribute('rotation', '0 0 0')
    // sideltEle.setAttribute('gltf-model', `#${sideElementsLt[rndElLt].model}`)
    sideltEle.setAttribute('position', '0 0 0')
    sideltEle.play()
    // setTimeout(laserDestroyer(sideltEle, pool), 3200)
    // setTimeout(sideltEle.removeAttribute('gltf-model'), 3000)
}

let getPosrtX
const sidertMaker = (pool, lvl) => {
    const rndPosX = positionX[Math.floor(Math.random() * positionX.length)]
    // const rndElLt = Math.floor(Math.random() * sideElementsLt.length)
    // console.log('pool', pool.requestEntity())
    const sidertEle = pool.requestEntity()

    if (!sidertEle) {
        return
    }

    // if (lvl === 2) {
    //   sidertEle.setAttribute('position', '-2.5 0 0')
    // } else {
    //   sidertEle.setAttribute('position', '-0.5 0 0')
    // }
    sidertEle.setAttribute('position', '-0.5 0 0')
    // sideltEle.setAttribute('gltf-model', `#${sideElementsLt[rndElLt].model}`)

    sidertEle.setAttribute('rotation', '0 180 0')
    sidertEle.play()
    // setTimeout(laserDestroyer(sidertEle, pool), 3200)
    // setTimeout(sideltEle.removeAttribute('gltf-model'), 3000)
}
let isGen = false

let lastEnemyTime = 0  // Initialize the last enemy generation time to 0

function renderEnimies(timestamp) {
    // Calculate the time elapsed since the last enemy generation
    const timeElapsed = timestamp - lastEnemyTime

    // Check if enough time has passed to generate a new enemy
    if (timeElapsed >= enemyInterval) {
        // GenerateEnemies(speed)
        elementMaker(poolEl)

        // Update the last enemy generation time
        lastEnemyTime = timestamp
    }

    // Continue the game loop
    powTimer = requestAnimationFrame(renderEnimies)
}

let lastPowerTime = 0  // Initialize the last enemy generation time to 0

function renderPowers(timestamp) {
    // Calculate the time elapsed since the last enemy generation
    const timeElapsed = timestamp - lastPowerTime

    // Check if enough time has passed to generate a new enemy
    if (timeElapsed >= powerInterval) {
        // GenerateEnemies(speed)
        powerMaker(poolpow)

        // Update the last enemy generation time
        lastPowerTime = timestamp
    }

    // Continue the game loop
    eleTimer = requestAnimationFrame(renderPowers)
}
let lastPointTime = 0
function renderPoints(timestamp) {
    // Calculate the time elapsed since the last point generation
    const timeElapsed = timestamp - lastPointTime

    // Check if enough time has passed to generate a new point
    if (timeElapsed >= pointInterval) {
        // Generate a point (token)
        pointMaker(poolpoint)

        // Update the last point generation time
        lastPointTime = timestamp
    }

    // Continue the point generation loop unless a condition is met

    pointTimer = requestAnimationFrame(renderPoints)
}
let sidePool
// const disposeChildren = (nodeList) => {
//   for (let i = 0; i < nodeList.length; i++) {
//     disposeRemove(nodeList[i])
//   }
// }
export const handleGeneration = (action, state, lvl, speed) => {
    // console.log(action, state, lvl, speed)
    // Define variables to keep track of game levels, generation intervals, and game state
    const currentLevel = lvl
    const scene = document.querySelector('a-scene')
    // if (currentLevel === 2) {
    // //  isGen = false
    //   sideElementsLt.splice(0, sideElementsLt.length)
    //   sideElementsLt.push({name: 'lvl2mount', model: 'lvl2mount'})
    //   sideElementsLt.push({name: 'lvl2pineT', model: 'lvl2pineT'})
    //   sideElementsLt.push({name: 'lvl2pinpeTent', model: 'lvl2pinpeTent'})
    //   sideElementsLt.push({name: 'lvl2pinpeHouse', model: 'lvl2pinpeHouse'})
    //   sideElementsRt.splice(0, sideElementsRt.length)
    //   sideElementsRt.push({name: 'lvl2mount', model: 'lvl2mount'})
    //   sideElementsRt.push({name: 'lvl2pineT', model: 'lvl2pineT'})
    //   sideElementsRt.push({name: 'lvl2pinpeTent', model: 'lvl2pinpeTent'})
    //   sideElementsRt.push({name: 'lvl2pinpeHouse', model: 'lvl2pinpeHouse'})
    //   // enemyElements.push({name: 'spikes', type: 'enemy', model: 'spikesModel'})
    //   // enemyInterval -= 200
    // } else if (currentLevel === 3) {
    //   ///   isGen = false
    //   sideElementsLt.splice(0, sideElementsLt.length)
    //   sideElementsLt.push({name: 'lvl3wmill1', model: 'lvl3wmill1'})
    //   sideElementsLt.push({name: 'lvl3wmill2', model: 'lvl3wmill2'})
    //   sideElementsLt.push({name: 'lvl3tree1', model: 'lvl3tree1'})
    //   sideElementsLt.push({name: 'lvl3tree2', model: 'lvl3tree2'})
    //   sideElementsRt.splice(0, sideElementsRt.length)
    //   sideElementsRt.push({name: 'lvl3wmill1', model: 'lvl3wmill1'})
    //   sideElementsRt.push({name: 'lvl3wmill2', model: 'lvl3wmill2'})
    //   sideElementsRt.push({name: 'lvl3tree1', model: 'lvl3tree1'})
    //   sideElementsRt.push({name: 'lvl3tree2', model: 'lvl3tree2'})
    //   // enemyElements.push({name: 'spikes', type: 'enemy', model: 'spikesModel'})
    //   // enemyElements.push({name: 'smallSpikes', type: 'enemy', model: 'smallSpikesModel'})
    // //  enemyInterval -= 200
    // } else if (currentLevel === 4) {
    //   // isGen = false
    //   sideElementsLt.splice(0, sideElementsLt.length)
    //   sideElementsLt.push({name: 'lvl4build1', model: 'lvl4build1'})
    //   sideElementsLt.push({name: 'lvl4build2', model: 'lvl4build2'})
    //   sideElementsLt.push({name: 'lvl4build3', model: 'lvl4build3'})
    //   sideElementsRt.splice(0, sideElementsRt.length)
    //   sideElementsRt.push({name: 'lvl4build1', model: 'lvl4build1'})
    //   sideElementsRt.push({name: 'lvl4build2', model: 'lvl4build2'})
    //   sideElementsRt.push({name: 'lvl4build3', model: 'lvl4build3'})
    //   // enemyElements.push({name: 'virus', type: 'enemy', model: 'virusModel'})
    //   // enemyElements.push({name: 'bacteria', type: 'enemy', model: 'bacteriaModel'})
    //   // enemyInterval -= 200
    // }
    // console.log(travelSpeed)
    // console.log('interval:', sideEnvironmentInterval)
    // clearInterval(pointTimer)
    clearInterval(envTimer)
    // clearInterval(eleTimer)
    // cancelAnimationFrame(eleTimer)
    // if (!containerDoc) {
    //   containerDoc = document.getElementById('eleGen')
    // }
    if (!poolEl) {
        poolEl = document.querySelector('#eleGen').components.pool__elements
    }
    if (!poolpow) {
        poolpow = document.querySelector('#powerGen').components.pool__powers
    }
    if (!poolpoint) {
        poolpoint = document.querySelector('#pointGen').components.pool__points
    }
    if (!poolsideele) {
        poolsideele = document.querySelector('#sideEleGen').components.pool__sideeles
    }
    if (!poolsidelvl2) {
        poolsidelvl2 = document.querySelector('#sideEleGenlvl2').components.pool__sidelvl2s
    }
    if (!poolsidelvl3) {
        poolsidelvl3 = document.querySelector('#sideEleGenlvl3').components.pool__sidelvl3s
    }
    if (!poolsidelvl4) {
        poolsidelvl4 = document.querySelector('#sideEleGenlvl4').components.pool__sidelvl4s
    }
    // console.log(document.querySelector('#sideEleGen').childNodes)
    if (currentLevel === 2) {
        sidePool = poolsidelvl2
        // disposeChildren(document.querySelector('#sideEleGen').childNodes)
        //  disposeRemove(document.querySelector('#sideEleGen'), scene)
    } else if (currentLevel === 3) {
        sidePool = poolsidelvl3
        //  disposeRemove(document.querySelector('#sideEleGenlvl2'), scene)
    } else if (currentLevel === 4) {
        sidePool = poolsidelvl4
        // disposeRemove(document.querySelector('#sideEleGenlvl3'), scene)
    } else {
        sidePool = poolsideele
    }
    if (action === 'play') {
        envTimer = setInterval(() => {
            sideltMaker(sidePool, currentLevel)
            sidertMaker(sidePool, currentLevel)
            // sideEleMaker(poolside, currentLevel, speed)
        }, (speed / 2) - 200)
        if (!isGen) {
            // pointTimer = setInterval(() => {
            // tokenMaker(pooltok)
            // }, pointInterval)

            // eleTimer = setInterval(() => {
            // // generateEnemies(speed)
            // elementMaker(poolEl)
            // }, enemyInterval)

            pointTimer = requestAnimationFrame(renderPoints)
            eleTimer = requestAnimationFrame(renderEnimies)
            powTimer = requestAnimationFrame(renderPowers)
            isGen = true
        }
    } else if (action === 'stop') {
        isGen = false
        cancelAnimationFrame(pointTimer)
        cancelAnimationFrame(eleTimer)
        cancelAnimationFrame(powTimer)
        cancelAnimationFrame(eleTimer)
    } else if (action === 'end') {
        isGen = true
        cancelAnimationFrame(pointTimer)
        cancelAnimationFrame(eleTimer)
        cancelAnimationFrame(powTimer)
        clearInterval(envTimer)
        // cancelAnimationFrame(eleTimer)
    }
}
