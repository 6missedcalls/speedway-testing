import { Button } from '@sonr-io/react-components'
import { NavigateFunction } from 'react-router-dom';

interface Ibutton {
    label?: string;
    iconName: string;
    route: string;
}

interface ButtonGroupProps {
    title: string;
    buttons: Array<Ibutton>;
    navigate: NavigateFunction;
    currentPath: string;
}

function ButtonGroup({
    title,
    buttons,
    navigate,
    currentPath,
}: ButtonGroupProps){
    return (
        <div className="mt-12">
            <div className="mb-6">
                <span className="block text-custom-2xs uppercase font-semibold text-subdued">{title}</span>
            </div>
            {buttons.map(({ label, iconName, route }, index) => {
                return (
                    <Button 
                        key={`${label}-${index}`}
                        styling="w-full font-extrabold"
                        skin={route === currentPath ? 'primary' : ''}
                        label={label}
                        iconName={iconName}
                        iconType='outline'
                        onClick={() => navigate(route)}
                    />
                )
            })}
        </div>
    )
}

export default ButtonGroup