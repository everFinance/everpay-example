const ethers = require('ethers')
const Everpay = require('everpay').default

const genEverpay = (wallet) => {
  const provider = new ethers.providers.InfuraProvider('kovan')
  const signer = new ethers.Wallet(wallet.privateKey, provider)
  const everpay = new Everpay({
    account: wallet.address,
    ethConnectedSigner: signer,
    debug: true
  })
  return everpay
}

const walletA = {
  address: '0x73f45F01C66c81B4016858C63E695CDfEe347F54',
  privateKey: 'ba7da8e8893b516f43f73a8d69ca4ed4ffd60e55f6a739fa707350f1add89f2f'
}
const walletB = {
  address: '0x06eACBB9c550F0a014DC1BF0244312a96DF1a411',
  privateKey: 'dfe071748c3d7c9110ecc214305645a7a63f4203792e30d8207dd412ec8c0908'
}
const everpayA = genEverpay(walletA)
const everpayB = genEverpay(walletB)

const run = async () => {
  const bundleData = await everpayA.getBundleData([
    {
      symbol: 'USDT',
      from: walletA.address,
      to: walletB.address,
      amount: '1000'
    }, {
      symbol: 'ETH',
      from: walletB.address,
      to: walletA.address,
      amount: '0.1'
    }
  ])

  const bundleDataWithSigA = await everpayA.signBundleData(bundleData)
  const bundleDataWithSigB = await everpayB.signBundleData(bundleDataWithSigA)
  const bundleResult = await everpayA.bundle({
    symbol: 'ETH',
    to: walletA.address,
    amount: '0',
    data: {
      bundle: bundleDataWithSigB
    }
  })
  console.log(bundleResult.everHash)

  const balanceA = await everpayA.balance({ symbol: 'ETH' })
  const balanceB = await everpayB.balance({ symbol: 'USDT' })

  console.log('balanceA', balanceA)
  console.log('balanceB', balanceB)
}

run()