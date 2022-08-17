import { NebulaIcon } from "@sonr-io/nebula-react"
import React from "react"
import { listTypes } from "../../utils/types"
import Headers from "./components/Headers"

interface SearchableListComponentProps {
	type: listTypes
	fullListLength: number
	list: any[]
	paginationSize?: number
	paginationCurrentPage: number
	toggleOrder: () => void
	nextPage: () => void
	previousPage: () => void
	orderAsc: boolean
	setPaginationCurrentPage: React.Dispatch<React.SetStateAction<number>>
	setSearchTerm: React.Dispatch<React.SetStateAction<string>>
	totalPages: number
	onClickNewItem?: () => void
}

function SearchableListComponent({
	list,
	type,
	paginationCurrentPage,
	toggleOrder,
	orderAsc,
	nextPage,
	previousPage,
	totalPages,
	setSearchTerm,
	onClickNewItem,
}: SearchableListComponentProps) {
	const isFirstPage = paginationCurrentPage === 1
	const isLastPage = paginationCurrentPage === totalPages
	const previousPageButtonClass = isFirstPage ? "opacity-40" : "cursor-pointer"
	const nextPageButtonClass = isLastPage ? "opacity-40" : "cursor-pointer"
	const onChange = (event: React.ChangeEvent<HTMLInputElement>) =>
		setSearchTerm(event.target.value)

	return (
		<div className="shadow-3xl rounded-2xl bg-white">
			<div className="flex justify-between p-6 w-full">
				<input
					onChange={onChange}
					className="border border-default rounded-full px-4 py-2 font-normal w-80"
					placeholder="Search"
				/>
				{onClickNewItem && (
					<button
						className="text-skin-primary bg-skin-primary rounded px-4"
						onClick={onClickNewItem}
					>
						New
					</button>
				)}
			</div>
			<table className="w-full text-left">
				<thead>
					<tr className="h-10 bg-button-subtle items-center px-4 py-5 text-button-subtle text-custom-xs">
						{Headers({ type, list, toggleOrder, orderAsc })}
					</tr>
				</thead>
				<tbody className="text-custom-sm font-normal">
					{list.map((row: any, rowIndex: number) => {
						const rowKeys = Object.keys(row)
						return (
							<tr
								key={`listrow-${rowIndex}`}
								className="border-b border-gray-200 last:border-0"
							>
								{rowKeys.map((key: string, itemIndex: number) => {
									if (key === "id") return null
									const { text = "", Component, props } = row[key]
									return (
										<td className="px-4 py-5" key={`${key}-${itemIndex}`}>
											{text}
											{Component && <Component {...props} />}
										</td>
									)
								})}
							</tr>
						)
					})}
					{totalPages > 1 && (
						<tr>
							<td className="px-4 py-5 flex">
								<div className="flex justify-center items-center ">
									<div
										className={`
                                            ${previousPageButtonClass}
                                            flex justify-center items-center bg-button-subtle rounded-md w-8 h-8
                                        `}
										onClick={() => (isFirstPage ? null : previousPage())}
									>
										<NebulaIcon
											className="h-3"
											iconName="ArrowLeft2"
											iconType="outline"
										/>
									</div>
									<span className="block mx-4">{`${paginationCurrentPage} of ${totalPages}`}</span>
									<div
										className={`
                                            ${nextPageButtonClass}
                                            flex justify-center items-center bg-button-subtle rounded-md w-8 h-8
                                        `}
										onClick={() => (isLastPage ? null : nextPage())}
									>
										<NebulaIcon
											className="h-3"
											iconName="ArrowRight3"
											iconType="outline"
										/>
									</div>
								</div>
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	)
}

export default SearchableListComponent
