import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import localforage from 'localforage';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { LioWebRTC } from 'react-liowebrtc';
// import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
// import getMuiTheme from 'material-ui/styles/getMuiTheme';
// const authRoutes = ['/gameplay', '/gameover'];
// const publicRoutes = ['/'];

import GamePlay from './GamePlay.js'

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			options: {
                debug: true,
                dataOnly: true
			},
			chatLog: [],
			x: null,
		}
		this.checkLogin();
	}

	checkLogin() {
		let currentLocation = this.props.router.getCurrentLocation().pathname;
		// console.log(currentLocation);
		localforage.getItem('playerName')
			.then((value) => {
				if (value !== null && value !== "") {
					// console.log("PlayerName set in storage as: ", value);
					if (currentLocation === "/") {
						browserHistory.push("/gameplay");
					}
				}
			}).catch((err) => {
				console.log("PlayerName not set");
				if (currentLocation === "/gameplay") {
					browserHistory.push("/");
				}
			})
	}

	join = (webrtc) => {
        console.log('???????????', webrtc)
        webrtc.joinRoom('my-p2p-app-demo')
        this.setState({
            webrtc
        })
    }

    handleCreatedPeer = (webrtc, peer) => {
        console.log('handleCreatedPeer!!!!!!!!!!!!!')
        this.addChat(`Peer-${peer.id.substring(0, 5)} joined the room!`, ' ', true);
    }
    
    handlePeerData = (webrtc, type, payload, peer) => {
        console.log('handlePeerData!!!!!!!!!!!!')
        switch(type) {
        case 'chat':
            this.addChat(`Peer-${peer.id.substring(0, 5)}`, payload);
            break;
        default:
            return;
        };
    }
    
    addChat = (name, message, alert = false) => {
		console.log('CHAT CHAT CHAT', name, message)
		this.setState({
			x: message,
		});
    }

	render() {
		const { options, x } = this.state
		console.log('%c X','background: green;, color: white', x)
		// muiTheme={getMuiTheme(darkBaseTheme)}
		return (
			<MuiThemeProvider key="themeProvider">
				<div className="container" key="container">
				<LioWebRTC
					options={options}
					onReady={this.join}
					onCreatedPeer={this.handleCreatedPeer}
					onReceivedPeerData={this.handlePeerData}
				>
					<GamePlay
						x={x}
						onSend={(msg) => msg && this.addChat('Me', msg)}/>
				</LioWebRTC>
				</div>
			</MuiThemeProvider>
		);
	}
}

export default App;
