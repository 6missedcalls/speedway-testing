/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { listTypes } from "../../utils/types"
import SearchableListComponent from "./Component"

interface SearchableListContainerProps {
    list: Array<any>;
    type: listTypes;
    paginationSize?: number;
}

function SearchableListContainer({ list, type, paginationSize = 6 }: SearchableListContainerProps){
    const [schemaOrderAsc, setSchemaOrderAsc] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [paginationCurrentPage, setPaginationCurrentPage] = useState(1)
    const [finalList, setFinalList] = useState<Array<any>>([]);
    const [totalPages, setTotalPages] = useState(Math.ceil(list.length/paginationSize))
    
    useEffect(() => {
        if(searchTerm){
            const filteredList = getFilteredList(list)
            setFinalList(getPaginatedList(filteredList))
            setTotalPages(Math.ceil(filteredList.length/paginationSize))
        }else {
            setTotalPages(Math.ceil(list.length/paginationSize))
            setFinalList(getPaginatedList(list))
        }
    }, [searchTerm])

    useEffect(() => {
        if(type === listTypes.schema){
            toggleOrderBySchemaName()
        } else {
            const paginatedList = getPaginatedList(list)
            setFinalList(paginatedList)
        }
    }, [schemaOrderAsc, paginationCurrentPage])

    function toggleSchemaOrder(){
        setSchemaOrderAsc(!schemaOrderAsc)
    }

    function toggleOrderBySchemaName(){
        let orderedList;
        if(schemaOrderAsc){
            orderedList = [...list].sort((a: any, b: any) => a.name > b.name ? 1 : -1)
            setFinalList(orderedList)
        } else {
            orderedList = [...list].sort((a: any, b: any) => a.name < b.name ? 1 : -1)
            setFinalList(orderedList)
        }

        const paginatedList = getPaginatedList(orderedList)
        setFinalList(paginatedList)
    }

    function getPaginatedList(previousList: Array<any>){
        const paginatedList = [...previousList].filter((_: any, index: number) => {
            return index < (paginationSize * paginationCurrentPage) && index >= (paginationSize * (paginationCurrentPage - 1))
        })
        return paginatedList
    }

    function getFilteredList(previousList: Array<any>){
        return [...previousList].filter((item) => item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1)
    }

    function nextPage() {
        if(paginationCurrentPage + 1 <= totalPages) {
            setPaginationCurrentPage(paginationCurrentPage + 1)
        }
    }

    function previousPage() {
        if(paginationCurrentPage > 1) {
            setPaginationCurrentPage(paginationCurrentPage - 1)
        }
    }

    return (
        <SearchableListComponent 
            list={finalList}
            fullListLength={list.length}
            type={type}
            paginationSize={paginationSize}
            paginationCurrentPage={paginationCurrentPage}
            setPaginationCurrentPage={setPaginationCurrentPage}
            toggleSchemaOrder={toggleSchemaOrder}
            schemaOrderAsc={schemaOrderAsc}
            nextPage={nextPage}
            previousPage={previousPage}
            totalPages={totalPages}
            setSearchTerm={setSearchTerm}
        />
    )
}

export default SearchableListContainer