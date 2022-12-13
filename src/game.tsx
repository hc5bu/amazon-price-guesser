import React, {useState} from "react";

type productProps = {
    'imageLink': string,
    'price': number
}
export default function(props: productProps){
    const [entry, setEntry] = useState("");
    const [show, setShow] = useState(false);

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

    return(
        <div className='gameInterface'>
                <img src={props.imageLink} />
                <div>
                    $<input type='number' className='priceInput' value={entry} disabled={show} required
                        step='0.01' min='0' placeholder="Price?" onChange={handleChange} />
                    <button className='enterPrice' disabled={show} onClick={clickEnter}>Enter</button>
                </div>
                {show && renderResult()}
            </div>
    );
}