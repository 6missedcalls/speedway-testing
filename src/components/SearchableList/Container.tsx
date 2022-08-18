/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { listTypes } from "../../utils/types"
import SearchableListComponent from "./Component"

interface SearchableListContainerProps {
	initialList: Array<any>
	type: listTypes
	searchableAndSortableFieldKey: string
	paginationSize?: number
	handleOpenModal?: () => void
	loading: boolean
}

function SearchableListContainer({
	searchableAndSortableFieldKey,
	initialList,
	type,
	paginationSize = 8,
	handleOpenModal,
	loading,
}: SearchableListContainerProps) {
	const [orderAsc, setOrderAsc] = useState(true)
	const [searchTerm, setSearchTerm] = useState("")
	const [paginationCurrentPage, setPaginationCurrentPage] = useState(1)
	const [list, setList] = useState<Array<any>>([])
	const [totalPages, setTotalPages] = useState(1)

	useEffect(() => {
		const processedList = getList()
		setList(processedList)
	}, [searchTerm, orderAsc, paginationCurrentPage, initialList])

	useEffect(() => {
		if (searchTerm) {
			const filteredListLenght = getFilteredList(initialList).length
			setPaginationCurrentPage(1)
			setTotalPages(Math.ceil(filteredListLenght / paginationSize))
		} else {
			setTotalPages(Math.ceil(initialList.length / paginationSize))
		}
	}, [searchTerm, initialList])

	function toggleOrder() {
		setOrderAsc(!orderAsc)
	}

	function getList() {
		return getPaginatedList(getFilteredList(getOrderedList(initialList)))
	}

	function getOrderedList(previousList: Array<any>) {
		let orderedList
		if (orderAsc) {
			orderedList = [...previousList].sort((a: any, b: any) =>
				a[searchableAndSortableFieldKey].text >
				b[searchableAndSortableFieldKey].text
					? 1
					: -1
			)
			return orderedList
		} else {
			orderedList = [...previousList].sort((a: any, b: any) =>
				a[searchableAndSortableFieldKey].text <
				b[searchableAndSortableFieldKey].text
					? 1
					: -1
			)
			return orderedList
		}
	}

	function getPaginatedList(previousList: Array<any>) {
		const paginated = [...previousList].filter((_: any, index: number) => {
			return (
				index < paginationSize * paginationCurrentPage &&
				index >= paginationSize * (paginationCurrentPage - 1)
			)
		})
		return paginated
	}

	function getFilteredList(previousList: Array<any>) {
		if (!searchTerm) return previousList
		return [...previousList].filter(
			(item) =>
				item[searchableAndSortableFieldKey].text
					.toLowerCase()
					.indexOf(searchTerm.toLowerCase()) !== -1
		)
	}

	function nextPage() {
		if (paginationCurrentPage + 1 <= totalPages) {
			setPaginationCurrentPage(paginationCurrentPage + 1)
		}
	}

	function previousPage() {
		if (paginationCurrentPage > 1) {
			setPaginationCurrentPage(paginationCurrentPage - 1)
		}
	}

	return (
		<SearchableListComponent
			list={list}
			fullListLength={initialList.length}
			type={type}
			paginationSize={paginationSize}
			paginationCurrentPage={paginationCurrentPage}
			setPaginationCurrentPage={setPaginationCurrentPage}
			toggleOrder={toggleOrder}
			orderAsc={orderAsc}
			nextPage={nextPage}
			previousPage={previousPage}
			totalPages={totalPages}
			setSearchTerm={setSearchTerm}
			onClickNewItem={handleOpenModal}
		/>
	)
}

export default SearchableListContainer
