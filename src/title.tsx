import React from 'react';
import Head from "next/head";
import Image from "next/image";
import amazonLogo from "../public/amazon_logo.svg"

type scaleProp = {
    scale? : number
}

export default function Title(props:scaleProp): JSX.Element {
    const scale = (props.scale || 1)
    return (
        <div className="titleContent">
            <Head>
                <title>Amazon Price Guesser</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className='title' style={{marginTop:scale*15}}>
                <Image src={amazonLogo} alt="Amazon" style={{height:scale*60,width:'auto'}}/>
                <h1 style={{fontSize:scale*30}}>Price Guessing Game</h1>
            </div>
        </div>
    )
}