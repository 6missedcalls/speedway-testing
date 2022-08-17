import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import {
	ROUTE_404,
	ROUTE_BUCKETS,
	ROUTE_SIGNUP,
	ROUTE_LOGIN,
	ROUTE_OBJECTS,
	ROUTE_SCHEMAS,
	ROUTE_POST_SIGNUP,
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
import PostSignup from "./pages/PostSignup"

function App() {
	return (
		<BrowserRouter>
			<LayoutBase>
				<Routes>
					<Route path={ROUTE_SIGNUP} element={<Signup />} />
					<Route path={ROUTE_LOGIN} element={<Login />} />
					<Route
						path={ROUTE_POST_SIGNUP}
						element={<PrivateRoute Component={PostSignup} />}
					/>
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
			</LayoutBase>
		</BrowserRouter>
	)
}

export default App
