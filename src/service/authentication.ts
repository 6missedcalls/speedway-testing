export const login = async (walletAddress: string, password: string) => {
    const response = await fetch(`${process.env.REACT_APP_BASE_API}/account/login`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ did: walletAddress, password }),
    })

    try {
        const data = await response.json()
        return data
    } catch(err){
        console.error(err)
    }
}
