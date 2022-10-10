import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import {
	ROUTE_404,
	ROUTE_BUCKETS,
	ROUTE_SIGNUP,
	ROUTE_LOGIN,
	ROUTE_OBJECTS,
	ROUTE_SCHEMAS,
	ROOT_INITIALIZE_FROM_CACHE,
	ROOT_RESET,
	ROUTE_BUY_ALIAS,
} from "./utils/constants"
import "./App.css"
import "./index.css"
import PrivateRoute from "./components/PrivateRoute"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import LayoutBase from "./components/LayoutBase"
import NotFound from "./pages/NotFound"
import Schemas from "./pages/Schemas"
import Objects from "./pages/Objects"
import Buckets from "./pages/Buckets"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import ErrorBoundary from "./components/ErrorBoundary"
import { isLoggedInServer } from "./utils/checkLogin"
import { selectSchemasError } from "./redux/slices/schemasSlice"
import { selectObjectsError } from "./redux/slices/objectsSlice"
import { selectBucketsError } from "./redux/slices/bucketSlice"
import ProfileCreation from "./pages/AliasCreation"

function App() {
	const schemasSliceError = useSelector(selectSchemasError)
	const objectsSliceError = useSelector(selectObjectsError)
	const bucketsSliceError = useSelector(selectBucketsError)

	const dispatch = useDispatch()
	const [loading, setLoading] = useState(true)

	async function fetchAccountInfo() {
		const isLogged = await isLoggedInServer()
		if (isLogged) {
			dispatch({ type: ROOT_INITIALIZE_FROM_CACHE })
		} else {
			dispatch({ type: ROOT_RESET })
		}
		setLoading(false)
	}

	useEffect(() => {
		fetchAccountInfo()
	}, [schemasSliceError, objectsSliceError, bucketsSliceError])

	if (loading) return null

	return (
		<BrowserRouter>
			<LayoutBase>
				<ErrorBoundary>
					<Routes>
						<Route path={ROUTE_SIGNUP} element={<Signup />} />
						<Route path={ROUTE_LOGIN} element={<Login />} />
						<Route path={ROUTE_BUY_ALIAS} element={<ProfileCreation />} />
						<Route
							path={ROUTE_SCHEMAS}
							element={<PrivateRoute Component={Schemas} />}
						/>
						<Route
							path={ROUTE_OBJECTS}
							element={<PrivateRoute Component={Objects} />}
						/>
						<Route
							path={ROUTE_BUCKETS}
							element={<PrivateRoute Component={Buckets} />}
						/>
						<Route path={ROUTE_404} element={<NotFound />} />
						<Route path="*" element={<Navigate to="/404" replace />} />
					</Routes>
				</ErrorBoundary>
			</LayoutBase>
		</BrowserRouter>
	)
}

export default App
