import Button from './Button'
import classes from './Form.module.css'
import { useReducer, useState, useCallback, useEffect, Fragment } from 'react'

const defaultState = {
	firstValue: 1,
	secondValue: '',
	selectedOne: 'PLN',
	selectedTwo: 'USD',
}

const reducerFnc = (prevState, action) => {
	switch (action.type) {
		case 'CHANGE_FIRST':
			return {
				...prevState,
				firstValue: action.value,
			}
		case 'SWAP':
			const currencyOneOld = prevState.selectedOne
			return {
				...prevState,
				selectedOne: prevState.selectedTwo,
				selectedTwo: currencyOneOld,
			}
		case 'SET_SELECT_ONE':
			return {
				...prevState,
				selectedOne: action.value,
			}
		case 'SET_SELECT_TWO':
			return {
				...prevState,
				selectedTwo: action.value,
			}
		case 'CALCULATE':
			const secValue = (prevState.firstValue * action.value[prevState.selectedTwo]).toFixed(3)
			return {
				...prevState,
				secondValue: secValue,
			}

		default:
			return prevState
	}
}

const Form = () => {
	const [state, dispatch] = useReducer(reducerFnc, defaultState)
	const [error, setError] = useState(null)

	const swap = () => {
		dispatch({ type: 'SWAP' })
		calculate()
	}

	const calculate = useCallback(async () => {
		setError(null)
		URL = `https://api.exchangerate.host/latest?base=${state.selectedOne}&symbols=${state.selectedTwo}`
		try {
			const response = await fetch(URL)
			if (!response.ok) {
				throw new Error('Something went wrong!')
			}
			const data = await response.json()
			dispatch({ type: 'CALCULATE', value: data.rates })
		} catch (error) {
			setError(error.message)
		}
	}, [state.selectedOne, state.selectedTwo])

	useEffect(() => {
		calculate()
	}, [calculate])

	return (
		<Fragment>
			<div className={classes['app-body']}>
				<div className='section-left'>
					<input
						type='number'
						className='amount-one'
						value={state.firstValue}
						onChange={event => {
							dispatch({ type: 'CHANGE_FIRST', value: event.target.value })
							calculate()
						}}
					/>
					<select
						id='currency-one'
						value={state.selectedOne}
						onChange={event => {
							dispatch({ type: 'SET_SELECT_ONE', value: event.target.value })
							calculate()
						}}>
						<option>PLN</option>
						<option>USD</option>
						<option>GBP</option>
						<option>EUR</option>
						<option>HUF</option>
					</select>
				</div>
				<Button onClick={swap}></Button>
				<div className='section-right'>
					<input type='number' className='amount-two' disabled value={state.secondValue} />
					<select
						value={state.selectedTwo}
						id='currency-two'
						onChange={event => {
							dispatch({ type: 'SET_SELECT_TWO', value: event.target.value })
							calculate()
						}}>
						<option>PLN</option>
						<option>USD</option>
						<option>GBP</option>
						<option>EUR</option>
						<option>HUF</option>
					</select>
				</div>
			</div>
			<p className='rate-info'>{`${state.firstValue} ${state.selectedOne} = ${state.secondValue} ${state.selectedTwo}`}</p>
		</Fragment>
	)
}
export default Form
