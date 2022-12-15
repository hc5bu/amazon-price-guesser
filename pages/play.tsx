import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import axios from "axios";
import Title from "../src/title";
import Game from "../src/game";
import { useRouter } from 'next/router';
import Link from 'next/link';

type amazonData = {
    "ASIN": string,
    "category": string,
    "price": string,
    "rating": string
}

type productProps = {
    'imageLink': string,
    'price': number,
    'ASIN': string,
    category? : string
}

export default function Play({ productList, rounds }: { productList: Array<productProps>, rounds:number }): JSX.Element {
    const [showAnswer, setShowAnswer] = useState(false);
    const [round, setRound] = useState(1);
    const [score, setScore] = useState(0);
    const router = useRouter();
    const addScore = (s: number): void => {
        setScore(s + score);
    }

    const nextRound = (): void => {
        setRound(round + 1);
        setShowAnswer(false);
    }

    if (round <= rounds) {
        return (
            <div className='top'>
                <Title />
                <div className='roundInfo'>
                    <div className='score'>
                        Score:<br /><div style={{color:'blue'}}>{score}</div>
                    </div>
                    <div className='backWrapper'>
                        <Link href='/'>
                            <button className='backButton'>Back to Home</button>
                        </Link>
                    </div>
                    <div className='roundNum'>
                        Round:<br />{round}/{rounds}
                    </div>
                </div>

                <Game imageLink={productList[round - 1].imageLink} price={productList[round - 1].price}
                    ASIN={productList[round - 1].ASIN} show={showAnswer} setShow={setShowAnswer} addScore={addScore} />
                {showAnswer &&
                    <button className='nextButton' onClick={nextRound}>
                        {round===rounds ? "View Results" : "Next Product"}
                    </button>
                }
            </div>
        )
    }
    else {
        return (
            <div className='top'>
                <Title scale={1.5} />
                <div className='finalScore'>
                    <div>Your Final Score: <span style={{color:'blue'}}>{score}</span></div>
                    <div>Average Score Per Round: <span style={{color:'darkblue'}}>{score/rounds}</span></div>
                </div>
                <button className='reloadButton' id='playAgain' onClick={router.reload}>Play Again</button>
            </div>
        )
    }

}

export const getServerSideProps: GetServerSideProps = async (context) => {
    let productList: Array<productProps> = [];
    const r = context.query.rounds;
    const rounds : number = (typeof r === 'string' && !isNaN(parseInt(r)) ? parseInt(r) : 10);
    let count: number = 0;
    let toGo = rounds;
    while(toGo > 0) {
        const promiseList : Array<Promise<[productProps, string|undefined]>>= [];
        for(let i=0; i<toGo*1.3; i++){
            const promiseA : Promise<productProps> = axios.get("https://randomazonbackend.appspot.com/product/").then(r=>{
            const data : amazonData = r.data;
            const imageLink : string = `https://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=
            ${data.ASIN}&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=SL500`;
            const ret : productProps = {imageLink: imageLink,
            price: parseFloat(data.price),
            ASIN: data.ASIN,
            category : data.category};
            return ret;
        });
        const promiseB : Promise<string|undefined> = promiseA.then((r:productProps)=>{
            if(isNaN(r.price) || r.category==='courses')
                return undefined;
            else
                return axios.get(r.imageLink);
        }).then(r=>{
            if(r===undefined)
                return undefined;
            else
                return r.headers['content-length'];
        });
        const p : [Promise<productProps>, Promise<string|undefined>] = [promiseA, promiseB]
        promiseList.push(Promise.all(p));
        }
        const promiseData : Array<[productProps, string|undefined]> = await Promise.all(promiseList);
        promiseData.forEach(function([a,b]) {
            if(isNaN(a.price))
                console.log(a.ASIN, 'Invalid Price');
            else if(a.category === 'courses')
                console.log(a.ASIN, "Is a Course");
            else if (b == "0" || b === undefined)
                console.log(a.ASIN, "Broken Image Link");
            else if (parseInt(b) < 2000)
                console.log(a.ASIN, "Possible no image");
            else {
                console.log(a.ASIN, "Success");
                productList.push(a);
                toGo--;
            }
        })
    }
    /*
    while (count < rounds) {
        let priceString: string = "";
        let imageLink: string = "";
        let data: amazonData = (await axios.get("https://randomazonbackend.appspot.com/product/")).data;
        priceString = data['price'];
        if (priceString === "") {
            console.log(data.ASIN, 'Invalid Price');
            continue;
        }
        if (data.category === 'courses') {
            console.log(data.ASIN, "Is a Course");
            continue;
        }
        imageLink = `https://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&MarketPlace=US&ASIN=
                    ${data.ASIN}&ServiceVersion=20070822&ID=AsinImage&WS=1&Format=SL500`;
        const resp = await axios.get(imageLink);
        if (resp.headers['content-length'] == "0" || resp.headers['content-length'] === undefined)
            console.log(data.ASIN, "Broken Image Link");
        else if (parseInt(resp.headers['content-length']) < 2000)
            console.log(data.ASIN, "Possible no image");
        else {
            console.log(data.ASIN, "Success");
            productList.push({
                imageLink: imageLink,
                price: parseFloat(priceString),
                ASIN: data.ASIN
            });
            count++;
        }
    }
    */
    return { props: { productList, rounds } };
}