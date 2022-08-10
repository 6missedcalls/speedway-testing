interface ObjectHeadersProps {
    list: any;
}

function ObjectHeaders({ list }: ObjectHeadersProps){
    const keys = Object.keys(list[0])
    return (
        <>
            {keys.map((key: any, index: number) => {
                return (
                    <th className="px-4" key={`list-header-${key}-${index}`}>{key}</th>
                )
            })}
        </>
    )
}

export default ObjectHeaders