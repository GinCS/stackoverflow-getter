import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React from 'react'
import { SearchTag } from '../components/tag-input.js'

export default function Home() {
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
                    <br/>
                    and 10 most voted related questions since last week ordered from creation 
                    <br/>
                    date in descending order.
                </p>
                <SearchTag/>
            </main>
        </div>
    )

}
