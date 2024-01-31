import React, { useEffect, useState } from 'react'
import { StakingPoolAddress, StakingPoolAbi } from "../utils/contract/stakingContract"
import { tokenContractAddress, tokenContractAbi } from "../utils/contract/tokenContract"
import { tokenAbi } from "../utils/contract/tokenAbi"
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { toast } from "react-toastify";
export const Tabs = ({ displayTabs, connectWallets }) => {
    const [currentReward, setCurrentReward] = useState(0)
    const [totalStaked, setTotalStaked] = useState(0)
    const [getCurrentDay, setGetCurrentDay] = useState(0)
    const [totalReward, setTotalReward] = useState(0)
    const [rewardPerShare, setRewardPerShare] = useState(0)
    const [getLengthBonus, setGetLengthBonus] = useState(0)
    const [sumAmount, setSumAmount] = useState(0)
    const [calcShares, setCalcShares] = useState(0)
    const [userInfo, setUserInfo] = useState([])
    const [amount, setAmount] = useState('')
    const [stakeDays, setStakeDays] = useState()
    const [loading, setLoading] = useState(false);
    const [stakedNumber, setStakedNumber] = useState('')
    const [nftBonus, setNftBonus] = useState(0)
    const integrateContract = () => {
        const web3 = window.web3;
        const stakingPool_Contract = new web3.eth.Contract(
            StakingPoolAbi,
            StakingPoolAddress
        );
        return stakingPool_Contract;
    };
    const integrateTokenContract = () => {
        const web3 = window.web3;
        const token_Contract = new web3.eth.Contract(
            tokenContractAbi,
            tokenContractAddress
        );
        return token_Contract;
    };
    const getValue = async () => {
        try {
            if (connectWallets == "Connect Wallet") {
            } else if (connectWallets == "Wrong Network") {
            } else {
                const web3 = window.web3;
                let contract = integrateContract()
                let currentReward = await contract.methods.currentReward().call();
                currentReward = Number(currentReward)
                currentReward = web3.utils.fromWei(currentReward, 'ether');
                setCurrentReward(currentReward)

                let totalStaked = await contract.methods.totalStaked().call()
                totalStaked = Number(totalStaked) / 1e18
                totalStaked = parseFloat(totalStaked).toFixed(2)
                setTotalStaked(totalStaked)

                let getCurrentDay = await contract.methods.getCurrentDay().call()
                getCurrentDay = Number(getCurrentDay)
                setGetCurrentDay(getCurrentDay)

                let totalReward = await contract.methods.totalReward().call()
                totalReward = Number(totalReward)
                totalReward = web3.utils.fromWei(totalReward, 'ether');
                totalReward = parseFloat(totalReward).toFixed(4)
                setTotalReward(totalReward)

                // let rewardPerShare = await contract.methods.rewardPerShare().call();
                // rewardPerShare = Number(rewardPerShare)
                // rewardPerShare = web3.utils.fromWei(rewardPerShare, 'ether');
                // rewardPerShare = parseFloat(rewardPerShare).toFixed(8)
                // setRewardPerShare(rewardPerShare)


                let currentShareRate = await contract.methods.currentShareRate().call()
                currentShareRate = Number(currentShareRate)
                let totalShares = await contract.methods.totalShares().call();
                totalShares = Number(totalShares) / 1e18
                let divideShares = currentShareRate / totalShares
                divideShares = parseFloat(divideShares).toFixed(2)
                setRewardPerShare(divideShares)

                let getUserStakelength = await contract.methods.getUserStakelength(connectWallets).call()
                getUserStakelength = Number(getUserStakelength)

                if (getUserStakelength > 0) {
                    let array = []
                    let balanceArray = []
                    for (let i = 0; i < getUserStakelength; i++) {
                        let userStakingInfo = await contract.methods.userStakingInfo(connectWallets, i).call()
                        let balance = Number(userStakingInfo.balance) / 1e18
                        balance = parseFloat(balance).toFixed(2)

                        let shares = Number(userStakingInfo.shares)
                        shares = web3.utils.fromWei(shares, 'ether');
                        shares = parseFloat(shares).toFixed(2)
                        let stakeDays = Number(userStakingInfo.stakeDays)
                        let startDay = Number(userStakingInfo.startDay)
                        let userRewardPerSharePaid = Number(userStakingInfo.userRewardPerSharePaid)
                        userRewardPerSharePaid = web3.utils.fromWei(userRewardPerSharePaid, 'ether');
                        userRewardPerSharePaid = parseFloat(userRewardPerSharePaid).toFixed(7)
                        let object = {
                            sharesL: shares,
                            balance: balance,
                            stakeDays: stakeDays,
                            startDay: startDay,
                            userRewardPerSharePaid: userRewardPerSharePaid
                        }
                        balanceArray.push(balance)
                        array.push(object)
                    }
                    let sumOfArray = balanceArray.reduce((accumulator, currentValue) => accumulator + parseFloat(currentValue), 0);
                    setUserInfo(array)
                }


            }
        } catch (e) {
            console.log("e", e);
        }
    }
    const stakingValueShow = async () => {
        try {
            if (connectWallets == "Connect Wallet") {
            } else if (connectWallets == "Wrong Network") {
            } else {
                const web3 = window.web3;
                let contract = integrateContract()
                const amounts = web3.utils.toWei(amount, 'ether');
                let getLengthBonus = await contract.methods.getLengthBonus(amounts, stakeDays).call()
                getLengthBonus = Number(getLengthBonus)
                getLengthBonus = web3.utils.fromWei(getLengthBonus, 'ether');
                getLengthBonus = parseFloat(getLengthBonus).toFixed(3)
                setGetLengthBonus(getLengthBonus)
                let sumAmount = parseFloat(amount) + parseFloat(getLengthBonus);
                
                let totalShares = sumAmount / rewardPerShare
                totalShares = parseFloat(totalShares).toFixed(2)
                setCalcShares(totalShares);

                let getUserBoostPercent = await contract.methods.getUserBoostPercent(connectWallets).call();
                getUserBoostPercent = Number(getUserBoostPercent)
                let nftBonus = (getUserBoostPercent / 100) * amount
                nftBonus = parseFloat(nftBonus).toFixed(2)
                setNftBonus(nftBonus)
             
                let tottalValue = parseFloat(sumAmount) + parseFloat(nftBonus)


                setSumAmount(tottalValue)
                // let getUserBoostPercent = await contract.methods.getUserBoostPercent(connectWallets).call();
                // getUserBoostPercent = Number(getUserBoostPercent)
                // let calcShares = await contract.methods.calcShares(amounts, stakeDays, getUserBoostPercent).call();
                // calcShares = Number(calcShares)
                // calcShares = web3.utils.fromWei(calcShares, 'ether');
                // calcShares = parseFloat(calcShares).toFixed(2);
                // 
            }
        } catch (e) {
            console.log("e", e);
        }
    }

    const handleStake = async () => {
        try {
            if (!amount || !stakeDays) {
                toast.error("please fill the input")
                return false
            }

            if (connectWallets == "Connect Wallet") {
                toast.error("Please Connect wallet first")
            } else if (connectWallets == "Wrong Network") {
                toast.error("Please Connect Goerli network")
            } else {
                setLoading(true)
                const web3 = window.web3;
                let contract = integrateContract()
                let tokenContract = integrateTokenContract()
                let refererAddress = "0x0000000000000000000000000000000000000000"
                const amounts = web3.utils.toWei(amount, 'ether');
                const stakingFee = await contract.methods.stakingFee().call()
                if (stakeDays > 1 && stakeDays <= 1000) {
                    await tokenContract.methods.approve(StakingPoolAddress, amounts)
                        .send({
                            from: connectWallets
                        })
                    let stake = await contract.methods.stake(amounts, stakeDays, refererAddress)
                        .send({
                            from: connectWallets,
                            value: Number(stakingFee)
                        })

                    if (stake) {
                        toast.success("stake has been successfully")
                        setAmount("")
                        setStakeDays("")
                        setGetLengthBonus(0)
                        setSumAmount(0)
                        setCalcShares(0)
                        setLoading(false)
                        getValue()
                    }
                } else {
                    toast.error("Enter number of days. between 2 to 10000")
                    setLoading(false)
                }

            }
        } catch (e) {
            console.log("e", e);
            setLoading(false)
        }
    }

    const handleUnstake = async (item, stakeNumber) => {
        try {
            if (connectWallets == "Connect Wallet") {
                toast.error("Please Connect wallet first")
            } else if (connectWallets == "Wrong Network") {
                toast.error("Please Connect Goerli network")
            } else {
                let dayAdd = item.startDay + item.stakeDays
                setLoading(true)
                let contract = integrateContract()
                let unstake = await contract.methods.unstake(stakeNumber)
                    .send({
                        from: connectWallets
                    })
                if (unstake) {
                    toast.success("Unstake has been successfully")
                    setStakedNumber("")
                    getValue()
                    setLoading(false)
                }

            }
        } catch (e) {
            console.log("e", e);
            setLoading(false)
        }
    }
    useEffect(() => {
        stakingValueShow()
    }, [amount, stakeDays])
    useEffect(() => {
        getValue()
    }, [displayTabs, connectWallets, rewardPerShare])

    return (
        <>
            {
                loading ? (<div>
                    <div className="load-wrapp">
                        <div className="load-9">
                            <div className="spinner">
                                <div className="bubble-1"></div>
                                <div className="bubble-2"></div>
                            </div>
                        </div>
                    </div>
                </div>) : (
                    <></>
                )
            }
            <div className='container mt-5 mb-5'>
                <div className='row d-flex justify-content-between'>
                    <div className='col-md-3 box-width mt-3' >
                        <span className='token-supply'>Current Reward</span>
                        <span className='token-supply-value'>
                            {currentReward}
                        </span>
                    </div>
                    <div className='col-md-3 box-width mt-3' >
                        <span className='token-supply'>Total Staked</span>
                        <span className='token-supply-value'>
                            {totalStaked}
                        </span>
                    </div>
                    <div className='col-md-3 box-width mt-3' >
                        <span className='token-supply'>Current Day</span>
                        <span className='token-supply-value'>
                            {getCurrentDay}
                        </span>
                    </div>
                    <div className='col-md-3 box-width mt-3' >
                        <span className='token-supply'>Total Reward</span>
                        <span className='token-supply-value'>
                            {totalReward}
                        </span>
                    </div>
                </div>


                <div className='row d-flex justify-content-between mt-5'>
                    <div className='col-md-5 down-boxWIwith'>
                        <div className='row  mt-4'>
                            <div className='bePqrO col-md-11'>
                                <input className='OFFdK' type='number' placeholder='Enter amount ' value={amount} onChange={(e) => setAmount(e.target.value)} min={1} />
                            </div>
                            <div className='bePqrO col-md-11'>
                                <input className='OFFdK' type='number' placeholder='Enter Day 2 to 1000' value={stakeDays} onChange={(e) => setStakeDays(e.target.value)} min={2} />
                            </div>
                        </div>

                        <div className='row  d-flex justify-content-center ' >
                            <div className='col-md-8 '>
                                <div className="d-grid gap-2">
                                    <button className='btn btn-approve' size="lg" onClick={handleStake}>
                                        Stake
                                    </button>
                                </div>
                            </div>
                            {/* <div className='col-md-8 '>
                                <div className="d-grid gap-2">
                                    <button className='btn btn-approve' size="lg" onClick={handleUnstake}>
                                        Unstake
                                    </button>
                                </div>
                            </div> */}

                        </div>
                    </div>
                    <div className='col-md-6 down-boxWIwith text-start'>
                        <h4 className='token-supply-h4 mt-2'>STAKE BONUSES</h4>
                        <div className='d-flex justify-content-between ikqSPh'>
                            <div className='d-flex flex-column text-start mb-3'>
                                <span className='iQecjR mt-3'>LENGTH BONUS:</span>
                                <span className='token-supply-value mt-2' >+{getLengthBonus} PDONG</span>
                            </div>
                            <div className='d-flex flex-column text-start mb-3'>
                                <span className='iQecjR mt-3'>NFT BONUSES:</span>
                                <span className='token-supply-value mt-2' >{nftBonus} PDONG</span>
                            </div>
                            <div className='d-flex flex-column text-start mb-3'>
                                <span className='iQecjR mt-3'>TOTAL</span>
                                <span className='token-supply-value mt-2' >{sumAmount} PDONG</span>
                            </div>
                        </div>
                        <div className='d-flex justify-content-between'>
                            <div className='d-flex flex-column text-start '>
                                <span className='iQecjR mt-2'>SHARE PRICE:</span>
                                <span className='token-supply-value mt-2' >{rewardPerShare} PDONG/Share</span>
                            </div>
                            <div className='d-flex flex-column text-start '>
                                <span className='iQecjR mt-2'>TOTAL SHARES</span>
                                <span className='token-supply-value mt-2' >{calcShares}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='row mt-4 mb-5'>
                    <div className='col-md-12 down-boxWIwith mb-5 table-responsive'>
                        <table class="table" style={{ background: "transparent" }}>
                            <thead>
                                <tr>
                                    <th scope="col" className='th--color'>Sr.</th>
                                    <th scope="col" className='th--color'>Start Day</th>
                                    <th scope="col" className='th--color'>End Day</th>
                                    <th scope="col" className='th--color'>PDONG Balance</th>
                                    <th scope="col" className='th--color'>shares</th>
                                    <th scope="col" className='th--color'>Reward</th>
                                    <th scope="col" className='th--color'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userInfo.length > 0 ?
                                    userInfo.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <th scope="row" className='th--color'>{index + 1}</th>
                                                <td className='th--color'>{item.startDay}</td>
                                                <td className='th--color'>{item.stakeDays}</td>
                                                <td className='th--color'>{item.balance}</td>
                                                <td className='th--color'>{item.sharesL}%</td>
                                                <td className='th--color'>{item.userRewardPerSharePaid}</td>
                                                <td className='th--color'><button className='btn btn-unstake' onClick={() => handleUnstake(item, index)}>Unstake</button></td>
                                            </tr>
                                        )
                                    })
                                    : (
                                        <td className='' colSpan={7}>no data found</td>
                                    )
                                }

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>

    )
}
