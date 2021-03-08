export const Result = ({ tag, questions }) => {
    return (<>Hey~</>);
};

export const getServerSideProps = async pageContext => {
    const tag = pageContext.query.tag;

    if (!tag) {
        return {
            props: {
                questions: [],
                tag: ''
            }
        }
    }

    const apiResponse = await fetch(
        `https://api.stackexchange.com/docs/search#order=desc&sort=votes&tagged=${tag}&filter=default&site=stackoverflow&run=true`,
        {
            headers: {
            },
        },
    );

    const apiJSON = apiResponse.json();
    console.log(apiJSON);

    return {
        props: {

        }
    }
};

export default Result;