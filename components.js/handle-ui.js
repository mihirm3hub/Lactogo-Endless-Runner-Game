import { gaEvent } from '../firebase'
import { sharedToAnalytics, uuidv4, submitScoreDetailsAndAnalytics } from '../apiUtils'
const isLoggedIn = () => {
    if (localStorage.getItem('CIAM_UID') && localStorage.getItem('isLoggedIn') === 'YES') {
        return 'YES'
    } else {
        return 'NO'
    }
}
const isRestarted = () => localStorage.getItem('is-restarted')
// console.log(isLoggedIn)

const createAnchorWithParentTarget = (url, text) => {
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.target = '_parent'
    anchor.textContent = text  // Optional: Set the text of the link
    anchor.click()
}

const shareOnSocialMedia = (platform, score) => {
    // gaEvent('Total Shares', '');
    // gaEvent(platform, '');
    console.log('Sharing:', platform, score)
    const shareText = `LactoGo skor saya ${score}. Ayo mainkan sekarang dan share skor tertinggimu`
    const shareUrl = 'https://lactoclub.co.id/lactogo'
    let shareLink = ''

    sharedToAnalytics(platform)

    switch (platform) {
        case 'facebook':
            shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`
            break
        case 'whatsapp':
            shareLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`
            break
        case 'twitter':
            shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`
            break
        // case 'youtube':
        //   shareLink = `https://www.youtube.com/share?url=${encodeURIComponent(shareUrl)}`
        //   break
        default:
            break
    }

    if (shareLink) {
        window.open(shareLink, '_blank')
    }
}

const handleUIComponent = {

    init() {
        const readMoreButton = document.getElementById('readMoreButton')
        const skipButton = document.getElementById('skipButton')
        const acceptButton = document.getElementById('acceptButton')
        const startButton = document.getElementById('startButton')
        const helpButton = document.getElementById('helpButton')
        const startScan = document.getElementById('startScanButton')
        const scoreButton = document.getElementById('scoreGame')
        const showButton = document.getElementById('showScore')

        const goBtn = document.getElementById('goBtn')
        const gameButton = document.getElementById('startGame')
        const slide1 = document.querySelector('.instructions1')
        const slide2 = document.querySelector('.instructions2')
        const instructionScreen = document.getElementById('instructionScreen')
        const scanInfo = document.getElementById('scanInfo')
        const scnImg = document.getElementById('scnImg')
        const scanPageSection = document.getElementById('scanPage')
        const startScreen = document.getElementById('startScreen')
        const gameScreen = document.getElementById('gameScreen')
        const errorScreen = document.getElementById('errorScreen')
        const scoreScreen = document.getElementById('scoreScreen')
        // const congratsScreen = document.getElementById('congratsScreen')

        const agreeCheckbox = document.getElementById('agreeCheckbox')
        const agreeCheckbox2 = document.getElementById('agreeCheckbox2')
        const agreeLabel = document.getElementById('agreeLabel')
        const agreeLabel2 = document.getElementById('agreeLabel2')
        const btns = document.querySelectorAll('.modal-button')

        const playAgainBtn = document.getElementById('playAgainBtn')
        const congratsButton2 = document.getElementById('congratsButton2')

        const sharingSocial = ['facebook', 'whatsapp', 'twitter']
        const leaderBoardBtn = document.getElementById('leaderBoardBtn')

        const scoreScreenBlue = document.getElementById('scoreScreenBlue')

        if (isLoggedIn() === 'YES') {
            playAgainBtn.style.display = 'block'
        } else {
            playAgainBtn.style.display = 'none'
        }
        if (isRestarted() === 'YES') {
            instructionScreen.style.display = 'none'
            scanInfo.style.display = 'none'
        } else {
            console.log('is new', isRestarted())
        }
        sharingSocial.forEach((social) => {
            document.getElementById(`${social}-share`).addEventListener('click', (e) => {
                // gaEvent('Button Selanjutnya Cara Bermain', 'Selanjutnya Cara Bermain')
                const platform = social
                const finalScore = document.getElementById('finalScore').innerText
                shareOnSocialMedia(platform, finalScore)
            })
        })

        // congratsButton2.addEventListener('click', () => {
        //   congratsScreen.style.display = 'none'
        //   scoreScreen.style.display = 'flex'
        // })
        readMoreButton.addEventListener('click', () => {
            gaEvent('Button Selanjutnya Cara Bermain', 'Selanjutnya Cara Bermain')
            setTimeout(() => {
                // sound.play()
                slide1.style.display = 'none'
                readMoreButton.style.display = 'none'
                slide2.style.display = 'flex'
                readMoreButton.removeEventListener('click', null)
                slide1.remove()
            }, 750)
        })
        // end
        acceptButton.addEventListener('click', () => {
            gaEvent('Button Selanjutnya Cara Dapat Point', 'Selanjutnya Cara Dapat Point')

            setTimeout(() => {
                instructionScreen.style.display = 'none'

                // scanPageSection.style.display = 'flex'
                //  startScreen.style.display = 'flex'
                scanInfo.style.display = 'flex'
                acceptButton.removeEventListener('click', null)
                instructionScreen.remove()
            }, 750)
        })

        // end
        startButton.addEventListener('click', () => {
            gaEvent('Button Scan lagi di Pop Tidak Bisa Scan', 'Scan lagi di Pop Tidak Bisa Scan')
            scanPageSection.style.display = 'none'
            startScreen.style.display = 'flex'
            // startButton.removeEventListener('click', null)
            // scanPageSection.remove()
            setTimeout(() => {
                if (window.getComputedStyle(scnImg).display === 'block') {
                    scanPageSection.style.display = 'flex'
                }
            }, 20000)
        })

        helpButton.addEventListener('click', () => {
            gaEvent('Button Butuh Bantuan di Pop Tidak Bisa Scan', 'Button Butuh Bantuan di Pop Tidak Bisa Scan')
            setTimeout(() => {
                //   sound.play()
                scanPageSection.style.display = 'none'
                startScreen.style.display = 'none'
                instructionScreen.remove()
                scanInfo.style.display = 'flex'
            }, 750)
            // console.log(window.getComputedStyle(scnImg).display)
            // setTimeout(() => {
            //   if (window.getComputedStyle(scnImg).display === 'block') {
            //     scanPageSection.style.display = 'flex'
            //   }
            // }, 20000)

            // Butuh bantuan? need help button
            // helpButton.removeEventListener('click', null)
        })

        skipButton.addEventListener('click', () => {
            gaEvent('Button Skip Cara Bermain', 'Skip Cara Bermain')

            setTimeout(() => {
                instructionScreen.style.display = 'none'
                instructionScreen.remove()
                scanInfo.style.display = 'flex'

                skipButton.removeEventListener('click', null)
                instructionScreen.remove()
            }, 750)
            // console.log(window.getComputedStyle(scnImg).display)
        })
        // end
        startScan.addEventListener('click', () => {
            if (agreeCheckbox.checked && agreeCheckbox2.checked) {
                agreeLabel.classList.add('text-white')
                agreeLabel2.classList.add('text-white')
                scanInfo.style.display = 'none'

                startScreen.style.display = 'flex'
                startScan.removeEventListener('click', null)
                // scanInfo.remove()
                // scanPageSection.style.display = 'flex'
            } else {
                if (!agreeCheckbox.checked) {
                    agreeLabel.classList.remove('text-white')
                    agreeLabel.classList.add('text-orange')
                } else {
                    agreeLabel.classList.add('text-white')
                    agreeLabel.classList.remove('text-orange')
                }

                if (!agreeCheckbox2.checked) {
                    agreeLabel2.classList.remove('text-white')
                    agreeLabel2.classList.add('text-orange')
                } else {
                    agreeLabel2.classList.add('text-white')
                    agreeLabel2.classList.remove('text-orange')
                }
            }
            setTimeout(() => {
                if (window.getComputedStyle(scnImg).display === 'block') {
                    scanPageSection.style.display = 'flex'
                }
            }, 20000)
        })
        // startButton.addEventListener('click', () => {
        //   scanPageSection.style.display = 'none'
        //   startScreen.style.display = 'flex'
        // })
        // scoreButton.addEventListener('click', () => {
        //   gameScreen.style.display = 'none'
        //   scoreScreen.style.display = 'flex'
        // })
        showButton.addEventListener('click', () => {
            //  scoreScreen.style.display = 'none'
            gaEvent('Button Masuk Sekarang', 'Masuk Sekarang')
            // This is login btn it will redirect screen to Login screen
            // save all the details before re-direct

            localStorage.setItem('LACTO_GO_LOGIN_ATTEMPT', 'YES')
            // alert('https://www.development-q5nzhaa-eppsd3unwzeiy.au.platformsh.site/lactogo/login')
            createAnchorWithParentTarget('https://www.lactoclub.co.id/lactogo/login?utm_source=Web_Tools&utm_medium=CTAMedium_Masuk&utm_campaign=LACTOCLUBLactogo')

            showButton.removeEventListener('click', null)

            // scoreScreenBlue.style.display = 'flex'
        })
        gameButton.addEventListener('click', () => {
            gaEvent('Button Lacto Go Mulai Game', 'Lacto Go Mulai Game')
            //  setTimeout(() => {
            // startScreen.style.display = 'none'
            // gameScreen.style.display = 'flex'
            // const v1 = document.querySelector('#laser-video')
            //  const v2 = document.querySelector('#pattern-video')
            // v1.play()
            // v2.play()
            gameButton.removeEventListener('click', null)
            //  }, 750)
        })

        // social media icons are set by <a></a> tag
        // find them by their resceptive name ex: facebook in body.html
        leaderBoardBtn.addEventListener('click', () => {
            // Daftar/ leaderBoards click function goes here
            gaEvent('Button Daftar', 'Daftar')
            // This is login btn it will redirect screen to Login screen
            // save all the details before re-direct
            localStorage.setItem('LACTO_GO_REGISTER_ATTEMPT', true)
            createAnchorWithParentTarget('https://www.lactoclub.co.id/join-now?utm_source=Web_Tools&utm_medium=CTAMedium_Register&utm_campaign=LACTOCLUBLactogo')

            showButton.removeEventListener('click', null)
        })

        playAgainBtn.addEventListener('click', () => {
            // Main Lagi/ reload game click function goes here
            gaEvent('Button Main Lagi', 'Main Lagi')
            localStorage.setItem('is-restarted', 'YES')
            window.location.reload()
        })

        function toggleLoading(type) {
            const loader = document.getElementById('progressLoader')
            const loaderImage = loader.querySelector('img')

            if (type === 'show') {
                // Show the loader
                loaderImage.style.display = 'block'
                loader.style.width = '100vw'  // Adjust width
                loader.style.height = '100vh'  // Adjust height
            } else {
                // Hide the loader
                loaderImage.style.display = 'none'
                loader.style.width = '0'  // Adjust width
                loader.style.height = '0'  // Adjust height
            }
        }

        async function sendLactoGoData(score) {
            try {
                toggleLoading('show')
                const url = 'https://www.lactoclub.co.id/lactogo/api/send-point'

                const headers = {
                    'Content-Type': 'application/json',
                }
                const lactoPoints = Number(score) == 0 ? Number(score) : ((5 / 100) * (Number(score)))
                const data = {
                    'ciam_uid': localStorage.getItem('CIAM_UID'),
                    'score': Number(score) || 0,
                    'point': Number(lactoPoints),
                    'description': `Anda mendapatkan ${lactoPoints} point LactoGo`,
                }
                const response = await window.axios.post(url, data, { headers })
                toggleLoading('hide')
                return response.status
            } catch (error) {
                toggleLoading('hide')
                if (error.response) {
                    // alert(`Score: ${score} lacto: ${Number(score) == 0 ? Number(score) : ((3 / 100) * (Number(score)))}`)
                    // The request was made and the server responded with a status code
                    console.log('Response Data:', error.response.data)
                    console.log('Response Status:', error.response.status)
                } else if (error.request) {
                    // The request was made but no response was received
                    console.log('Request:', error.request)
                } else {
                    // Something happened in setting up the request that triggered an error
                    console.error('Error:', error.message)
                }
                return error.response.status
            }
        }

        let modal
        btns.forEach((btn) => {
            // console.log(btns, btn)
            btn.addEventListener('click', async (e) => {
                console.log(e.target.id)
                e.preventDefault()
                // console.log(e.target)
                const targetModalId = e.target.getAttribute('data-target')
                if (e.target.id === 'playAgainBtn') {
                    console.log('playagain clicked')
                    if (isLoggedIn() === 'YES') {
                        gaEvent('Button Main Lagi', 'Main Lagi')
                    }
                }
                if (e.target.id === 'shareScoreBtn') {
                    console.log('share score clicked')
                    modal = document.getElementById(targetModalId)
                    if (modal) {
                        modal.classList.add('show-modal')
                    }
                    if (isLoggedIn() === 'YES') {
                        gaEvent('Button Bagikan Skor', 'Bagikan Skor')
                    } else {
                        gaEvent('Button Bagikan Skor Not Logged', 'Bagikan Skor Not Logged')
                    }
                }
                if (e.target.id === 'subScoreBtn') {
                    console.log('submit score clicked')
                    //   alert(`Is logged In:${isLoggedIn()}`)

                    if (isLoggedIn() === 'YES') {
                        const finalScore = document.getElementById('finalScore').innerText
                        const response = await sendLactoGoData(finalScore)
                        modal = document.getElementById('myModal3')
                        if (response == '404') {
                            modal = document.getElementById('failedPoinMessage')
                        } else if (response == '401') {
                            modal = document.getElementById('unauthorizedMessage')
                        } else if (response == '400') {
                            modal = document.getElementById('failedtThreePoinMessage')
                        }
                        // only on successfull login
                        document.getElementById('subScoreBtn').style.display = 'none'

                        const savedScore = JSON.parse(localStorage.getItem('SAVED_SCORE_ANALYTICS'))
                        if (savedScore) {
                            const {
                                scoreCount,
                                distance,
                                tokenCount,
                                timeCount,
                                startTime,
                                currentTime,
                                level,
                                countSheild,

                                countBoost,

                                countFocus,

                                countProtein,

                                countDomino,
                            } = savedScore
                            submitScoreDetailsAndAnalytics(
                                scoreCount,
                                distance,
                                tokenCount,
                                timeCount,
                                startTime,
                                currentTime,
                                Number(level),
                                countSheild,

                                countBoost,

                                countFocus,

                                countProtein,

                                countDomino
                            )
                        }

                        if (modal) {
                            modal.classList.add('show-modal')
                            gaEvent('PopUp Submitted Screen', 'Submitted Screen')
                        }
                        gaEvent('Button Masukan Skor', 'Masukan Skor')
                    } else {
                        modal = document.getElementById('myModal2')
                        if (modal) {
                            modal.classList.add('show-modal')
                        }
                        gaEvent('Button Masukan Skor Not Logged', 'Masukan Skor Not Logged')
                    }
                }
                //  modal = document.getElementById(targetModalId)
                // // console.log(modal, targetModalId)

                // if (modal) {
                //   modal.classList.add('show-modal')
                // }
            })
        })
        const modals = document.querySelectorAll('.goModal')
        modals.forEach((modalel) => {
            const closeBtn = modalel.querySelector('.close')
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    modalel.classList.remove('show-modal')
                    closeBtn.removeEventListener('click', null)
                })
            }
            if (showButton) {
                showButton.addEventListener('click', () => {
                    modalel.classList.remove('show-modal')
                    showButton.removeEventListener('click', null)
                })
            }
        })

        const errBtns = document.querySelectorAll('.err-modal-button')
        const errModals = document.querySelectorAll('.err-modal')

        errBtns.forEach((btn) => {
            // console.log(btns, btn)
            btn.addEventListener('click', (e) => {
                e.preventDefault()
                // console.log(e.target)
                const targetModalId = e.target.getAttribute('data-target')
                const errModal = document.getElementById(targetModalId)
                // console.log(modal, targetModalId)
                if (errModal) {
                    errModal.classList.add('show-modal')
                }
            })
        })

        errModals.forEach((errmodal) => {
            const closeBtn = errmodal.querySelector('.close')
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    errmodal.classList.remove('show-modal')
                })
            }
            if (showButton) {
                showButton.addEventListener('click', () => {
                    errmodal.classList.remove('show-modal')
                })
            }
        })
    },
}

export { handleUIComponent }
