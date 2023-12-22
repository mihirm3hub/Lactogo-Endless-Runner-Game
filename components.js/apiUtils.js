const baseURL = 'https://nestleapi.web-dimension.com/games'
export const uuidv4 = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0
        const v = c == 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })
export const submitScoreDetailsAndAnalytics = (
    scoreCount, distance, tokenCount,
    timeCount, startTime, endTime,
    level,
    countSheild,
    countBoost,
    countFocus,
    countProtein,
    countDomino
) => {
    const apiUrl = `${baseURL}/submit-score-details`
    console.log('Submit Score API CALLED --->', {
        scoreCount,
        distance,
        tokenCount,
        timeCount,
        startTime,
        endTime,
        countSheild,
        countBoost,
        countFocus,
        countProtein,
        countDomino,
    })
    const ciamUid = localStorage.getItem('CIAM_UID')
    const uuid = localStorage.getItem('UNIQUE_UID')
    const lactoPoints = scoreCount == 0 ? scoreCount : ((5 / 100) * (scoreCount))
    const requestBody = {
        ciam_uid: ciamUid || '',
        uuid,
        level,
        start_time: new Date(startTime).toISOString(),
        end_time: new Date(endTime).toISOString(),
        total_distance: distance || 0,
        score: scoreCount || 0,
        lacto_points: lactoPoints || 0,
        coins: tokenCount,
        dominos: countDomino,
        l_reuteri_boost: countBoost,
        omega_3_6: countSheild,
        vitamin_mineral: countFocus,
        high_protien: countProtein,
    }

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    }

    fetch(apiUrl, requestOptions)
        .then((response) => {
            if (response.ok) {
                return response.json()
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`)
            }
        })
        .then((data) => {
            console.log('API Response:', data)
            const gameID = data.data.game_id
            localStorage.setItem('game_id', gameID)
            console.log('Game ID:', gameID)
        })
        .catch((error) => {
            console.error('Error:', error)
        })
}

export const sharedToAnalytics = (
    platform
) => {
    const apiUrl = `${baseURL}/update-record`

    const ciamUid = localStorage.getItem('CIAM_UID')
    const uuid = localStorage.getItem('UNIQUE_UID')
    const gameid = localStorage.getItem('game_id')

    const requestBody = {
        ciam_uid: ciamUid || '',
        uuid,
        game_id: gameid || '',
        sharedTo: platform,
    }

    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    }

    fetch(apiUrl, requestOptions)
        .then((response) => {
            if (response.ok) {
                return true
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`)
            }
        })
        .then((data) => {
            console.log('API Response:', data)
            // Handle the response data as needed
        })
        .catch((error) => {
            console.error('Error:', error)
            // Handle any errors that occurred during the fetch
        })
}
