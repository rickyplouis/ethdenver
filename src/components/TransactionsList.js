import React from 'react'
import { connect } from 'react-redux'

const TransactionsList = ({ transactions }) => (
  <ol>
    <h2>A list of your transations below</h2>
    {transactions.map(({ _to, _from, _value }, i) => (
      <ul>
        <li><label>Value: </label>{_value.toString(10)}</li>
        <li><label>From: </label>{_from}</li>
      </ul>
    ))}
  </ol>
)

const mapStateToProps = state => ({
  transactions: state.meta.transactions
})

export default connect(
  mapStateToProps
)(TransactionsList)
