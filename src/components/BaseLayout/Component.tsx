import SideMenu from "../SideMenu"

interface BaseLayoutComponentProps {
    isLogged: boolean;
    children: any;
}

function BaseLayoutComponent({ isLogged, children }: BaseLayoutComponentProps){
    return (
        <div className="flex">
            {isLogged && <SideMenu />}
            {children}
        </div>
    )
}

export default BaseLayoutComponent