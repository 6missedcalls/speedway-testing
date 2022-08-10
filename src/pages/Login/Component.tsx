import AuthLayout from "../../components/AuthLayout"

type Props = {
	navigate: (page: string) => void
}
export default ({ navigate }: Props) => {
	return (
		<AuthLayout
			sidebarContent={
				<div className="text-right">
					<button
						onClick={() => navigate("/")}
						className="text-white border rounded"
					>
						Go to Registration
					</button>
				</div>
			}
			content={<div>login content</div>}
		/>
	)
}
