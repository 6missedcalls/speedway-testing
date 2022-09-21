import AlertSvg from "../../assets/svgs/Alert"
import LayoutAuth from "../../components/LayoutAuth"
import TextInput from "../../components/TextInput"
import ValidationListItem from "../../components/ValidationListItem"
import { ROUTE_BUY_ALIAS } from "../../utils/constants"
import { Button } from '@sonr-io/nebula-react'
import { FormEvent } from "react"
import LoadingCircleSvg from "../../assets/svgs/LoadingCircle"

type AliasCreationComponentProps = {
	onSubmit: () => void
	errors: Record<string, any>
    alias: string
    loading: boolean
    validateAliasOnChange: (value: string) => void
}


function AliasCreationComponent({
    errors,
    onSubmit,
    validateAliasOnChange,
    alias,
    loading
}: AliasCreationComponentProps){
    function _onSubmit(event: FormEvent) {
		event.preventDefault()
        
        if(loading) return
		
        onSubmit()
	}

    return (
    <LayoutAuth
        route={ROUTE_BUY_ALIAS}
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
                        error={errors?.alias?.taken}
                        className="text-white mb-4"
                        label="Profile Domain"
                        ariaLabel="Profile Domain"
                        handleOnChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                            validateAliasOnChange(event.target.value)
                        }
                        value={alias}
                        type="text"
                    />
                    <div className="flex flex-col justify-start text-sm text-gray-600 mt-4">
                        <ValidationListItem
                            error={errors?.alias?.charactersLimits}
                            label="3 - 18 characters"
                        />
                        <div className="h-2" />
                        <ValidationListItem
                            error={
                                errors?.alias?.noSpaces ||
                                errors?.alias?.hasNoSpecialCharacter
                            }
                            label="No spaces or special characters"
                        />
                        <div className="h-2" />
                    </div>
                    {!loading ? (
                        <Button
                        type="submit"
                        styling="border rounded block w-full mt-12 justify-center text-custom-md font-extrabold"
                        label="Submit"
                    />
                    ) : (
                        <div className="w-full flex justify-center mt-12">
                            <div className="w-12 animate-spin flex justify-center items-center">
                                <LoadingCircleSvg />
                            </div>
                        </div>
                    )}
                    
                </form>
            </div>
        }
    />
    )
}

export default AliasCreationComponent