import React from 'react';
import axios from 'axios';
import './App.css';

export class ScannedList extends React.PureComponent {
    render() {
        const { scannedList } = this.props;
        return (
            <div>
                <h1>Scanned List</h1>
                <ul>
                    {scannedList.map((item, key) => (
                        <li key={key}>
                            <div>
                                <div>{item.tracking}</div>
                                <div>{item['zip-code']}</div>
                            </div>
                            <div>
                                <button>Remove</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}
export class UnScannedList extends React.PureComponent {
    render() {
        const { unScannedList } = this.props;
        return (
            <div>
                <h1>UnScanned List</h1>
                <ul>
                    {unScannedList.map((item, key) => (
                        <li key={key}>
                            <div>
                                <div>{item.tracking}</div>
                                <div>{item['zip-code']}</div>
                            </div>
                            <div>
                                <button>Select</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}
export class SummaryReport extends React.PureComponent{

    render() {
        const { countScanned , countUnScannedList , amountFee , amountTax } = this.props;
        return (
            <div>
                Summary Report
                <div>{countScanned} / {countUnScannedList + countScanned}</div>
                <div>{amountFee}</div>
                <div>{amountTax}</div>
                <div>{amountFee + amountTax}</div>
            </div>
        )
    }
}

export class FormScan extends React.PureComponent{
    render() {
        const { senderZipCode , tracking , zipCode , handleInputChange , handleToggleScanned } = this.props;
        return (
            <div>
               <input name="senderZipCode" value={(senderZipCode)?senderZipCode:''} onChange={handleInputChange}/> 
               <input name="tracking" value={tracking} onChange={handleInputChange}/> 
               <input name="zipCode" value={zipCode} onChange={handleInputChange}/> 
               <button onClick={handleToggleScanned}>Scan</button>
            </div>
        )
    }
}
class App extends React.PureComponent {

    state = {
        tracking: '',
        zipCode: '',
        senderZipCode: null,
        trackingList: [],
    }
    async componentDidMount() {
        const dataTracking = await axios.get('https://api.myjson.com/bins/1bx8a5');
        this.setState({
            senderZipCode: dataTracking.data['sender-zip-code'],
            trackingList: dataTracking.data['tracking-list'].map((item) => ({ ...item, 'scanned': false }))
        });
    }
    handleInputChange = (e) => {
        this.setState( { [e.target.name] : e.target.value } );
    }
    handleToggleScan = () => {

    }
    handleToggleScanned = () => {
        const { zipCode , tracking ,senderZipCode } = this.state;

        this.setState( ( state ) => ({
            ...state,
            trackingList: state.trackingList.map( (item) => ({ ...item , scanned: ( item.tracking == tracking ) ? true: item.scanned}) )
        }) )
        // console.log('handleToggleScanned');
    }
    handleSelectScan = () => {

    }

    isZipCode = (str) => /(^\d{5}$)/.test(str);
    getDeliveryFeeFromZipCodeArea = (zipCode1, zipCode2) => {
        // if (!this.isZipCode(zipCode1)) throw new Exception(`${zipCode1} is not zip-code format`)
        // if (!this.isZipCode(zipCode2)) throw new Exception(`${zipCode2} is not zip-code format`)
        //mock up distance calculator
        return Math.abs(parseInt(zipCode1) - parseInt(zipCode2))
    }

    render() {

        const { senderZipCode, trackingList , tracking , zipCode } = this.state;
        const scannedList = trackingList.filter((item) => item.scanned === true);
        const unscannedList = trackingList.filter((item) => item.scanned === false);

        return (
            <div>
                <FormScan 
                    handleToggleScanned={ this.handleToggleScanned } 
                    handleInputChange={ this.handleInputChange } 
                    senderZipCode={senderZipCode} 
                    tracking={tracking} 
                    zipCode={zipCode}/>
                <SummaryReport 
                    countScanned={scannedList.length} 
                    countUnScannedList={unscannedList.length}
                    amountFee={0}
                    amountTax={0}/>
                <UnScannedList unScannedList={unscannedList} />
                <ScannedList scannedList={scannedList} />
            </div>
        )
    }
}
export default App;
