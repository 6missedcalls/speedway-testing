import { Button } from '@sonr-io/nebula-react'
import { listTypes } from '../../utils/types'
import Headers from './components/Headers'

interface SearchableListComponentProps {
    type: listTypes;
    list: any;
    paginationSize?: number;
    paginationCurrentPage: number;
    toggleSchemaOrder: () => void;
    setPaginationCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

function SearchableListComponent({ 
    list, 
    type, 
    paginationSize = 6,
    paginationCurrentPage,
    toggleSchemaOrder,
}: SearchableListComponentProps){
    return (
        <div className="shadow-3xl rounded-2xl bg-white">
            <div className="flex justify-between p-6 w-full">
                <input type="text" />
                <Button 
                    label="New"
                />
            </div>
            <table className="w-full text-left">
                <tr className="h-10 bg-button-subtle items-center px-4 py-5 text-button-subtle text-custom-xs px-4 py-5">
                    {Headers({ type, list, toggleSchemaOrder })}
                </tr>
                {list.map((row: any) => {
                    const rowKeys = Object.keys(row)
                    return (
                        <tr>
                            {rowKeys.map((key: string, index: number) => {
                                if(key === 'id') return null
                                return (
                                    <td className="px-4 py-5" key={`${key}-${index}`}>{row[key]}</td>
                                )
                            })}
                        </tr>
                    )
                })}
                <tr>
                    <td className="px-4 py-5">{`${paginationCurrentPage} - ${paginationSize} of ${Math.ceil(list.length / paginationSize)}`}</td>
                </tr>
            </table>
        </div>
    )
}

export default SearchableListComponent