interface SchemaHeadersProps {
    toggleSchemaOrder: () => void
}

function SchemaHeaders({ toggleSchemaOrder }: SchemaHeadersProps){
    return (
        <>
            <th className="px-4" onClick={toggleSchemaOrder}>Schema Name</th>
            <th className="px-4">DID</th>
            <th className="px-4">Version</th>
            <th className="px-4">Objects</th>
            <th className="px-4">Field Count</th>
        </>
    )
}

export default SchemaHeaders