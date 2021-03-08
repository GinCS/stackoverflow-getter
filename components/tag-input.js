import React from 'react'
import styles from '../styles/Home.module.css'

export default class Tag extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tag: ""
        };

        this.updateTag = this.updateTag.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    updateTag = (event) => this.setState({
        tag: event.target.value
    })

    onSubmit = (event) => {
        event.preventDefault();
        this.props.onSubmit(this.state.tag);
    }

    render() {
        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <input className={styles.description} type="text" placeholder="Enter A Tag" name="tag" onChange={this.updateTag} required />
                    <button type="submit" className={styles.tag}>Confirm</button>
                </form>
            </div>

        );
    }
}