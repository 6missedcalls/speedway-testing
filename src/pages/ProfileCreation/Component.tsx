import AlertSvg from "../../assets/svgs/Alert"
import LayoutAuth from "../../components/LayoutAuth"
import TextInput from "../../components/TextInput"
import ValidationListItem from "../../components/ValidationListItem"
import { ROUTE_CREATE_PROFILE } from "../../utils/constants"
import { Button } from '@sonr-io/nebula-react'
import { FormEvent } from "react"

type ProfileCreationComponentProps = {
	onSubmit: () => void
	errors: Record<string, any>
    domain: string
    validateDomainOnChange: (value: string) => void
}


function ProfileCreationComponent({
    errors,
    onSubmit,
    validateDomainOnChange,
    domain
}: ProfileCreationComponentProps){
    function _onSubmit(event: FormEvent) {
		event.preventDefault()
		onSubmit()
	}

    return (
    <LayoutAuth
        route={ROUTE_CREATE_PROFILE}
        sidebarContent={
            <div className=" max-w-[479px] flex flex-col mt-40 ml-14">
                <div className="text-custom-3xl font-extrabold tracking-custom-x2tighter mb-6">
                    Let's Get Moving
                </div>
                <div className="text-custom-md font-normal tracking-custom-tight mb-10">
                    Your profile will serve as your username for Sonr. Profiles are also domains that can function as their own website.
                </div>
                <div className="flex mb-4">
                    <div className="w-5 mr-2.5 flex items-center">
                        <AlertSvg />
                    </div>
                    <span className="block text-custom-md font-extrabold tracking-custom-tight">
                        Choose a memorable domain.
                    </span>
                </div>
                <div className="text-custom-sm tracking-custom-tight">
                    Sonr does not collect personal information, and will be unable to recover your account if you forget.
                </div>
            </div>
        }
        content={
            <div className="flex flex-col justify-center w-full max-w-sm">
                <h1 className="text-custom-xl font-extrabold mb-8 text-emphasis">
                    Create Your Profile
                </h1>

                <form onSubmit={_onSubmit} className="w-full">
                    <TextInput
                        className="text-white mb-4"
                        label="Profile Domain"
                        ariaLabel="Profile Domain"
                        handleOnChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                            validateDomainOnChange(event.target.value)
                        }
                        value={domain}
                        type="text"
                    />
                    <div className="flex flex-col justify-start text-sm text-gray-600 mt-4">
                        <ValidationListItem
                            error={errors?.profile?.charactersLimits}
                            label="3 - 18 characters"
                        />
                        <div className="h-2" />
                        <ValidationListItem
                            error={
                                errors?.profile?.noSpaces ||
                                errors?.profile?.hasNoSpecialCharacter
                            }
                            label="No spaces or special characters"
                        />
                        <div className="h-2" />
                    </div>
                    <Button
                        type="submit"
                        styling="border rounded block w-full mt-12 justify-center text-custom-md font-extrabold"
                        label="Submit"
                    />
                </form>
            </div>
        }
    />
    )
}

export default ProfileCreationComponent