class TokenAddress {
    stableTokenAddress: string
    basicTokenAddress: string

    constructor(stableTokenAddress, basicTokenAddress) {
        this.stableTokenAddress = stableTokenAddress;
        this.basicTokenAddress = basicTokenAddress;
    }
}

export { TokenAddress };