import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import axios from "axios";
import Title from "../src/title.js";
import { useRouter } from 'next/router';
import Link from 'next/link';
//import { setConstantValue } from 'typescript';

type amazonData = {
    "ASIN": string,
    "category": string,
    "price": string,
    "rating": string
}

type productProps = {
    'imageLink': string,
    'price': number
}

export default function Practice(props: productProps) {
    const [entry, setEntry] = useState("");
    const [show, setShow] = useState(false);
    const router = useRouter();

    const clickEnter = function (): void {
        if (entry !== "") {
            setShow(true);
        }
    }
    const handleChange = (event: React.ChangeEvent<HTMLElement>): void => {
        const stringVal: string = (event.target as HTMLInputElement).value
        let val: number = parseFloat(stringVal);
        if (isNaN(val)) {
            setEntry("");
            return;
        }
        val = Math.max(val, 0);
        const ind = stringVal.indexOf('.');
        if (ind !== -1 && stringVal.length - ind > 3)
            val = Math.trunc(val * 100) / 100;
        setEntry(val.toString());
    }
    const renderResult = () => {
        const guess: number = parseFloat(entry);
        let points: number;
        if (guess <= props.price) {
            points = Math.round(Math.pow(guess / props.price, 2) * 100);
            return (
                <div className='answer'>
                    <div>Actual Price:
                        <span style={{ color: 'darkgreen' }}>{` $${props.price.toFixed(2)}`}</span>
                    </div>
                    <div>You got&nbsp;
                        <span style={{ color: (points === 0 ? 'red' : "") }}>{points}</span>
                        &nbsp;point{points === 1 ? "" : "s"}{points > 0 ? "!" : ""}</div>
                </div>
            )
        }

        else {
            return (
                <div className='answer'>
                    <div>Actual Price:
                        <span style={{ color: 'red' }}>{` $${props.price.toFixed(2)}`}</span>
                    </div>
                    <div>You went over!</div>
                </div>
            )
        }
    }

    return (
        <div className='top'>
            <Title />
            <Link href='/'>
                <button className='backButton' style={{ fontSize: '18px' }}>Back to Home</button>
            </Link>
            <div className='gameInterface'>
                <img src={props.imageLink} />
                <div>
                    $<input type='number' className='priceInput' value={entry} disabled={show} required
                        step='0.01' min='0' onChange={handleChange} />
                    <button className='enterPrice' disabled={show} onClick={clickEnter}>Enter</button>
                </div>
            </div>
            {show && renderResult()}
            <button className='reloadButton' onClick={router.reload}>Try another</button>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    let priceString: string = "";
    let imageLink: string = "";
    let data: amazonData;
    while (true) {
        data = (await axios.get("https://randomazonbackend.appspot.com/product/")).data;
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
        try {
            const resp = await axios.get(imageLink);
            if (resp.headers['content-length'] != "0") {
                //console.log(resp.headers['content-length'])
                break;
            }
            else if (parseInt(resp.headers['content-length']) < 2000)
                console.log(data.ASIN, "Possible no image")
            else
                console.log(data.ASIN, "Broken Image Link")
        } catch (_) {
            console.log(data.ASIN, "Image error");
        }
    }
    console.log(data.ASIN, "Success")
    //console.log(data);
    return {
        props: {
            imageLink: imageLink,
            price: parseFloat(priceString)
        }
    }
}