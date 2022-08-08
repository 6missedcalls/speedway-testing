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
    const [paginationCurrentPage, setPaginationCurrentPage] = useState(1)
    const paginatedList = list.filter((_: any, index: number) => {
        return index < (paginationSize * paginationCurrentPage) && index >= (paginationSize * (paginationCurrentPage - 1))
    })
    const [finalList, setFinalList] = useState<any>(paginatedList);
    
    useEffect(() => {
        if(type === listTypes.schema){
            toggleOrderBySchemaName()
        }
    }, [schemaOrderAsc])

    function toggleSchemaOrder(){
        setSchemaOrderAsc(!schemaOrderAsc)
    }

    function toggleOrderBySchemaName(){
        if(schemaOrderAsc){
            setFinalList([...paginatedList].sort((a: any, b: any) => a.name > b.name ? 1 : -1))
        } else {
            setFinalList([...paginatedList].sort((a: any, b: any) => a.name < b.name ? 1 : -1))
        }
    }

    return (
        <SearchableListComponent 
            list={finalList}
            type={type}
            paginationSize={paginationSize}
            paginationCurrentPage={paginationCurrentPage}
            setPaginationCurrentPage={setPaginationCurrentPage}
            toggleSchemaOrder={toggleSchemaOrder}
        />
    )
}

export default SearchableListContainer