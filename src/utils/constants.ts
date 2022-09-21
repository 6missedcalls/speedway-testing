export const ROUTE_LOGIN = "/"
export const ROUTE_SIGNUP = "/signup"
export const ROUTE_BUY_ALIAS = "/buy-alias"
export const ROUTE_SCHEMAS = "/schema"
export const ROUTE_OBJECTS = "/objects"
export const ROUTE_BUCKETS = "/buckets"
export const ROUTE_404 = "/404"

// app modal context
export const SET_MODAL_CONTENT = "SET_MODAL_CONTENT"
export const OPEN_MODAL = "OPEN_MODAL"
export const CLOSE_MODAL = "CLOSE_MODAL"
export const MODAL_CONTENT_NEW_SCHEMA = "MODAL_CONTENT_NEW_SCHEMA"
export const MODAL_CONTENT_NEW_BUCKET = "MODAL_CONTENT_NEW_BUCKET"
export const MODAL_CONTENT_NEW_OBJECT = "MODAL_CONTENT_NEW_OBJECT"

// app settings context
export const SET_MENU_IS_COLLAPSED = "SET_MENU_IS_COLLAPSED"

// custom redux actions
export const ROOT_INITIALIZE_FROM_CACHE = "root/initializeFromCache"
export const ROOT_RESET = "root/reset"

export const BASE_API = `${
	process.env.REACT_APP_DEV_MODE === "true"
		? `http://localhost:${process.env.REACT_APP_SERVER_PORT || 3001}`
		: ""
}`
