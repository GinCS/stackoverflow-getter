import { SearchTag } from '../../components/tag-input';
import Head from 'next/head';
import styles from '../../styles/Home.module.css';

export const Result = ({ tag, votes, creations }) => {
    console.log(tag, votes, creations);

    let mergedList = [];
    let sizeForVotes = 10, sizeForCreations = 10;
    const error = creations.error_id == 502;
    if (error) {
        tag = creations.error_message;
        console.log(creations.error_message);
    } else {
        if (votes.items.length < 10) {
            sizeForVotes = votes.items.length;
        }

        if (creations.items.length < 10) {
            sizeForCreations = creations.items.length;
        }

        for (let i = 0; i < sizeForVotes; i++) {
            mergedList.push(votes.items[i]);
        }
        for (let i = 0; i < sizeForCreations; i++) {
            // top ten, but if it already exists in the list, do not add
            if (missing(creations.items[i])) {
                mergedList.push(creations.items[i]);
            }
        }

        mergedList.sort(function (a, b) { return b.creation_date - a.creation_date; });

        console.log(mergedList);
    }
    

    function missing(item) {
        let result = true;
        for (let i = 0; i < mergedList.length && result; i++) {
            result = mergedList[i].question_id != item.question_id;
        }
        return result;
    }

    

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
                {mergedList.map(function (item, index) {
                    if (error) {return}
                    let txt = item.title;

                    if (typeof document!=='undefined') {
                        txt = document.createElement("textarea");
                        txt.innerHTML = item.title;
                    }
                    
                    const date = new Date(item.creation_date * 1000);
                    
                    return (
                        <button key={index} type="button" className={styles.collapsable}>
                            Creation Date: {date.getFullYear()}/{date.getMonth() + 1}/{date.getDate()}
                            <br /> {txt.value} <br /> Votes: {item.score}
                        </button>
                        )
                })}
            </main>

        </div>
    );
};

export async function getServerSideProps (pageContext) {
    const tagged = pageContext.query.tag;
    const currTime = Math.floor(Date.now()/1000);
    const weekBefore = currTime - 604800;
    if (!tagged) {
        return {
            props: {
                questions: [],
                tag: 'null'
            }
        }
    }

    let apiResponse = await fetch(
        `https://api.stackexchange.com/2.2/search?fromdate=${weekBefore}&todate=${currTime}&order=desc&sort=votes&tagged=${tagged}&filter=!)rTkraPXxg*xgr03n8Uq&site=stackoverflow`
    );


    const apiVotesJSON = await apiResponse.json();

    apiResponse = await fetch(
        `https://api.stackexchange.com/2.2/search?fromdate=${weekBefore}&todate=${currTime}&order=desc&sort=creation&tagged=${tagged}&filter=!)rTkraPXxg*xgr03n8Uq&site=stackoverflow`
    );

    const apiCreationJSON = await apiResponse.json();

    return {
        props: {
            tag: tagged,
            votes: apiVotesJSON,
            creations: apiCreationJSON
        }
    }
};

export default Result;