import React, { Component } from 'react'
import { compose } from 'redux'

/* Styles
** ****************** */
import '../styles/index.css'
import '../styles/popup.css'

/* Components
** ****************** */
import CoinbaseLabel from '../components/CoinbaseLabel'
import MetaCoinBalance from '../components/MetaCoinBalance'
import MetaCoinForm from '../components/MetaCoinForm'
import TransactionsList from '../components/TransactionsList'
import Whitepaper from '../components/Whitepaper'

/* Providers
** ****************** */
import withWeb3 from '../components/providers/withWeb3'
import withAccounts from '../components/providers/withAccounts'
import withContracts from '../components/providers/withContracts'

class Index extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      text: "Hello from state",
      count: 0,
      selectedText: []
    }
    console.log('props', props);
  }


  render(){
    return (
      <main>
        <div>
          Current user: {this.props.accounts[0]}
        </div>
        <Whitepaper/>
        <h2>Transfer MetaCoins</h2>
        <hr />
        <CoinbaseLabel />
        <MetaCoinBalance />
        <MetaCoinForm />
        <TransactionsList />
      </main>
    )
  }
}

export default compose(
  withWeb3,
  withAccounts,
  withContracts
)(Index)
