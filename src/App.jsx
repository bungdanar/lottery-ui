import { useEffect, useState } from 'react'
import './App.css'
import web3 from './web3'
import lottery from './lottery'

function App() {
  const [manager, setManager] = useState('')
  const [players, setPlayers] = useState([])
  const [balance, setBalance] = useState('')
  const [value, setValue] = useState('')
  const [message, setMessage] = useState('')

  const fetchData = async () => {
    const manager = await lottery.methods.manager().call()
    const players = await lottery.methods.getPlayers().call()
    const balance = await web3.eth.getBalance(lottery.options.address)

    setManager(manager)
    setPlayers(players)
    setBalance(balance)
  }

  const handleEnter = async (event) => {
    event.preventDefault()

    setMessage('Waiting on transaction success...')

    const accounts = await web3.eth.getAccounts()

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, 'ether'),
    })

    setMessage('You have been entered')
  }

  const handlePickWinner = async () => {
    setMessage('Waiting on transaction success...')

    const accounts = await web3.eth.getAccounts()

    await lottery.methods.enter().send({
      from: accounts[0],
    })

    setMessage('A winner has been picked!')
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div>
      <h2>Lottery Contract</h2>
      <div>This contract is managed by {manager}. </div>
      <div>
        There are currently {players.length} people entered, competing to win{' '}
        {web3.utils.fromWei(balance)} ether!
      </div>
      <hr />
      <form onSubmit={handleEnter}>
        <h4>Want to try your luck?</h4>
        <div>
          <label>Amount of ether to enter</label>
          <input
            type='text'
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </div>
        <button type='submit'>Enter</button>
      </form>
      <hr />
      <h4>Ready to pick a winner?</h4>
      <button onClick={handlePickWinner}>Pick a winner!</button>
      <hr />
      <h1>{message}</h1>
    </div>
  )
}

export default App
