import SearchableList from "../../components/SearchableList"

function SchemasPageComponent(){
    return (
        <div className="h-screen font-extrabold w-full bg-gray-100 px-10">
            <h1 className="text-custom-3xl tracking-custom-x2tighter mt-14 mb-8">
                Schemas
            </h1>
            <SearchableList />
        </div>
    )
}

export default SchemasPageComponent