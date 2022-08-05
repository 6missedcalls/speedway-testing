import { Button } from '@sonr-io/nebula-react'
import { listTypes } from '../../utils/types';

interface SearchableListComponentProps {
    type: listTypes;
    list: any;
}

function renderSchemaHeaders(list: any){
    const keys = Object.keys(list[0])
    return (
        <>
            {keys.map((key: any, index: number) => {
                return (
                    <th key={`${key}-${index}`}>{key}</th>
                )
            })}
        </>
    )
}

function renderObjectHeaders(list: any){
    return (
        <></>
    )
}

function renderHeaders({ type, list }: SearchableListComponentProps){
    switch(type){
        case listTypes.schema:
            return renderSchemaHeaders(list)
        case listTypes.object:
            return renderObjectHeaders(list)
        default:
            return null
    }
}

function SearchableListComponent({ list, type }: SearchableListComponentProps){
    return (
        <div className="shadow-3xl rounded-2xl bg-white">
            <div className="flex justify-between p-6 w-full">
                <input type="text" />
                <Button 
                    label="New"
                />
            </div>
            {/* list */}
            <table className="w-full text-left p-4">
                <tr className="h-10 bg-button-subtle items-center px-4 text-button-subtle text-custom-xs">
                    {renderHeaders({ type, list })}
                </tr>
                {list.map((row: any) => {
                    const rowKeys = Object.keys(row)
                    return (
                        <tr className="">
                            {rowKeys.map((key: string, index: number) => (
                                <td key={`${key}-${index}`}>{row[key]}</td>
                            ))}
                        </tr>
                    )
                })}
            </table>
        </div>
    )
}

export default SearchableListComponent