// Default
import React from 'react'
import axios from 'axios'
import { Redirect } from 'react-router-dom'
// Antd
import { Typography, Card, Button, message } from 'antd'
// Virtualised List
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import List from 'react-virtualized/dist/commonjs/List'
import NetConfig from '../packs/net_config'
import 'react-virtualized/styles.css'
// Custom
import ColorPack from '../packs/colors.js'
import Navbar from './navbar'

class Home extends React.Component{
    constructor(){
        super()
        this.rowRenderer = this.rowRenderer.bind(this)
        this.epcheck = this.epcheck.bind(this)
        this.arraycheck = this.arraycheck.bind(this)
        this.state = {
            new: [],
            move: ""
        }
    }

    componentDidMount(){
        axios({
            method: 'get',
            url: 'http://'+NetConfig.ip+':'+NetConfig.port+'/api/new_content',
            responseType: 'json'
        })
        .then((response) => {
            this.setState({
                new: response.data
            })
            console.log(this.state)
        })
        .catch((error) => {
            console.log(error)
        });
    }

    render(){
        const card = {
            marginTop: 10,
            padding: 10,
            width: '100%',
            backgroundColor: ColorPack.cardColor,
            borderColor: ColorPack.cardBorderColor,
            textAlign: 'left'
        }
        const container = {
            justifyContent: 'center',
            textAlign: 'center',
            display: 'flex'
        }
        const title = {
            fontSize: 20,
            fontWeight: 1,
            color: ColorPack.textColor
        }
        return(
            <div style={{ height: '100vh', backgroundColor: '#131415' }}> 
                <div>
                    <Navbar />
                </div>
                <div style={container}>
                    <Card bodyStyle={{padding: 0}} style={card}>
                        <Typography style={title}>New Releases</Typography>
                        <div style={{width: '100%', height: 600, marginTop: 10}}>
                            <AutoSizer>
                                {({width, height}) => (
                                    <List
                                        width={width}
                                        height={height}
                                        rowCount={this.state.new.length}
                                        rowHeight={84}
                                        rowRenderer={this.rowRenderer}
                                    />
                                )}
                            </AutoSizer>  
                        </div> 
                    </Card>
                </div>
                {this.state.move}
            </div>
        )
    }

    rowRenderer({key,index,style,}) {
        return(
            <div key={key} style={style}>
                <div>
                    <Button style={{width:'100%', height: 76, padding: 2, backgroundColor: '#181A1B', color: '#ababab', borderColor: '#5D5D5D' }} onClick={() => this.arraycheck(index)}>
                        
                        <div style={{float: 'left'}}>
                            <img style={{height: 70, width: 50}} alt="img" src={'http://www.anime1.com/main/img/content/'+this.state.new[index].Seo+'/'+this.state.new[index].Image} />
                        </div>
                        <div style={{marginLeft: 60, position: 'absolute'}}>
                            <div style={{textAlign: 'left',width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{this.state.new[index].Title}</div>
                            <div style={{textAlign: 'left'}}>{this.epcheck(index)}</div>
                        </div>
                        
                    </Button>
                </div>              
            </div>
        );
    }

    epcheck(index){
        if(this.state.new[index].Episodes.length === 0 || this.state.new[index].Episodes[0].Title === "Episode 1"){
            return("New Season!")
        }
        else{
            return(this.state.new[index].Episodes[0].Title)
        }
    }

    arraycheck(index){
        if(this.state.new[index].Episodes.length != 0){
            this.setState({move: <Redirect push to={{pathname: "/player", state: {seasonID: this.state.new[index].Content_ID, episodeID: this.state.new[index].Episodes[0].Episode_ID, episodeName: this.state.new[index].Episodes[0].Title}}} />})
            
        } else {
           this.setState({ move: message.info({ content: 'Episode 1 hasn\'t released yet! Check back later.'})})
        }
    }
}
export default Home