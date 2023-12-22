import { gaEvent } from '../firebase'
import { uuidv4 } from '../apiUtils'
const splashScreenComponent = {
    schema: {
        disableWorldTracking: { type: 'bool', default: false },
        requestGyro: { type: 'bool', default: false },
    },
    init() {
        const scene = this.el.sceneEl
        const splashimage = document.getElementById('splashimage')
        const checkReturnUser = () => localStorage.getItem('LACTO_GO_LOGIN_ATTEMPT')
        const isLoggedIn = () => {
            if (localStorage.getItem('CIAM_UID') && localStorage.getItem('isLoggedIn') === 'YES') {
                return 'YES'
            } else {
                return 'NO'
            }
        }
        // splash-screen.js is added whenever the app starts
        const timer = setTimeout(() => {
            // if clearTimeout is not exec this will trigger after 60s
            console.log('exec ga event')
            gaEvent('Time Spend on the Splash Screen', '')
        }, 60000)

        const getUrlParameter = (paramName) => {
            const urlSearchParams = new URLSearchParams(window.location.search)
            return urlSearchParams.get(paramName)
        }

        const addXRWeb = () => {
            if (this.data.requestGyro === true && this.data.disableWorldTracking === true) {
                // If world tracking is disabled, and you still want gyro enabled (i.e. 3DoF mode)
                // Request motion and orientation sensor via XR8's permission API
                XR8.addCameraPipelineModule({
                    name: 'request-gyro',
                    requiredPermissions: () => ([XR8.XrPermissions.permissions().DEVICE_ORIENTATION]),
                })
            }
            this.el.sceneEl.setAttribute('xrweb', `allowedDevices: any; disableWorldTracking: ${this.data.disableWorldTracking}`)
            // Splash Screen is hidden here
            // we clear the timeout once splash screen is not visible and next screen is visible
            splashimage.classList.add('hidden')
            //      function clearTimer() {
            clearTimeout(timer)
            //    }
            // Play background music (mp3) after user has clicked "Start AR" and the scene has loaded.
            this.el.sceneEl.addEventListener('realityready', () => {
                setTimeout(() => {
                    new WOW({
                        animateClass: 'animate__animated',
                    }).init()
                }, 800)
                this.el.sceneEl.removeEventListener('realityready', null)
            })

            // alert(`CHECKING if returning:${checkReturnUser()}`)
            // check if the user is returnin user
            if (checkReturnUser() === 'YES') {
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

                localStorage.setItem('LACTO_GO_LOGIN_ATTEMPT', 'NO')
                document.getElementById('scoreScreen').style.display = 'flex'
                document.getElementById('scoreScreen').style.zIndex = '5'

                // set saved score values
                try {
                    const savedScore = JSON.parse(localStorage.getItem('SAVED_SCORE'))
                    if (savedScore) {
                        document.getElementById('finalScore').innerText = savedScore.scoreCount
                        document.getElementById('finalClubScore').innerText = savedScore.scorePercent

                        // SKOR ANDA stats display variables
                        document.getElementById('finalScore-count').innerText = savedScore.finalScoreCount
                        document.getElementById('distance-count').innerText = savedScore.distance
                        document.getElementById('time-count').innerText = savedScore.timeCount
                        document.getElementById('token-count').innerText = savedScore.tokenCount
                    }
                } catch (e) {
                    console.log('Unable to show saved score')
                }

                // check if the user is logged in
                if (isLoggedIn() === 'YES') {
                    document.getElementById('playAgainBtn').style.display = 'block'
                } else {
                    document.getElementById('playAgainBtn').style.display = 'none'
                }
            }
        }
        setTimeout(() => {
            // addXRWeb()
            scene.hasLoaded ? addXRWeb() : scene.addEventListener('loaded', addXRWeb)
        }, 1250)
    },
}
export { splashScreenComponent }
