const firebaseConfig = {
    apiKey: 'AIzaSyBWi-9ZWrAgKrg7GUuhi-po7qQhy2P5epc',
    authDomain: 'nestle-99603.firebaseapp.com',
    projectId: 'nestle-99603',
    storageBucket: 'nestle-99603.appspot.com',
    messagingSenderId: '474285654',
    appId: '1:474285654:web:8b546f15cc66ab4ff51df7',
    measurementId: 'G-TQB3ZZ7M7F',
}
const firebase = window.firebase.initializeApp(firebaseConfig)
// const app = firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics()

export const gaEvent = (eventName, category) => {
    analytics.logEvent(eventName, { name: category })
}
