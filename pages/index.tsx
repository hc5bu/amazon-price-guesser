import Title from "../src/title";
import Link from 'next/link';
import React, {useState} from 'react';

export default function Home(){
    const [rounds, setRounds] = useState("10");
    const [enable, setEnable] = useState(true);
    
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) : void => {
        setRounds(event.target.value);
        const f : number = parseFloat(event.target.value);
        setEnable(!isNaN(f) && f>0 && f<=100 && f%1===0);
    }

    return (
        <div id='startPage' className='top'>
            <Title scale={1.5}/>
            <div className='startButtons'>
                <Link href='/rules'><button>Rules</button></Link>
                <Link href='/practice'><button>Practice</button></Link>
                <Link href={{ pathname: '/play', query: (parseInt(rounds)===10?undefined:{ rounds: parseInt(rounds) }) }}><button disabled={!enable}>Play!</button></Link>
                <div id="roundEntry">
                    Rounds: <input type='number' value={rounds} maxLength={2} onChange={handleChange}/>
                </div>
            </div>
        </div>
    )
}
