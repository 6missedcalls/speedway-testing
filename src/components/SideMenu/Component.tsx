import SonrLogoSvg from "../../assets/svgs/SonrLogo"
import { NebulaIcon } from '@sonr-io/nebula-react'
import DashboardSvg from "../../assets/svgs/DashBoard"
import ButtonGroup from "./components/ButtonsGroup"
import { Button } from '@sonr-io/nebula-react'
import { NavigateFunction } from "react-router-dom"
import { 
    ROUTE_SCHEMAS, 
    ROUTE_OBJECTS, 
    ROUTE_BUCKETS, 
    ROUTE_ACCESS_API, 
    ROUTE_DID_UTILITY, 
    ROUTE_DOCS_AND_SUPPORT, 
    ROUTE_BLOCK_EXPLORER 
} from "../../utils/constants"

interface SideMenuComponentProps {
    navigate: NavigateFunction;
    currentPath: string;
}

const modulesButtons = [
    {
        label: 'Schemas',
        iconName: 'Document',
        route: ROUTE_SCHEMAS,
    }, {
        label: 'Objects',
        iconName: 'Document',
        route: ROUTE_OBJECTS,
    }, {
        label: 'Buckets',
        iconName: 'Document',
        route: ROUTE_BUCKETS,
    }
]

const toolsButtons = [
    {
        label: 'Access API',
        iconName: 'Document',
        route: ROUTE_ACCESS_API,
    }, {
        label: 'DID Utility',
        iconName: 'Document',
        route: ROUTE_DID_UTILITY,
    }, {
        label: 'Docs & Support',
        iconName: 'Document',
        route: ROUTE_DOCS_AND_SUPPORT,
    }, {
        label: 'Block Explorer',
        iconName: 'Document',
        route: ROUTE_BLOCK_EXPLORER,
    }
]

function SideMenuComponent({
    navigate,
    currentPath
}: SideMenuComponentProps){
    return (
        <div className="dark flex flex-col justify-between w-80 bg-brand-tertiary h-screen px-6 py-[42px] shrink-0">
            <div className="flex flex-col text-white w-full">
                <div className="flex items-center w-full">
                    <div  className="w-11 h-11 mr-2.5">
                        <SonrLogoSvg />
                    </div>
                    <div>
                        <span className="font-extrabold tracking-custom-tighter text-custom-xl">
                            Speedway 
                        </span>
                    </div>
                    <NebulaIcon
                        className="w-6 h-6 fill-white ml-auto cursor-pointer"
                        iconName="SidebarLeft"
                        iconType="outline"
                    />
                </div>
                <div className="flex items-center mt-11">
                    <div className="w-[21.5px] h-[21.5px] mr-3.5 shrink-0">
                        <DashboardSvg />
                    </div>
                    <Button
                        skin={currentPath === '/dashboard' ? 'primary' : ''}
                        label='App Dashboard'
                        styling='block text-custom-sm font-extrabold w-full'
                        onClick={() => navigate('/dashboard')}
                    />
                </div>
                <div className="border-b border-outlined-disabled mt-10 w-full h-px" />
                <div className="flex flex-col">
                    <ButtonGroup 
                        title='MODULES'
                        navigate={navigate}
                        currentPath={currentPath}
                        buttons={modulesButtons}
                    />
                    <ButtonGroup 
                        title='TOOLS'
                        navigate={navigate}
                        currentPath={currentPath}
                        buttons={toolsButtons}
                    />
                </div>
            </div>
            <div className="text-white">
                marvinphillips.snr
            </div>
        </div>
    )
}

export default SideMenuComponent