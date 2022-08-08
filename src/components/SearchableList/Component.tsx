import { Button, NebulaIcon } from '@sonr-io/nebula-react'
import React from 'react';
import { listTypes } from '../../utils/types'
import Headers from './components/Headers'

interface SearchableListComponentProps {
    type: listTypes;
    fullListLength: number;
    list: any;
    paginationSize?: number;
    paginationCurrentPage: number;
    toggleSchemaOrder: () => void;
    nextPage: () => void;
    previousPage: () => void;
    schemaOrderAsc: boolean;
    setPaginationCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    totalPages: number;
}

function SearchableListComponent({ 
    list, 
    type, 
    paginationCurrentPage,
    toggleSchemaOrder,
    schemaOrderAsc,
    nextPage,
    previousPage,
    totalPages,
    setSearchTerm
}: SearchableListComponentProps){
    return (
        <div className="shadow-3xl rounded-2xl bg-white">
            <div className="flex justify-between p-6 w-full">
                <input type="text" 
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(event.target.value)}
                />
                <Button 
                    label="New"
                />
            </div>
            <table className="w-full text-left">
                
                <thead>
                    <tr className="h-10 bg-button-subtle items-center px-4 py-5 text-button-subtle text-custom-xs px-4 py-5">
                        {Headers({ type, list, toggleSchemaOrder, schemaOrderAsc })}
                    </tr> 
                </thead>
                <tbody>
                    {list.map((row: any, rowIndex: number) => {
                        const rowKeys = Object.keys(row)
                        return (
                            <tr key={`listrow-${rowIndex}`}>
                                {rowKeys.map((key: string, itemIndex: number) => {
                                    if(key === 'id') return null
                                    return (
                                        <td className="px-4 py-5" key={`${key}-${itemIndex}`}>{row[key]}</td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                    <tr>
                        <td className="px-4 py-5 flex">
                            <NebulaIcon 
                                className='cursor-pointer' 
                                iconName='ArrowLeft2' 
                                iconType='outline' 
                                onClick={previousPage} 
                            />
                            <span>{`${paginationCurrentPage} of ${totalPages}`}</span>
                            <NebulaIcon 
                                className='cursor-pointer' 
                                iconName='ArrowRight3' 
                                iconType='outline' 
                                onClick={nextPage} 
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default SearchableListComponent