// we can't have these functions in our `helper-hardhat-config`
// since these use the hardhat library
// and it would be a circular dependency
const { run, network } = require("hardhat")
const { networkConfig } = require("./helper-hardhat-config")

const verify = async (contractAddress, args) => {
    console.log("Verifying contract...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already verified!")
        } else {
            console.log(e)
        }
    }
}

// https://github.com/smartcontractkit/chainlink/blob/dbabde12def11a803d995e482e5fc4287d9cfce4/contracts/test/test-helpers/helpers.ts#L93
const stripHexPrefix = (hex) => {
    if (!ethers.utils.isHexString(hex)) {
        throw Error(`Expected valid hex string, got: "${hex}"`)
    }

    return hex.replace("0x", "")
}

// https://github.com/smartcontractkit/chainlink/blob/dbabde12def11a803d995e482e5fc4287d9cfce4/contracts/test/test-helpers/helpers.ts#L21
const addHexPrefix = (hex) => {
    return hex.startsWith("0x") ? hex : `0x${hex}`
}

// https://github.com/smartcontractkit/chainlink/blob/dbabde12def11a803d995e482e5fc4287d9cfce4/contracts/test/test-helpers/helpers.ts#L30
const numToBytes32 = (num) => {
    const hexNum = ethers.utils.hexlify(num)
    const strippedNum = stripHexPrefix(hexNum)
    if (strippedNum.length > 32 * 2) {
        throw Error(
            "Cannot convert number to bytes32 format, value is greater than maximum bytes32 value"
        )
    }
    return addHexPrefix(strippedNum.padStart(32 * 2, "0"))
}

module.exports = {
    verify,
    numToBytes32,
}
