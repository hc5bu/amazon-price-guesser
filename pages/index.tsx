import Title from "../src/title.js";
import Link from 'next/link';

export default function Home(){
    return (
        <div id='startPage' className='top'>
            <Title/>
            <div className='startButtons'>
                <button>Play</button>
                <Link href='/practice'><button>Practice</button></Link>
                <button>Rules</button>
            </div>
        </div>
    )
}
