import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { delay } from 'bluebird'

import AmountInput from './AmountInput'
import RecipientInput from './RecipientInput'

import { highlightSelection, removePopup, removeHighlight, saveHighlight, clickedOnPopup } from '../controllers/annotate'

import { getCoinbase } from '../state/constants/selectors'
import { resetForm, updateBalance, pushTransaction } from '../state/constants/actionCreators'


const Paper = (props) => (
  <span onMouseUp={props.onMouseUp}>
    <h2>
      Ethereum Whitepaper
    </h2>
    <hr/>
    {props.children}
  </span>
)


class Whitepaper extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      text: "Hello from state",
      selectedText: []
    }
  }

  addSelectedText = (text) => {
    this.setState(prevState  => ({
      ...prevState,
      selectedText: prevState.selectedText.concat(text)
    }))
  }

  annotate = (evt) => {
    evt.preventDefault()
    var userSelection = window.getSelection().getRangeAt(0);
    if (clickedOnPopup(evt)){
      if (evt.target.id === 'submitAnnotation'){
        var annotation = document.getElementById('userInput').value
        var selection = userSelection.toString()
        this.addSelectedText({selection: userSelection.toString(), annotation: annotation})
        return Promise.all([
          saveHighlight(annotation),
          removePopup(),
          this.handleSubmit(evt)
        ])
      } else if (evt.target.id === 'cancel') {
        console.log('clicked cancel');
        return Promise.all([
          removePopup(),
          removeHighlight()
        ])
      } else if (evt.target.id === 'userInput'){
        console.log('clicked user input');
      }
    } else if (userSelection.toString().length > 0){
      highlightSelection(userSelection)
    } else {
      return Promise.all([
        removePopup(),
        removeHighlight()
      ])
    }
  }

  handleSubmit (e) {
    const {
      web3,
      resetForm,
      updateBalance,
      pushTransaction,
      contracts: { MetaCoin },
    } = this.props
    const from = "0x627306090abaB3A6e1400e9345bC60c78a8BEf57"
    const recipient = "0xf17f52151EbEF6C7334FAD080c5704D77216b732"
    const amount = "3"
    e.preventDefault()
    MetaCoin.sendCoin.sendTransaction(recipient, amount, {from})
      .then(txHash => {
        const getReceipt = () => web3.eth.getTransactionReceiptAsync(txHash)
          .then(receipt => receipt !== null
            ? receipt
            : delay(500).then(getReceipt))
        return getReceipt()
      })
      .then(receipt => MetaCoin.Transfer().formatter(receipt.logs[0]).args)
      .then(pushTransaction)
      .then(() => MetaCoin.getBalance.call(from))
      .then(balance => balance.toString(10))
      .then(updateBalance)
      .then(resetForm)
  }

  createHighlightComponent(text){
    return <span className={"highlight"}>{text}</span>
  }

  createComponent(text){
    return <div>
      {text}
    </div>
  }

  render(){
    return (
      <Paper onMouseUp={(evt) => this.annotate(evt)}>
        <div ref={"whitepaperText"}>
          Satoshi Nakamoto's development of Bitcoin in 2009 has often been hailed as a radical development in money and currency, being the first example of a digital asset which simultaneously has no backing or intrinsic value and no centralized issuer or controller. However, another - arguably more important - part of the Bitcoin experiment is the underlying blockchain technology as a tool of distributed consensus, and attention is rapidly starting to shift to this other aspect of Bitcoin. Commonly cited alternative applications of blockchain technology include using on-blockchain digital assets to represent custom currencies and financial instruments (colored coins), the ownership of an underlying physical device (smart property), non-fungible assets such as domain names (Namecoin), as well as more complex applications involving having digital assets being directly controlled by a piece of code implementing arbitrary rules (smart contracts) or even blockchain-based decentralized autonomous organizations (DAOs). What Ethereum intends to provide is a blockchain with a built-in fully fledged Turing-complete programming language that can be used to create contracts that can be used to encode arbitrary state transition functions, allowing users to create any of the systems described above, as well as many others that we have not yet imagined, simply by writing up the logic in a few lines of code.
        </div>
      </Paper>
    )
  }
}

const mapStateToProps = state => ({
  web3: state.web3,
  coinbase: getCoinbase(state),
  formData: state.formData,
  contracts: state.contracts
})

const mapDispatchToProps = dispatch => ({
  resetForm: bindActionCreators(resetForm, dispatch),
  updateBalance: bindActionCreators(updateBalance, dispatch),
  pushTransaction: bindActionCreators(pushTransaction, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Whitepaper)
