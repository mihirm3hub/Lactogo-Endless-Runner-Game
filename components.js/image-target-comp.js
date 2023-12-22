import { gaEvent } from '../firebase'

const configTargetsComponent = {
    schema: {
        targets: { type: 'array', default: [''] },
    },
    ensureImageTargetsConfigured() {
        if (this.configured || !this.configOk) {
            return
        }
        console.log(`Scanning for targets: ${JSON.stringify(this.data.targets)}`)
        XR8.XrController.configure({ imageTargets: this.data.targets })
        this.configured = true
    },
    init() {
        this.configured = false
        this.configOk = false
        this.el.sceneEl.addEventListener('realityready', () => {
            this.configOk = true
            this.ensureImageTargetsConfigured()
            this.el.sceneEl.removeEventListener('realityready', null)
        })
    },
    update() {
        this.configured = false
        this.ensureImageTargetsConfigured()
    },
}

const imageTargetComponent = () => ({
    schema: {
        name: { type: 'string' },
    },
    init() {
        const scene = this.el.sceneEl
        const { object3D } = this.el
        const { name } = this.data
        object3D.visible = true
        let contentSet = false

        const showImage = ({ detail }) => {
            if (name !== detail.name) {
                return
            }
            object3D.position.copy(detail.position)
            object3D.quaternion.copy(detail.rotation)
            object3D.scale.set(detail.scale, detail.scale, detail.scale)
            object3D.visible = true
        }
        const imageFound = (e) => {
            if (!contentSet) {
                contentSet = true
                console.log('img target found')
                gaEvent('AR Game Sukses Tampil', 'AR Game Sukses Tampil')
                showImage(e)
                const model = document.getElementById('simpleGame')
                model.setAttribute('animation__grow', {
                    property: 'scale',
                    to: '.1 .1 .1',
                    easing: 'easeOutQuad',
                    dur: 1500,
                })
                document.getElementById('scnImg').classList.add('fade-out')
                document.getElementById('goBtn').style.display = 'block'
                document.getElementById('goBtn').classList.add('fade-in')
                setTimeout(() => {
                    document.getElementById('scnImg').style.display = 'none'
                }, 900)
                scene.removeAttribute('config-targets')
            }
        }
        const imageLost = (e) => {
            //   object3D.visible = false
        }
        this.el.sceneEl.addEventListener('xrimagefound', imageFound)
        this.el.sceneEl.addEventListener('xrimageupdated', showImage)
        this.el.sceneEl.addEventListener('xrimagelost', imageLost)
    },
})
export { imageTargetComponent, configTargetsComponent }

// const modelSpawnComponent = {
//   init() {
//     // const model = document.getElementById('model')
//     const scene = this.el.sceneEl
//     const {object3D} = this.el
//     let found = false

//     const showImage = ({detail}) => {
//       // if (name !== detail.name) {
//       //   return
//       // }
//       object3D.position.copy(detail.position)
//       object3D.quaternion.copy(detail.rotation)
//       object3D.scale.set(detail.scale, detail.scale, detail.scale)
//       object3D.visible = true
//     }
//     const showObject = ({detail}) => {
//       console.log('image-found')
//       const absPos = new THREE.Vector3().copy(
//         detail.position
//       )

//       object3D.position.copy(detail.position)
//       object3D.quaternion.copy(detail.rotation)
//       object3D.scale.set(detail.scale, detail.scale, detail.scale)
//       object3D.visible = true
//     }

//     const imageFound = (e) => {
//       if (!found) {
//         showObject(e)

//         found = true
//       }
//     }
//     const imageLost = (e) => {
//       //   object3D.visible = false
//     }
//     this.el.sceneEl.addEventListener('xrimagefound', imageFound)
//     this.el.sceneEl.addEventListener('xrimageupdated', showObject)
//     this.el.sceneEl.addEventListener('xrimagelost', imageLost)
//   },
// }
// export {modelSpawnComponent}
