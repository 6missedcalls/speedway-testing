import { Button, NebulaIcon, Input } from "@sonr-io/nebula-react"
import React from "react"
import { listTypes } from "../../utils/types"
import Headers from "./components/Headers"

interface SearchableListComponentProps {
	type: listTypes
	fullListLength: number
	list: any
	paginationSize?: number
	paginationCurrentPage: number
	toggleOrder: () => void
	nextPage: () => void
	previousPage: () => void
	orderAsc: boolean
	setPaginationCurrentPage: React.Dispatch<React.SetStateAction<number>>
	setSearchTerm: React.Dispatch<React.SetStateAction<string>>
	totalPages: number
	onClickNewItem: () => void
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

	return (
		<div className="shadow-3xl rounded-2xl bg-white">
			<div className="flex justify-between p-6 w-full">
				<div className="w-80">
					<Input
						clear
						iconName="SearchNormal1"
						iconType="outline"
						placeholder="Search"
						theme="light"
						onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
							setSearchTerm(event.target.value)
						}
					/>
				</div>
				<Button
					onClick={onClickNewItem}
					iconName="Add"
					iconType="outline"
					label="New"
				/>
			</div>
			<table className="w-full text-left">
				<thead>
					<tr className="h-10 bg-button-subtle items-center px-4 py-5 text-button-subtle text-custom-xs px-4 py-5">
						{Headers({ type, list, toggleOrder, orderAsc })}
					</tr>
				</thead>
				<tbody className="text-custom-sm font-normal">
					{list.map((row: any, rowIndex: number) => {
						const rowKeys = Object.keys(row)
						return (
							<tr key={`listrow-${rowIndex}`}>
								{rowKeys.map((key: string, itemIndex: number) => {
									if (key === "id") return null
									return (
										<td
											className="px-4 py-5 border-b border-gray-200"
											key={`${key}-${itemIndex}`}
										>
											{row[key]}
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
