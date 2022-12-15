import React from 'react';
import Title from '../src/title';
import Link from 'next/link';

export default function Rules() {
    return (
        <div className='top'>
            <Title scale={1.5} />
            <h2 style={{color:'darkblue'}}>Guess the price of Amazon products, but don't go over!</h2>
            <p>
                All you get is a picture of the product.<br />
                The points you earn are determined quadratically from 0 to 100 based on
                what percent of the product's actual price your guess is.<br />
                If you guess higher than the actual price, you get no points.<br />
                It's as much a game of luck as it is wits.
            </p>
            <p>
                Choose Practice to play one round at a time.<br/>
                Choose Play to keep going for a chosen number of rounds. Your total and average score will be shown at the end.<br />
                After you make your guess, you can click the actual price to view the product on Amazon.
            </p>
            <p style={{fontSize:'0.75em'}}>
                Note: Product prices may be out-of-date.<br />
                To Do: Find a better API for Amazon
            </p>
            <Link href='/'>
                <button className='backButton' style={{fontSize:25}}>Back to Home</button>
            </Link>
        </div>
    )
}