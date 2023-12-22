const handleCharComponent = {
    schema: {
        position: {
            type: 'string',
            default: 'middle',
        },
        animationClips: {
            type: 'array',
            default: [],
        },
    },
    init() {
        this.left = -0.18
        this.middle = 0
        this.right = 0.18

        const jumpSound = new window.Howl({
            src: [require('../assets/sfx/Jump_Main__SFX.mp3')],
            volume: 0.7,
        })

        const controlBtns = document.querySelectorAll('.controlBtn')
        const up = document.getElementById('up')
        const model = document.getElementById('char-model')

        model.object3D.position.set(this[this.data.position], 0.01, 0.8)
        let n = !0
        this.moveNextPosition = function (e) {
            n = !1
            this.el.setAttribute('handle-char', {
                position: e,
            })
            model.setAttribute('animation__move', {
                property: 'position',
                to: ''.concat(this[e], ' ').concat(0, ' ').concat(0.8),
                easing: 'linear',
                dur: 150,
            })
        }

        model.addEventListener('animationcomplete__move', () => {
            n = !0
            model.removeAttribute('animation__move')
            model.removeEventListener('animationcomplete__move', null)
        })
        let isJumping = false

        const jumpControl = () => {
            const animationMixer = model.getAttribute('animation-mixer')
            if (animationMixer.clip === 'run') {
                this.timeScale = animationMixer.timeScale
                //  console.log(this.timeScale)
            }

            if (!isJumping) {
                isJumping = true
                if (!jumpSound.playing()) {
                    console.log('audio is currently playing...')
                    jumpSound.play()
                }
                model.removeAttribute('animation-mixer')

                model.setAttribute('animation-mixer', {
                    clip: 'high_jump',
                })
                document.getElementById('targetBox').removeAttribute('animation', '')
                document.getElementById('targetBox').setAttribute('animation', {
                    property: 'position',
                    to: '0 1.7 0',
                    dir: 'alternate',
                    easing: 'linear',
                    delay: '400',
                    dur: 560,
                })
                setTimeout(() => {
                    document.getElementById('targetBox').removeAttribute('animation', '')
                    document.getElementById('targetBox').setAttribute('animation', {
                        property: 'position',
                        to: '0 0.8 0',
                        dir: 'alternate',
                        easing: 'linear',
                        dur: 100,
                    })
                }, 580)

                model.addEventListener('animation-loop', () => {
                    model.setAttribute('animation-mixer', {
                        clip: 'run',
                        crossFadeDuration: 0.4,
                        timeScale: this.timeScale,
                    })
                    isJumping = false
                    model.removeEventListener('animation-loop', null)
                })
            }
        }

        controlBtns.forEach((ele) => {
            const setPos = (e) => {
                if (e.target.parentNode.id === 'left') {
                    if (this.data.position !== 'left' && n) {
                        const pos = this.data.position === 'middle' ? 'left' : 'middle'
                        //  console.log(pos)
                        this.moveNextPosition(pos)
                    }
                } else if (e.target.parentNode.id === 'right') {
                    if (this.data.position !== 'right' && n) {
                        const pos = this.data.position === 'middle' ? 'right' : 'middle'
                        //   console.log(pos)
                        this.moveNextPosition(pos)
                    }
                } else if (e.target.parentNode.id === 'up') {
                    console.log('click jump')
                    jumpControl()
                }
            }
            ele.addEventListener('click', setPos)
        })

        // // Define variables
        // let xDown = null
        // let yDown = null

        // // Function to handle touchstart event
        // function handleTouchStart(evt) {
        //   // Get the x and y coordinates of the touch event
        //   xDown = evt.touches[0].clientX
        //   yDown = evt.touches[0].clientY
        // }

        // let isJumping = false
        // // Function to handle touchmove event
        // function handleTouchMove(evt) {
        //   const animationMixer = model.getAttribute('animation-mixer')
        //   if (animationMixer.clip === 'run') {
        //     this.timeScale = animationMixer.timeScale
        //   //  console.log(this.timeScale)
        //   }

        //   // const animationMixer = model.getAttribute('animation-mixer')
        //   // if (animationMixer.clip === 'run') {
        //   //   console.log(animationMixer, animationMixer.timeScale)
        //   // }
        //   // Check if the x and y coordinates of the touch event have changed
        //   if (xDown !== null && yDown !== null) {
        //     // Get the x and y coordinates of the touch event
        //     const xUp = evt.touches[0].clientX
        //     const yUp = evt.touches[0].clientY

        //     // Calculate the difference between the x and y coordinates of the two touch events
        //     const xDiff = xDown - xUp
        //     const yDiff = yDown - yUp

        //     // Check if the swipe was upwards
        //     if (yDiff > 0) {
        //       // Swipe up detected
        //       // Do something here
        //       if (!isJumping) {
        //         isJumping = true
        //         if (!jumpSound.playing()) {
        //           console.log('audio is currently playing...')
        //           jumpSound.play()
        //         }
        //         model.removeAttribute('animation-mixer')

        //         model.setAttribute('animation-mixer', {
        //           clip: 'high_jump',
        //         })
        //         document.getElementById('targetBox').removeAttribute('animation', '')
        //         document.getElementById('targetBox').setAttribute('animation', {
        //           property: 'position',
        //           to: '0 1.7 0',
        //           dir: 'alternate',
        //           easing: 'linear',
        //           delay: '400',
        //           dur: 560,
        //         })
        //         setTimeout(() => {
        //           document.getElementById('targetBox').removeAttribute('animation', '')
        //           document.getElementById('targetBox').setAttribute('animation', {
        //             property: 'position',
        //             to: '0 0.8 0',
        //             dir: 'alternate',
        //             easing: 'linear',
        //             dur: 100,
        //           })
        //         }, 580)

        //         model.addEventListener('animation-loop', () => {
        //           model.setAttribute('animation-mixer', {
        //             clip: 'run',
        //             crossFadeDuration: 0.4,
        //             timeScale: this.timeScale,
        //           })
        //           isJumping = false
        //         })
        //       }
        //     }
        //   }
        // }
        // // Listener for touchstart event
        // document.addEventListener('touchstart', handleTouchStart, false)

        // // Listener for touchmove event
        // document.addEventListener('touchmove', handleTouchMove, false)
    },
}
export { handleCharComponent }
