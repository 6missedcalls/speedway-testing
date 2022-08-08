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
    const [paginationCurrentPage, setPaginationCurrentPage] = useState(2)
    const [finalList, setFinalList] = useState<Array<any>>([]);
    
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

    function nextPage() {
        const totalPages = Math.ceil(list.length/paginationSize)
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
        />
    )
}

export default SearchableListContainer