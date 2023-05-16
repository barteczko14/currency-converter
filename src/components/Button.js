import classes from './Button.module.css'

const Button = (props) => {
	return <button onClick={props.onClick} className={classes.swap}>Swap</button>
}
export default Button
