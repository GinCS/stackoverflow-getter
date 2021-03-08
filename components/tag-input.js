import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'

export const SearchTag = () => {
    const router = useRouter();
    return (
        <div>
            <form>
                <input className={styles.description} type="text" placeholder="Enter A Tag" name="tag" required />
                <button onClick={()=> router.push('/result/'+'tag') } className={styles.tag}>Submit</button>
            </form>
        </div>

    );
}