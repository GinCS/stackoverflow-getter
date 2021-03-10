import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'


export const SearchTag = () => {
    let tag = "";

    const router = useRouter();

    const updateTag = (event) => {
        tag = event.target.value;
    }

    const onSubmit = (event) => {
        event.preventDefault();
        if (tag) {
            router.push(`/result/${tag}`);
        }
    }
    
    return (
        <div>
            <form onSubmit={onSubmit} className={styles.tagin}>
                <input className={styles.description}
                    type="text"
                    placeholder="Enter A Tag"
                    onChange={updateTag} 
                    name="tag" required />
                <button type="submit" className={styles.tag}>Submit</button>
            </form>
        </div>

    );
}