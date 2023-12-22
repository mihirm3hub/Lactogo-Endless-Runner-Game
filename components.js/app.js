// Copyright (c) 2022 8th Wall, Inc.
//
// app.js is the main entry point for your 8th Wall app. Code here will execute after head.html
// is loaded, and before body.html is loaded.

import './main.css'
import './index.css'

import {
    elementComponent, powerComponent, pointComponent,
    sideEleComponent, sidelvl2Component, sidelvl3Component, sidelvl4Component,
} from './gameEle'
// AFRAME.registerComponent('token', tokenComponent)
// AFRAME.registerComponent('powerup', powerupComponent)
AFRAME.registerComponent('element', elementComponent)
AFRAME.registerComponent('power', powerComponent)
AFRAME.registerComponent('point', pointComponent)
AFRAME.registerComponent('sideele', sideEleComponent)
AFRAME.registerComponent('sidelvl2', sidelvl2Component)
AFRAME.registerComponent('sidelvl3', sidelvl3Component)
AFRAME.registerComponent('sidelvl4', sidelvl4Component)

import { chromaKeyShader } from './components/chroma-key'
AFRAME.registerShader('chromakey', chromaKeyShader)

import { splashScreenComponent } from './components/splash-screen'
AFRAME.registerComponent('lg-splash-screen', splashScreenComponent)

import { handleUIComponent } from './components/handle-ui'
AFRAME.registerComponent('handle-ui', handleUIComponent)

import { handleCharComponent } from './components/handle-char'
AFRAME.registerComponent('handle-char', handleCharComponent)

import { animTexComponent } from './components/animate-texture'
AFRAME.registerComponent('animate-texture', animTexComponent)

import { gameComponent } from './components/game'
AFRAME.registerComponent('game', gameComponent)

import { imageTargetComponent, configTargetsComponent } from './components/image-target-comp'
AFRAME.registerComponent('image-target-comp', imageTargetComponent())
AFRAME.registerComponent('config-targets', configTargetsComponent)

// import {EnemyComponent, CoinComponent} from './components/game-components'
// AFRAME.registerComponent('simple-game-enemy', EnemyComponent)
// AFRAME.registerComponent('simple-game-coin', CoinComponent)
AFRAME.registerComponent('no-cull', {
    init() {
        this.el.addEventListener('model-loaded', () => {
            this.el.object3D.traverse(obj => obj.frustumCulled = false)
            //   this.el.setAttribute('model-relative-opacity', 'opacity:1')
            //   setTimeout(() => {
            //     this.el.setAttribute('animation', 'property: model-relative-opacity.opacity;from: 1; to: 0; dur: 100; loop:6; dir:alternate')
            //   }, 2500)
        })
    },
})

AFRAME.registerComponent('highlight-emission', {
    schema: {
        color: { default: '#000000' },
        intensity: { default: 5 },
    },

    init() {
        // Wait for the model to be loaded
        if (this.el.getObject3D('mesh')) {
            this.setup()
        } else {
            this.el.addEventListener('model-loaded', () => this.setup())
        }
    },

    setup() {
        // Reference to the mesh
        const mesh = this.el.getObject3D('mesh')

        this.originalMaterials = new Map()
        this.originalEmissive = new Map()

        mesh.traverse((node) => {
            if (node.material && node.material.isMeshStandardMaterial) {
                this.originalMaterials.set(node, node.material)
                this.originalEmissive.set(node, node.material.emissive.clone())
                node.material.emissive.set(this.data.color)
                node.material.emissiveIntensity = this.data.intensity
            }
        })
    },

    remove() {
        const mesh = this.el.getObject3D('mesh')
        if (!mesh) return

        mesh.traverse((node) => {
            if (node.material && node.material.isMeshStandardMaterial) {
                const originalMaterial = this.originalMaterials.get(node)
                if (originalMaterial) {
                    node.material = originalMaterial
                }
                const originalEmissive = this.originalEmissive.get(node)
                if (originalEmissive) {
                    node.material.emissive.copy(originalEmissive)
                }
            }
        })
    },
})
// AFRAME.registerComponent('auto-play-video', {
//   schema: {
//     video: {type: 'string'},
//   },
//   init() {
//     const v = document.querySelector(this.data.video)
//     v.play()
//   },
// })
// create loading screen
const avatar = require('./assets/textures/04_eyebrow_change_2.png')
const logo = require('./assets/uiAssets/images/goldLacto.png')
let inDom = false
const observer = new MutationObserver(() => {
    if (document.querySelector('#loadBackground')) {
        if (!inDom) {
            document.querySelector('#loadBackground').insertAdjacentHTML('beforeend', `
        <!-- Progress screen -->
        <!-- Progress screen Ends-->
        <div id="progressScreen" class="bg-progress">
          <div class="top-logo col-100">
            <img
              src="${logo}"
              class="wow animate__zoomIn"
              data-wow-duration="1000ms"
              data-wow-delay="100ms"
              width="216"
              height="156" />
          </div>
          <div class="bottom-avatar col-100">
            <img src="${avatar}" width="204" height="204" />
          </div>
          <div class="progressdiv col-100">
            <div class="progress progress-striped" id="progress-container">
              <div role="progressbar" class="progressbar" id="progress-bar"></div>
            </div>
            <h4 id="loading-text">Loading...</h4>
          </div>
        </div>
      `)
        }
        console.log('exec')
        //  function simulateLoading() {
        setTimeout(() => {
            const progressCont = document.getElementById('progressScreen')
            const progressBar = document.getElementById('progress-bar')
            const loadingText = document.getElementById('loading-text')
            const instructionScreen = document.getElementById('instructionScreen')

            let progress = 0
            const interval = setInterval(() => {
                progress += 1
                progressBar.style.width = `${progress}%`
                loadingText.innerHTML = `Loading ${progress}%`
                // console.log(progress)
                if (progress >= 100) {
                    clearInterval(interval)
                    progressCont.style.display = 'none'  // Hide the progress bar
                    instructionScreen.style.display = 'flex'
                }
            }, 70)  // Adjust the interval to control the loading speed
            //   }

            // simulateLoading()
        }, 300)
        inDom = true
    } else if (inDom) {
        inDom = false
        observer.disconnect()
    }
})
observer.observe(document.body, { childList: true })

// bitmaps cause texture issues on iOS this workaround prevents black textures and crashes
const IS_IOS =
    /^(iPad|iPhone|iPod)/.test(window.navigator.platform) ||
    (/^Mac/.test(window.navigator.platform) && window.navigator.maxTouchPoints > 1)
if (IS_IOS) {
    window.createImageBitmap = undefined
}
