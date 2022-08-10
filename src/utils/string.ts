export function obfuscateDid(did: string): string {
	if (!did) return ""
	const didLength = did.length
	return `${did.substring(0, 4)}...${did.substring(didLength - 4, didLength)}`
}
