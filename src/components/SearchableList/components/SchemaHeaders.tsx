import ArrowCircleDownSvg from '../../../assets/svgs/ArrowCircleDown';
import ArrowCircleUpSvg from '../../../assets/svgs/ArrowCircleUp';
interface SchemaHeadersProps {
    toggleSchemaOrder: () => void
    schemaOrderAsc: boolean;
}

function SchemaHeaders({ toggleSchemaOrder, schemaOrderAsc }: SchemaHeadersProps){
    const fillColor = 'fill-button-subtle group-hover:fill-white'
    return (
        <>
            <th 
                className="group px-4 py-2.5 cursor-pointer flex items-center justify-between hover:bg-surface-button-subtle-hovered hover:text-white hover:fill-white" 
                onClick={toggleSchemaOrder}
            >
                <span className="">Schema Name</span>
                <div className="w-3.5 h-3.5">
                    {schemaOrderAsc ? <ArrowCircleDownSvg fillColor={fillColor} /> : <ArrowCircleUpSvg fillColor={fillColor} />}
                </div>    
            </th>
            <th className="px-4">DID</th>
            <th className="px-4">Version</th>
            <th className="px-4">Objects</th>
            <th className="px-4">Field Count</th>
        </>
    )
}

export default SchemaHeaders