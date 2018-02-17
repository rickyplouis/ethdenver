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

/* Providers
** ****************** */
import withWeb3 from '../components/providers/withWeb3'
import withAccounts from '../components/providers/withAccounts'
import withContracts from '../components/providers/withContracts'
import { highlightSelection, removePopup, removeHighlight } from '../controllers/annotate'


function clickedOnPopup(evt){
  return evt.target.id && (evt.target.id === 'userInput' || evt.target.id === 'submitAnnotation' || evt.target.id === 'cancel')
}

function textSelected(userSelection){
  return userSelection.toString().length > 0
}

function annotate(evt){
  evt.preventDefault()
  var userSelection = window.getSelection().getRangeAt(0);
  if (clickedOnPopup(evt)){
    if (evt.target.id === 'submitAnnotation'){
      console.log('clicked submit');
    } else if (evt.target.id === 'cancel') {
      console.log('clicked cancel');
    } else if (evt.target.id === 'userInput'){
      console.log('clicked user input');
    }
  } else if (textSelected(userSelection)){
    highlightSelection(userSelection)
  } else {
    return Promise.all([
      removePopup(),
      removeHighlight()
    ])
  }
}


class Index extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      text: "Hello from state",
      count: 0
    }
    console.log('props', props);
  }

  renderEthWhitepaper = () => {
    return (
      <div onMouseUp={(evt) => annotate(evt)}>
        <h2>
          Ethereum Whitepaper
        </h2>
        <hr/>
        Satoshi Nakamoto's development of Bitcoin in 2009 has often been hailed as a radical development in money and currency, being the first example of a digital asset which simultaneously has no backing or "intrinsic value" and no centralized issuer or controller. However, another - arguably more important - part of the Bitcoin experiment is the underlying blockchain technology as a tool of distributed consensus, and attention is rapidly starting to shift to this other aspect of Bitcoin. Commonly cited alternative applications of blockchain technology include using on-blockchain digital assets to represent custom currencies and financial instruments ("colored coins"), the ownership of an underlying physical device ("smart property"), non-fungible assets such as domain names ("Namecoin"), as well as more complex applications involving having digital assets being directly controlled by a piece of code implementing arbitrary rules ("smart contracts") or even blockchain-based "decentralized autonomous organizations" (DAOs). What Ethereum intends to provide is a blockchain with a built-in fully fledged Turing-complete programming language that can be used to create "contracts" that can be used to encode arbitrary state transition functions, allowing users to create any of the systems described above, as well as many others that we have not yet imagined, simply by writing up the logic in a few lines of code.
      </div>
    )
  }

  render(){
    return (
      <main>
        <div>
          Current user: {this.props.accounts[0]}
        </div>
        {this.renderEthWhitepaper()}
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
