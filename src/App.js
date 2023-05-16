import { Fragment } from 'react'
import classes from './App.module.css'
import Form from './components/Form'
function App() {
	return (
		<Fragment>
			<div className={classes.wrapper}>
				<h1>Exchange Rate App</h1>
				<p>Check the current exchange rates!</p>
				<Form></Form>

			</div>
		</Fragment>
	)
}

export default App
