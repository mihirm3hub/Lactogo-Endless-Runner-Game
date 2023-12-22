const enemyElements = [
    { name: 'virus', type: 'enemy', model: 'virusModel', isInfo: false },
    { name: 'spikes', type: 'enemy', model: 'spikesModel', isInfo: false },
    { name: 'bacteria', type: 'enemy', model: 'bacteriaModel', isInfo: false },
    { name: 'smallSpikes', type: 'enemy', model: 'smallSpikesModel', isInfo: false },
]
let poselY = 0
let enemyCounter = 0
const elementComponent = {
    schema: {
        speed: { default: 0.25 },
        radius: { type: 'number', default: 1 },
    },

    init() {
        const { el } = this
        this.pos = this.el.object3D.position
        this.pool = document.querySelector('#eleGen').components.pool__elements

        el.id = enemyElements[enemyCounter].name
        el.setAttribute('gltf-model', `#${enemyElements[enemyCounter].model}`)

        if (enemyElements[enemyCounter].type === 'enemy') {
            el.classList.add('enemy')
            el.setAttribute('animation-mixer', 'clip:*')
            //   console.log('enemy created')
            if (enemyElements[enemyCounter].name === 'spikes') {
                poselY = 0.1
                el.replaceChildren()
                el.insertAdjacentHTML('beforeend', `
            <a-box id="collideBox" class="obj" material="shader:flat; transparent:true; opacity:0; alphaTest: 0.5" depth="0.01" height="0.01" width="0.35" position="0 0.02 0"></a-box>
          `)
                el.setAttribute('scale', '13 10 10')
            } else if (enemyElements[enemyCounter].name === 'smallSpikes') {
                poselY = 0.1
                el.replaceChildren()
                el.insertAdjacentHTML('beforeend', `
          <a-box id="enemyCollideBox" class="obj" material="shader:flat; transparent:true; opacity:0; alphaTest: 0.5" depth="0.01" height="0.01" width="0.15" position="0 0.02 0"></a-box>
        `)
                el.setAttribute('scale', '10 10 10')
            } else {
                poselY = 1
                el.replaceChildren()
                el.insertAdjacentHTML('beforeend', `
          <a-box id="enemyCollideBox" class="obj" material="shader:flat; transparent:true; opacity:0; alphaTest: 0.5" depth="0.1" height="0.1" width="0.1" position="0 0.1 0"></a-box>
        `)
                el.setAttribute('scale', '12 12 12')
            }
        }
        enemyCounter++
    },

    tick() {
        const { el } = this
        const position = el.getAttribute('position')
        position.z += this.data.speed
        el.setAttribute('position', position)

        if (position.z > 26) {
            this.pool.returnEntity(el)
        }
    },
}

const powerElements = [
    { name: 'boost', type: 'power', model: 'boostModel', isInfo: true },
    { name: 'shield', type: 'power', model: 'shieldModel', isInfo: true },
    { name: 'focus', type: 'power', model: 'focusModel', isInfo: true },
    { name: 'protein', type: 'power', model: 'proteinModel', isInfo: true },
]

let powerCounter = 0
const powerComponent = {
    schema: {
        speed: { default: 0.25 },
    },

    init() {
        const { el } = this
        this.pool = document.querySelector('#powerGen').components.pool__powers

        el.id = powerElements[powerCounter].name
        el.setAttribute('gltf-model', `#${powerElements[powerCounter].model}`)

        el.replaceChildren()
        el.insertAdjacentHTML('beforeend', `
      <a-box id="${powerElements[powerCounter].name}CollideBox" class="obj" material="shader:flat; transparent:true; opacity:0; alphaTest: 0.5" depth="0.1" height="0.1" width="0.1" position="0 0.1 0"></a-box>
        <a-cone
        geometry="height:2; open-ended:true; radiusBottom:0.025; radiusTop:0.5"
        rotation="0 180 0"
        position="0 -0.08 0"
        scale=".2 .2 .2"
        material="shader: flat; src:  #powerTex; blending: additive; side: double; repeat: .9 .9; transparent:true; alphaTest:0.5;"
      >
      <a-ring
        rotation="-90 0 0"
        scale=".3 .3 .3"
        geometry="radiusInner:.75; radiusOuter:.9"
        material="shader: flat;blending: additive; side: double;color:#00f9ff"
      ></a-ring>
    `)
        el.setAttribute('scale', '10 10 10')
        el.setAttribute('reflections', 'type: static')
        el.classList.add('power')
        el.classList.add('info')
        powerCounter++
    },

    tick() {
        const { el } = this
        const position = el.getAttribute('position')
        position.z += this.data.speed
        el.setAttribute('position', position)

        if (position.z > 26) {
            this.pool.returnEntity(el)
        }
    },
}

const pointElements = [
    { name: 'tokenA', model: 'tokenModel', type: 'token' },
    { name: 'tokenB', model: 'tokenModel', type: 'token' },
    { name: 'triDomModel', model: 'triDomModel', type: 'domino' },
    { name: 'quadDomModel', model: 'quadDomModel', type: 'domino' },
    { name: 'tokenC', model: 'tokenModel', type: 'token' },
    { name: 'tokenD', model: 'tokenModel', type: 'token' },
]
let pointCounter = 0
const pointComponent = {
    schema: {
        speed: { default: 0.25 },
    },

    init() {
        const { el } = this
        this.pool = document.querySelector('#pointGen').components.pool__points

        el.id = pointElements[pointCounter].name
        el.setAttribute('gltf-model', `#${pointElements[pointCounter].model}`)

        if (pointElements[pointCounter].type === 'token') {
            el.setAttribute('scale', '8 8 8')
            el.classList.add('token')
            el.setAttribute('xrextras-spin', 'speed: 1000')
            el.setAttribute('reflections', 'type: static')
            el.insertAdjacentHTML('beforeend', `
      <a-box id="${pointElements[pointCounter].name}Collider" class="obj" material="shader:flat; transparent:true; opacity:0; alphaTest: 0.5" depth="0.1" height="0.1" width="0.1" position="0 0.1 0"></a-box>
    `)
        } else {
            el.setAttribute('scale', '.3 .3 .3')
            el.setAttribute('shadow', '')
            el.insertAdjacentHTML('beforeend', `
      <a-box id="${pointElements[pointCounter].name}Collider" class="obj" material="shader:flat; transparent:true; opacity:0; alphaTest: 0.5" depth="5" height="5" width="5" position="0 2 0"></a-box>
    `)
            el.classList.add('domino')
        }
        pointCounter++
    },

    tick() {
        const { el } = this
        const position = el.getAttribute('position')
        position.z += this.data.speed
        el.setAttribute('position', position)

        if (position.z > 26) {
            this.pool.returnEntity(el)
        }
    },
}

const sideElementsLt = [
    { name: 'lvl1gw', model: 'lvl1gw' },
    { name: 'lvl1tree', model: 'lvl1tree' },
    { name: 'lvl1tower', model: 'lvl1tower' },
    { name: 'lvl1gw', model: 'lvl1gw' },
    { name: 'lvl1tree', model: 'lvl1tree' },
    { name: 'lvl1tower', model: 'lvl1tower' },
]

let sideCounter = 0
const sideEleComponent = {
    schema: {
        speed: { default: 0.25 },
    },

    init() {
        const { el } = this
        this.pool = document.querySelector('#sideEleGen').components.pool__sideeles

        el.id = sideElementsLt[sideCounter].name
        el.setAttribute('gltf-model', `#${sideElementsLt[sideCounter].model}`)
        el.setAttribute('scale', '10 10 12')
        //  el.setAttribute('animation-mixer', 'clip: *')
        sideCounter++
    },

    tick() {
        const { el } = this
        const position = el.getAttribute('position')
        position.z += this.data.speed
        el.setAttribute('position', position)

        if (position.z > 26) {
            this.pool.returnEntity(el)
        }
    },
}

const sideElementsLvl2 = [
    { name: 'lvl2mount', model: 'lvl2mount' },
    { name: 'lvl2mount', model: 'lvl2mount' },
    { name: 'lvl2pineT', model: 'lvl2pineT' },
    { name: 'lvl2pineT', model: 'lvl2pineT' },
    { name: 'lvl2pinpeTent', model: 'lvl2pinpeTent' },
    { name: 'lvl2pinpeTent', model: 'lvl2pinpeTent' },
    { name: 'lvl2pinpeHouse', model: 'lvl2pinpeHouse' },
    { name: 'lvl2pinpeHouse', model: 'lvl2pinpeHouse' },
]

let sidelvl2Counter = 0
const sidelvl2Component = {
    schema: {
        speed: { default: 0.25 },
    },

    init() {
        const { el } = this
        this.pool = document.querySelector('#sideEleGenlvl2').components.pool__sidelvl2s

        el.id = sideElementsLvl2[sidelvl2Counter].name
        el.setAttribute('gltf-model', `#${sideElementsLvl2[sidelvl2Counter].model}`)
        el.setAttribute('scale', '13 14 15')
        // el.setAttribute('animation-mixer', 'clip: *')
        sidelvl2Counter++
    },

    tick() {
        const { el } = this
        const position = el.getAttribute('position')
        position.z += this.data.speed
        el.setAttribute('position', position)

        if (position.z > 26) {
            this.pool.returnEntity(el)
        }
    },
}

const sideElementsLvl3 = [
    { name: 'lvl3wmill1', model: 'lvl3wmill1' },
    { name: 'lvl3wmill2', model: 'lvl3wmill2' },
    { name: 'lvl3tree1', model: 'lvl3tree1' },
    { name: 'lvl3tree2', model: 'lvl3tree2' },
    { name: 'lvl3wmill1', model: 'lvl3wmill1' },
    { name: 'lvl3wmill2', model: 'lvl3wmill2' },
    { name: 'lvl3tree1', model: 'lvl3tree1' },
    { name: 'lvl3tree2', model: 'lvl3tree2' },
]

let sidelvl3Counter = 0
const sidelvl3Component = {
    schema: {
        speed: { default: 0.25 },
    },

    init() {
        const { el } = this
        this.pool = document.querySelector('#sideEleGenlvl3').components.pool__sidelvl3s

        el.id = sideElementsLvl3[sidelvl3Counter].name
        el.setAttribute('gltf-model', `#${sideElementsLvl3[sidelvl3Counter].model}`)
        el.setAttribute('scale', '10 10 12')
        el.setAttribute('animation-mixer', 'clip: *')
        sidelvl3Counter++
    },

    tick() {
        const { el } = this
        const position = el.getAttribute('position')
        position.z += this.data.speed
        el.setAttribute('position', position)

        if (position.z > 26) {
            this.pool.returnEntity(el)
        }
    },
}

const sideElementsLvl4 = [
    { name: 'lvl4build1', model: 'lvl4build1' },
    { name: 'lvl4build1', model: 'lvl4build1' },
    { name: 'lvl4build2', model: 'lvl4build2' },
    { name: 'lvl4build2', model: 'lvl4build2' },
    { name: 'lvl4build3', model: 'lvl4build3' },
    { name: 'lvl4build3', model: 'lvl4build3' },
]

let sidelvl4Counter = 0
const sidelvl4Component = {
    schema: {
        speed: { default: 0.25 },
    },

    init() {
        const { el } = this
        this.pool = document.querySelector('#sideEleGenlvl4').components.pool__sidelvl4s

        el.id = sideElementsLvl4[sidelvl4Counter].name
        el.setAttribute('gltf-model', `#${sideElementsLvl4[sidelvl4Counter].model}`)
        el.setAttribute('scale', '10 10 12')
        // el.setAttribute('animation-mixer', 'clip: *')
        sidelvl4Counter++
    },

    tick() {
        const { el } = this
        const position = el.getAttribute('position')
        position.z += this.data.speed
        el.setAttribute('position', position)

        if (position.z > 26) {
            this.pool.returnEntity(el)
        }
    },
}

// const sideElementsRt = [
//   {name: 'lvl1tower', model: 'lvl1tower'},
//   {name: 'lvl1gw', model: 'lvl1gw'},
//   {name: 'lvl1tree', model: 'lvl1tree'},
// ]
// let sidertCounter = 0
// const sideRtComponent = {
//   schema: {
//     speed: {default: 0.08},
//   },

//   init() {
//     const {el} = this
//     this.pool = document.querySelector('#eleGen').components.pool__tokele

//     el.id = sideElementsRt[sidertCounter].name
//     el.setAttribute('rotation', '0 180 0')
//     el.setAttribute('gltf-model', `#${sideElementsRt[sidertCounter].model}`)
//     el.setAttribute('scale', '10 10 12')
//     el.setAttribute('animation-mixer', 'clip: *')
//     sidertCounter++
//   },

//   tick() {
//     const {el} = this
//     const position = el.getAttribute('position')
//     position.z += this.data.speed
//     el.setAttribute('position', position)
//   },
// }

export {
    elementComponent, powerComponent, pointComponent,
    sideEleComponent, sidelvl2Component, sidelvl3Component, sidelvl4Component,
}
