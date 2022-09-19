import { useContext } from "react"
import { AppSettingsContext } from "../../../contexts/appSettingsContext/appSettingsContext"

interface MenuLinkProps {
    href: string
    label: string
    Icon: React.FC
}

function MenuLink({
    href,
    label,
    Icon
}: MenuLinkProps){
    const { menuIsCollapsed } = useContext(AppSettingsContext)
    
    return (
        <a
            className={`
                ${menuIsCollapsed ? 'justify-center' : ''}
                flex px-2 h-10 font-extrabold
            `}
            href={href}
            target="_blank"
            rel="noreferrer"
        >
            <span className={menuIsCollapsed ? '' : 'mr-2'}>
                <Icon />
            </span>
            {!menuIsCollapsed && <span>{label}</span>}
        </a>
    )
}

export default MenuLink