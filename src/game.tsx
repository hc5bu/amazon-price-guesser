import React, { useState, useEffect } from "react";

type productProps = {
    imageLink: string,
    price: number,
    ASIN: string,
    show: boolean,
    setShow: Function,
    addScore?: Function
}

export default function (props: productProps) {
    const [entry, setEntry] = useState("");

    useEffect(() => {
        if (props.show === false)
            setEntry("");
    }, [props.show]);

    const clickEnter = function (): void {
        if (entry !== "") {
            props.setShow(true);
            if (props.addScore !== undefined)
                props.addScore(calculatePoints());
        }
    }
    const handleKey = (event: React.KeyboardEvent<HTMLDivElement>): void => {
        if (event.key === "Enter") {
            event.preventDefault();
            clickEnter();
        }
    }
    const calculatePoints = (): number => {
        const guess: number = parseFloat(entry);
        if (guess <= props.price)
            return Math.round(Math.pow(guess / props.price, 2) * 100);
        else
            return 0;
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const stringVal: string = event.target.value;
        const i : number = stringVal.indexOf('.');
        const numDecimal = Math.min((i!==-1 ? stringVal.length-i-1: 0),2);
        let val: number = parseFloat(stringVal);
        if (isNaN(val)) {
            setEntry("");
            return;
        }
        val = Math.max(val, 0);
        const ind = stringVal.indexOf('.');
        if (ind !== -1 && stringVal.length - ind > 3)
            val = Math.trunc(val * 100) / 100;
        setEntry(val.toFixed(numDecimal));
    }
    const renderResult = () => {
        const guess: number = parseFloat(entry);
        const points: number = calculatePoints();
        if (guess <= props.price) {
            return (
                <div className='answer'>
                    <div>Actual Price:&nbsp;
                        <a href={"https://amazon.com/dp/" + props.ASIN} target="_blank" style={{ color: 'darkgreen' }}>
                            {`$${props.price.toFixed(2)}`}
                        </a>
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
                    <div>Actual Price:&nbsp;
                        <a href={"https://amazon.com/dp/" + props.ASIN} target="_blank" style={{ color: 'red' }}>
                            {`$${props.price.toFixed(2)}`}
                        </a>
                    </div>
                    <div>You went over!</div>
                </div>
            )
        }
    }

    return (
        <div className='gameInterface'>
            <img src={props.imageLink} />
            <div>
                $<input type='number' className='priceInput' value={entry} disabled={props.show} required
                    step='0.01' min='0' placeholder="Price?" onChange={handleChange} onKeyDown={handleKey}/>
                <button className='enterPrice' disabled={props.show} onClick={clickEnter}>Enter</button>
            </div>
            {props.show && renderResult()}
        </div>
    );
}