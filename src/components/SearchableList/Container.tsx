import { listTypes } from "../../utils/types"
import SearchableListComponent from "./Component"
import mockSchemaList from "./fixtures/mockSchemaList"

function SearchableListContainer(){
    return (
        <SearchableListComponent 
            list={mockSchemaList}
            type={listTypes.schema}
        />
    )
}

export default SearchableListContainer