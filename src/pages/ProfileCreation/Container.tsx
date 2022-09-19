import { NoSpaces, HasNoSpecialCharacter } from "@sonr-io/validation/dist/validation"
import validate from "@sonr-io/validation/dist/validator"

import { useState } from "react"
import ProfileCreationComponent from "./Component"

const profileRules = [
	{
		name: "noSpaces",
		validate: NoSpaces,
	},
	{
		name: "hasNoSpecialCharacter",
		validate: HasNoSpecialCharacter,
	},
	{
		name: "charactersLimits",
		validate: function (value: string) {
			if (value.length < 3 || value.length > 18)
				return new Error("Domain should have between 3 and 18 characters.")
			return true
		},
	},
]

function ProfileCreationContainer(){
    const [domain, setDomain] = useState('')
    const [errors, setErrors] = useState<Record<string, any>>({
		profile: {
			noSpaces: false,
			hasNoSpecialCharacter: false,
			charactersLimits: true,
		},
	})

    function onSubmit(){
        const fields = {
			profile: {
				rules: profileRules,
				value: domain,
			},
		}
        const { isValid, validationErrors } = validate({ fields })
        setErrors({ ...validationErrors })

        if(isValid){
            // valid
        }
    }

    function validateDomainOnChange(value: string){
        const fields = {
			profile: {
				rules: profileRules,
				value,
			},
		}
        const { validationErrors } = validate({ fields })
        console.log(validationErrors)
        setErrors({ ...validationErrors })
        setDomain(value)
    }

    return (
        <ProfileCreationComponent 
            onSubmit={onSubmit}
            errors={errors}
            domain={domain}
            validateDomainOnChange={validateDomainOnChange}
        />
    )
}

export default ProfileCreationContainer