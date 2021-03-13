import { SearchTag } from '../../components/tag-input';
import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import React from 'react';
import Collapsible from 'react-collapsible';

export const Result = ({ tag, votes, creations }) => {
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
                <title>Result for {tag}</title>
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

                    function bodyBreakdown(item) {
                        return { __html: item.body.replace(/\n/g, "<br/>") };//body_markdown.replace(/\n/g,"<br/>")};
                    }
                    // for getting comments
                    var commentArr = [];
                    const size = item.comment_count;
                    for (let i = 0; i < size; i++) {
                        commentArr.push(item.comments[i]);
                    }

                    let commentExist = "";

                    if (size === 0) {
                        commentExist = "No Comments";
                    }

                    // for getting answers
                    var answerArr = [];
                    const ansSize = item.answer_count;
                    for (let i = 0; i < ansSize; i++) {
                        answerArr.push(item.answers[i]);
                    }

                    let ansExist = "";

                    if (ansSize === 0) {
                        ansExist = "No Answers";
                    }

                    return (
                        <Collapsible key={index} className={styles.collapseOuter} trigger={
                            (<button type="button" className={styles.collapsable} >
                            Creation Date: {date.getFullYear()}/{date.getMonth() + 1}/{date.getDate()}
                            <br /> {txt.value} <br /> Votes: {item.score}</button>)}
                        >
                                <div className={styles.collapseInner}>
                                    <h3>Question Body</h3>
                                    <div className={styles.qBody} dangerouslySetInnerHTML={bodyBreakdown(item)} />
                                <h4>{commentExist}</h4>
                                {commentArr.map(function (obj, i) {

                                    let date = new Date(obj.creation_date * 1000);
                                    return (
                                        <div key={i} className={styles.cBody}>
                                            <h4>Comments:</h4>
                                            <p>Creation Date: {date.getFullYear()}/{date.getMonth() + 1}/{date.getDate()}
                                                <br />
                                            Votes: {obj.score}</p>
                                            <div dangerouslySetInnerHTML={{ __html: obj.body.replace(/\n/g, "<br/>") }} />
                                        </div>
                                    )
                                })}
                                <h4>{ansExist}</h4>
                                {answerArr.map(function (obj, i) {

                                    let date = new Date(obj.creation_date * 1000);
                                    var aCommentArr = [];
                                    const cSize = obj.comment_count;
                                    for (let i = 0; i < cSize; i++) {
                                        aCommentArr.push(obj.comments[i]);
                                    }
                                    return (
                                        <div key={i} className={styles.aBody}>
                                            < h4 > Answer #{i+1}:</h4>
                                            <p>Creation Date: {date.getFullYear()}/{date.getMonth() + 1}/{date.getDate()}
                                                <br />
                                            Votes: {obj.score}</p>
                                            <div dangerouslySetInnerHTML={{ __html: obj.body.replace(/\n/g, "<br/>") }} />

                                            {aCommentArr.map(function (o, j) {

                                                let date = new Date(o.creation_date * 1000);
                                                return (
                                                    <div key= { j } className={styles.acBody}>
                                                        <h4>Answer #{i+1}'s Comments:</h4>
                                                        <p>Creation Date: {date.getFullYear()}/{date.getMonth() + 1}/{date.getDate()}
                                                            <br />
                                            Votes: {o.score}</p>
                                                        <div dangerouslySetInnerHTML={{ __html: o.body.replace(/\n/g, "<br/>") }} />
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )
                                })}
                                

                                </div>
                        </Collapsible>
                    );
                })}
            </main>

        </div>
    );
};

export async function getServerSideProps (pageContext) {
    const tagged = pageContext.query.tag;
    // filter for body: !)rTkraPXxg*xgr03n8Uq
    // filter for body_markdown: !LYA)NnjOEl60aBgzZ1(2jI
    const filter = "!)rTkraPXxg*xgr03n8Uq";
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
        `https://api.stackexchange.com/2.2/search?fromdate=${weekBefore}&todate=${currTime}&order=desc&sort=votes&tagged=${tagged}&filter=${filter}&site=stackoverflow&key=${process.env.STACK_EXCHANGE_KEY}`
    );


    const apiVotesJSON = await apiResponse.json();

    apiResponse = await fetch(
        `https://api.stackexchange.com/2.2/search?fromdate=${weekBefore}&todate=${currTime}&order=desc&sort=creation&tagged=${tagged}&filter=${filter}&site=stackoverflow&key=${process.env.STACK_EXCHANGE_KEY}`
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