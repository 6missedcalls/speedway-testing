const APP_STATE = "SonrSpeedwayState"

export function localStoreSaveJson(key: string, json: any) {
	window.localStorage.setItem(key, JSON.stringify(json))
}

export function localStoreGetJson(key: string) {
	try {
		const json = window.localStorage.getItem(key) as string
		return JSON.parse(json)
	} catch (err) {
		console.log("Error parsing JSON at localStoreGetJson function.", err)
		return {}
	}
}

export function syncAppStateToLocalCache(state: any) {
	localStoreSaveJson(APP_STATE, state)
}

export function getAppStateFromLocalCache(): any {
	return localStoreGetJson(APP_STATE)
}
