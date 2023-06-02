import React, { Component } from 'react'
import Scanner from './Scanner'
import { Link } from "react-router-dom";
import { Container } from 'react-bootstrap';

class BarcodeScanner extends Component {
  state = {
    results: [],
  }

  _scan = () => {
    this.setState({ scanning: !this.state.scanning })
  }

  _onDetected = result => {
    this.setState({ results: [] })
    this.setState({ results: this.state.results.concat([result]) })
  }

  render() {
    return (
      <div>

        <span>Barcode Scanner</span>
        
        <Container variant="outlined" style={{marginTop:30, width:640, height:320}}>
          <Scanner onDetected={this._onDetected} />
        </Container>

        <textarea
            style={{fontSize:32, width:320, height:100, marginTop:30}}
            rowsMax={4}
            defaultValue={'No data scanned'}
            readOnly
            value={this.state.results[0] ? this.state.results[0].codeResult.code : 'No data scanned'}
        />

      </div>
    )
  }
}

export default BarcodeScanner