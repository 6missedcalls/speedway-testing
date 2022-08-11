import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import {
	ROUTE_404,
	ROUTE_ACCESS_API,
	ROUTE_BLOCK_EXPLORER,
	ROUTE_BUCKETS,
	ROUTE_DASHBOARD,
	ROUTE_DID_UTILITY,
	ROUTE_DOCS_AND_SUPPORT,
	ROUTE_SIGNUP,
	ROUTE_LOGIN,
	ROUTE_OBJECTS,
	ROUTE_SCHEMAS,
} from "./utils/constants"
import "./App.css"
import "./index.css"
import PrivateRoute from "./components/PrivateRoute"
import Dashboard from "./pages/Dashboard"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import BaseLayout from "./components/BaseLayout"
import NotFound from "./pages/NotFound"
import Schemas from "./pages/Schemas"
import Objects from "./pages/Objects"
import Buckets from "./pages/Buckets"
import AccessApi from "./pages/AccessApi"
import DidUtility from "./pages/DidUtility"
import DocsAndSupport from "./pages/DocsAndSupport"
import BlockExplorer from "./pages/BlockExplorer"

function App() {
	return (
		<BrowserRouter>
			<BaseLayout>
				<Routes>
					<Route path={ROUTE_SIGNUP} element={<Signup />} />
					<Route path={ROUTE_LOGIN} element={<Login />} />
					<Route path={ROUTE_DOCS_AND_SUPPORT} element={<DocsAndSupport />} />
					<Route
						path={ROUTE_DASHBOARD}
						element={<PrivateRoute Component={Dashboard} />}
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
					<Route
						path={ROUTE_ACCESS_API}
						element={<PrivateRoute Component={AccessApi} />}
					/>
					<Route
						path={ROUTE_DID_UTILITY}
						element={<PrivateRoute Component={DidUtility} />}
					/>
					<Route
						path={ROUTE_BLOCK_EXPLORER}
						element={<PrivateRoute Component={BlockExplorer} />}
					/>
					<Route path={ROUTE_404} element={<NotFound />} />
					<Route path="*" element={<Navigate to="/404" replace />} />
				</Routes>
			</BaseLayout>
		</BrowserRouter>
	)
}

export default App
