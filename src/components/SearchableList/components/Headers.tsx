import { listTypes } from "../../../utils/types";
import ObjectHeaders from "./ObjectsHeader";
import SchemaHeaders from "./SchemaHeaders";

interface HeadersProps {
    type: listTypes;
    list: any;
    toggleSchemaOrder: () => void;
}

function Headers({ type, list, toggleSchemaOrder }: HeadersProps){
    switch(type){
        case listTypes.schema:
            return SchemaHeaders({ toggleSchemaOrder })
        case listTypes.object:
            return ObjectHeaders(list)
        default:
            return null
    }
}

export default Headers