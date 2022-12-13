import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import axios from "axios";
import Title from "../src/title";
import Game from "../src/game";
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

export default function Practice(props: productProps): JSX.Element {
    const router = useRouter();
    return (
        <div className='top'>
            <Title scale={1}/>
            <Link href='/'>
                <button className='backButton'>Back to Home</button>
            </Link>
            <Game imageLink={props.imageLink} price={props.price}/>
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