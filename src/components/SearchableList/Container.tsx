import { useEffect, useState } from "react"
import { IsearchableListItem, listTypes } from "../../utils/types"
import SearchableListComponent from "./Component"

interface SearchableListContainerProps {
	initialList: Array<IsearchableListItem>
	type: listTypes
	searchableAndSortableFieldKey?: string
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
}: SearchableListContainerProps) {
	const [orderAsc, setOrderAsc] = useState(true)
	const [searchTerm, setSearchTerm] = useState("")
	const [paginationCurrentPage, setPaginationCurrentPage] = useState(1)
	const [list, setList] = useState<Array<IsearchableListItem>>(initialList)
	const [totalPages, setTotalPages] = useState(1)

	useEffect(() => {
		const processedList = getList()
		setList(processedList)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchTerm, orderAsc, paginationCurrentPage, initialList])

	useEffect(() => {
		if (searchTerm) {
			const filteredListLenght = getFilteredList(initialList).length
			setPaginationCurrentPage(1)
			setTotalPages(Math.ceil(filteredListLenght / paginationSize))
		} else {
			setTotalPages(Math.ceil(initialList.length / paginationSize))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchTerm, initialList])

	function toggleOrder() {
		setOrderAsc(!orderAsc)
	}

	function getList() {
		return getPaginatedList(getFilteredList(getOrderedList(initialList)))
	}

	function getOrderedList(previousList: Array<IsearchableListItem>) {
		if (!searchableAndSortableFieldKey) return previousList

		let orderedList
		if (orderAsc) {
			orderedList = [...previousList].sort(
				(a: IsearchableListItem, b: IsearchableListItem) =>
					(a[searchableAndSortableFieldKey].text as string).toLowerCase() >
					(b[searchableAndSortableFieldKey].text as string).toLowerCase()
						? 1
						: -1
			)
			return orderedList
		} else {
			orderedList = [...previousList].sort(
				(a: IsearchableListItem, b: IsearchableListItem) =>
					(a[searchableAndSortableFieldKey].text as string).toLowerCase() <
					(b[searchableAndSortableFieldKey].text as string).toLowerCase()
						? 1
						: -1
			)
			return orderedList
		}
	}

	function getPaginatedList(previousList: Array<IsearchableListItem>) {
		const paginated = [...previousList].filter((_, index: number) => {
			return (
				index < paginationSize * paginationCurrentPage &&
				index >= paginationSize * (paginationCurrentPage - 1)
			)
		})
		return paginated
	}

	function getFilteredList(previousList: Array<IsearchableListItem>) {
		if (!searchTerm) return previousList

		return [...previousList].filter((item) => {
			const textFields = Object.keys(item).map((key) => {
				return item[key]?.text ? item[key]?.text : ""
			})
			return (
				textFields.join(" ").toLowerCase().indexOf(searchTerm.toLowerCase()) !==
				-1
			)
		})
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
