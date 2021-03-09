import { SearchTag } from '../../components/tag-input';
import Head from 'next/head';
import styles from '../../styles/Home.module.css';

export const Result = ({ tag, questions }) => {
    console.log(tag, questions);
    return (
        <div className={styles.container}>
            <Head>
                <title>Result</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    <a href="https://stackoverflow.com/" target="_blank">Stack Overflow</a> Tag Getter
                </h1>
                <SearchTag />
                <h2>Tag: {tag}</h2>
            </main>

        </div>
    );
};

export async function getServerSideProps (pageContext) {
    const tagged = pageContext.query.tag;

    if (!tagged) {
        return {
            props: {
                questions: [],
                tag: 'null'
            }
        }
    }

    const apiResponse = await fetch(
        `https://api.stackexchange.com/2.2/search?fromdate=1612742400&todate=1615161600&order=desc&sort=votes&tagged=${tagged}&site=stackoverflow`
    );

    const apiJSON = await apiResponse.json();
    console.log(apiJSON);
    return {
        props: {
            tag: tagged,
            questions: apiJSON
        }
    }
};

export default Result;