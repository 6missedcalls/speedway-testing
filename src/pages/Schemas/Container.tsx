
import SchemasPageComponent from "./Component";
import mockSchemaList from "./fixtures/mockSchemaList";

function SchemasPageContainer(){
    const list = mockSchemaList
    return (
        <SchemasPageComponent 
            list={list}
        />
    )
}

export default SchemasPageContainer