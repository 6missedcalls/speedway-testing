interface ObjectHeaders {
    list: any;
}

function ObjectHeaders({ list }: ObjectHeaders){
    const keys = Object.keys(list[0])
    return (
        <>
            {keys.map((key: any, index: number) => {
                return (
                    <th className="px-4" key={`${key}-${index}`}>{key}</th>
                )
            })}
        </>
    )
}

export default ObjectHeaders