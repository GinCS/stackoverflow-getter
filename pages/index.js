import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React from 'react'
import TagInput from '../components/tag-input.js'

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tag: "",
            titles: "",
            answers: ""
        };
        this.updateTag = this.updateTag.bind(this);
    }

    updateTag(str) {
        this.setState({ tag: str });
        console.log(this.state.tag);
    }

    activeScreen() {
        return <TagInput onSubmit={this.updateTag}/>
    }

    render(){
        return (
            <div className={styles.container}>
                <Head>
                    <title>Stack Overflow Tag Getter</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <main className={styles.main}>
                    <h1 className={styles.title}>
                        <a href="https://stackoverflow.com/" target="_blank">Stack Overflow</a> Tag Getter
                    </h1>
                    <p className={styles.description}>
                        Enter a tag in the textbox, and click 'submit' to see the 10 newest questions
                        and 10 most voted related questions ordered from creation date in descending
                        order.
                    </p>
                    {this.activeScreen()}
                </main>
            </div>
        )
    }
  
}
