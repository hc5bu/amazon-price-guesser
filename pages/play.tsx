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
    'ASIN': string
}

export default function Practice({ productList }: { productList: Array<productProps> }): JSX.Element {
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

    if (round <= 10) {
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
                        Round:<br />{round}/10
                    </div>
                </div>

                <Game imageLink={productList[round - 1].imageLink} price={productList[round - 1].price}
                    ASIN={productList[round - 1].ASIN} show={showAnswer} setShow={setShowAnswer} addScore={addScore} />
                {showAnswer &&
                    <button className='nextButton' onClick={nextRound}>
                        {round===10 ? "View Results" : "Next Product"}
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
                    <div>Average Score Per Round: <span style={{color:'darkblue'}}>{score/10}</span></div>
                </div>
                <button className='reloadButton' id='playAgain' onClick={router.reload}>Play Again</button>
            </div>
        )
    }

}

export const getServerSideProps: GetServerSideProps = async (context) => {
    let priceString: string = "";
    let imageLink: string = "";
    let count: number = 0;
    let productList: Array<productProps> = [];
    while (count < 10) {
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
    return { props: { productList } };
}