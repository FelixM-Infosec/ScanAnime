// Default
import React from 'react'
import axios from 'axios'
import ReactPlayer from 'react-player'
// AntD
import { Card, Select, Typography, Tag, Divider, Button } from 'antd'
// Custom
import ColorPack from '../packs/colors.js'
import Navbar from './navbar.jsx'
import NetConfig from '../packs/net_config'
import Api from '../packs/api.js'
import api from '../packs/api.js'

class App extends React.Component {
  constructor() {
    super()
    this.menuItems = this.menuItems.bind(this)
    this.getEpisode = this.getEpisode.bind(this)
    this.getTags = this.getTags.bind(this)
    this.checkError = this.checkError.bind(this)

    this.state = {
      anime: [],
      eps: [],
      url: '',
      error: false
    }
  }

  componentDidMount() {
    axios({
      method: 'post',
      url: 'http://'+NetConfig.ip+':'+NetConfig.port+'/api/get_season',
      responseType: 'json',
      data:{ test: this.props.location.state.seasonID } 
    })
    .then((response) => {
      this.setState({
        anime: response.data,
        eps: response.data.Episodes,
      })
      if(this.props.location.state.episodeName === "Episode 1"){
        this.getEpisode(this.state.anime.Episodes[0].Episode_ID)
      }else {
        this.getEpisode(this.props.location.state.episodeID)
      }
    })
    .catch((error) => {
      console.log(error)
    }) 
  }

  menuItems() {
    const { Option } = Select
    return this.state.eps.map((eps) => (
      <Option key={eps.Episode_ID} value={eps.Episode_ID} name={eps.Title}>{eps.Title}</Option>
    ));
  }

  render() {
    const { Text } = Typography
    const container = {
      justifyContent: 'center',
      textAlign: 'center',
      display: 'flex'
    }
    const card = {
      marginTop: 10,
      padding: 10,
      width: '100%',
      backgroundColor: ColorPack.cardColor,
      borderColor: ColorPack.cardBorderColor
    }
    const title = {
      fontSize: 20,
      fontWeight: 1,
      color: '#ababab'
    }
    const playerOuterContainer = {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
    }
    const playerInnerContainer = {
      display: 'block',
      maxWidth: 960,
      maxHeight: 540,
      marginBottom: 10
    }
    const episodeSelect = {
      maxWidth:  960,
      margin: 'auto',
      display: 'block',
      textAlign: 'left',
      color: ColorPack.textColor,
      backgroundColor: ColorPack.cardColor,
      borderColor: ColorPack.cardBorderColor,
    }
    const { Paragraph } = Typography;
    return (
      <div>
        <div style={{width: '100%'}}>
          <Navbar />
        </div>

        <div style={container}>
          <Card bodyStyle={{padding: 0}} style={card}>
            <div style={{textAlign: 'left'}}>

              <div><Text style={title}>{this.state.anime.Title}</Text></div>
              <div>{this.getTags()}</div>
              <Divider style={{marginTop: 10, marginBottom: 10, backgroundColor: '#737373'}} />

              <div style={{fontWeight: "bold"}}>

                <div style={{float: 'left', marginRight: 16}}>
                  <img style={{height: 104}} alt="img" src={'http://www.anime1.com/main/img/content/'+this.state.anime.Seo+'/'+this.state.anime.Image} />
                </div>

                <div style={{float: 'right', height: 104}}> 
                  <div><Button size={'small'} block={true} style={{marginBottom: 6, backgroundColor: '#181A1B', color: '#ababab', borderColor: '#5D5D5D'}}>Add To Favourites</Button></div>
                  <div><Button size={'small'} block={true} style={{backgroundColor: '#254182', color: '#ffffff', borderColor: '#254182'}} href={"https://myanimelist.net/search/all?q="+this.state.anime.Title} target="_blank">MAL</Button></div>
                </div>

                <div><Text style={{color: '#ababab'}}>Type:<Text style={{fontWeight: "normal", marginLeft: 10, color: '#ababab'}}>{this.state.anime.Type}</Text></Text></div>
                <div><Text style={{color: '#ababab'}}>Status:<Text style={{fontWeight: "normal", marginLeft: 10, color: '#ababab'}}>{this.state.anime.Status}</Text></Text></div>
                <div><Text style={{color: '#ababab'}}>Language:<Text style={{fontWeight: "normal", marginLeft: 10, color: '#ababab'}}>{this.state.anime.Language}</Text></Text></div>
                <div><Text style={{color: '#ababab'}}>Age Rating:<Text style={{fontWeight: "normal", marginLeft: 10, color: '#ababab'}}>{this.state.anime.AgeRating}</Text></Text></div>
                <div><Text style={{color: '#ababab'}}>Release:<Text style={{fontWeight: "normal", marginLeft: 10, color: '#ababab'}}>{this.state.anime.Date}</Text></Text></div>      

              </div>
              <Divider style={{marginTop: 10, marginBottom: 10, backgroundColor: '#737373'}} />

              <div>
              <Paragraph style={{color: '#ababab'}} ellipsis={{ rows: 4, expandable: true, symbol: 'more' }}>{this.state.anime.Description}</Paragraph>
              </div>

            </div>
          </Card>
        </div>

        <div style={container}>
          <Card bodyStyle={{padding: '0'}} style={card}>
            <div style={playerOuterContainer}>
              <div style={playerInnerContainer}>
                {this.checkError()}
              </div>
            </div>
              <div style={{textAlign: 'center', width: '100%'}}>
                <Select style={episodeSelect} defaultValue={this.props.location.state.episodeName} onChange={(value) => this.getEpisode(value)} >{this.menuItems()}</Select>
              </div>
          </Card>
        </div>

      </div>
    );
  }

  getEpisode(value) {
    var data = { id: value }
    axios({
      method: 'post',
      url: 'http://'+NetConfig.ip+':'+NetConfig.port+'/api/get_episode',
      responseType: 'json',
      data: data
    })
    .then((response) => {
      this.setState({
        url: api.api_video_url_1 + response.data[0].link,
        error: false
      })
    })
    .catch((error) => {
      console.log(error)
    })
  }

  getTags(){
    if(this.state.anime.Categories !== undefined){
      var tags = []
      let test = Object.keys(this.state.anime.Categories)
      for(var i = 0; i < test.length; i++){
        tags.push(<Tag style={{marginTop: 10, backgroundColor: '#181A1B', color: '#ababab', borderColor: '#5D5D5D' }} key={i}>{this.state.anime.Categories[test[i]]}</Tag>)
      }
    }
    return(tags)
  }

  checkError(){
    if(this.state.error === true){
      return(<div style={{height: '100%', width: '100%'}}>This video is broken, check back later</div>)
    } else{
      return(<ReactPlayer width={'100%'} height={'100%'} url={this.state.url} controls={true} pip={true} onError={() => this.setState({error: true})}/>)
    }
  }

}

export default App