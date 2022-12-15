import Title from "../src/title";
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

export default function Home() {
    const [rounds, setRounds] = useState("10");
    const [enable, setEnable] = useState(true);
    const [loading, setLoading] = useState("");
    const router = useRouter();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setRounds(event.target.value);
        const f: number = parseFloat(event.target.value);
        setEnable(!isNaN(f) && f > 0 && f <= 100 && f % 1 === 0);
    }
    const handleKey = (event: React.KeyboardEvent<HTMLDivElement>): void => {
        if (event.key === "Enter") {
            event.preventDefault();
            if (enable) {
                setLoading('play');
                router.push({ pathname: '/play', query: (parseInt(rounds) === 10 ? undefined : { rounds: parseInt(rounds) }) })
            }
        }
    }
    return (
        <div id='startPage' className='top'>
            <Title scale={1.5} />
            <div className='startButtons'>
                <Link href='/rules'>
                    <button disabled={loading !== ""} onClick={() => setLoading('rules')}>{loading !== "rules" ? "Rules" : "Loading..."}</button>
                </Link>
                <Link href='/practice'>
                    <button disabled={loading !== ""} onClick={() => setLoading('practice')}>{loading !== "practice" ? "Practice" : "Loading..."}</button>
                </Link>
                <Link href={{ pathname: '/play', query: (parseInt(rounds) === 10 ? undefined : { rounds: parseInt(rounds) }) }}>
                    <button disabled={!enable || loading !== ""} onClick={() => setLoading('play')}>{loading !== "play" ? "Play!" : "Loading..."}</button>
                </Link>
                <div id="roundEntry">
                    Rounds: <input type='number' value={rounds} maxLength={2}
                        onChange={handleChange} disabled={loading !== ""} onKeyDown={handleKey} />
                </div>
            </div>
        </div>
    )
}
