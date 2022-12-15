import Title from "../src/title";
import Link from 'next/link';

export default function Home(){
    return (
        <div id='startPage' className='top'>
            <Title scale={1.5}/>
            <div className='startButtons'>
                <button disabled>Rules</button>
                <Link href='/practice'><button>Practice</button></Link>
                <Link href='/play'><button>Play!</button></Link>
            </div>
        </div>
    )
}
