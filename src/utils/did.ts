export const addressToDid = (address: string) => `did:snr:${address.slice(3)}`
export const cidToDid = (cid: string) => `did:snr:${cid}`
