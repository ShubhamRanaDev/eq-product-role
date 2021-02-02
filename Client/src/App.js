import './App.css';
import Axios from "axios";
import React, {Component} from 'react';
import EventsComponent from "./components/EventsComponent";
import StatsDaily from "./components/StatsDaily";
import StatsHourly from "./components/StatsHourly";
import FuzzySearch from "./components/FuzzySearch";
import GeoMap from "./components/GeoMap";


class App extends Component {
    constructor(props) {
        super(props);
        this.state= {
            eventDaily:[],
            poi:[],
            statsDaily:[],
            statsHourly:[],
            displayStatsHourly:true,
            displayStatsDaily:false,
            displayEvent:false,
            displaySearch:false,
            displayMap:false
        }
    }

    componentDidMount() {
        Axios.get("http://localhost:5555/events/daily"
            ,{
                headers: {
                    'token': sessionStorage.getItem('token') ?   sessionStorage.getItem('token') : ''
                }}
        )
            .then(res=>{
                sessionStorage.setItem("token", res.data.token);
                this.setState({
                    eventDaily:res.data.data
                })
            })
            .catch((err) => console.log(err))

        Axios.get("http://localhost:5555/events/hourly"
            ,{
                headers: {
                    'token': sessionStorage.getItem('token') ? sessionStorage.getItem('token') : ''
                }}
        )
            .then(res=>{
                sessionStorage.setItem("token", res.data.token);
                this.setState({
                    eventHourly:res.data.data
                })
            })
            .catch((err) => console.log(err))


        Axios.get("http://localhost:5555/stats/daily"
            ,{
                headers: {
                    'token': sessionStorage.getItem('token') ?   sessionStorage.getItem('token') : ''
                }}
        )
            .then(res=>{
                sessionStorage.setItem("token", res.data.token);
                this.setState({
                    statsDaily:res.data.data
                })
            })
            .catch((err) => console.log(err))

        Axios.get("http://localhost:5555/stats/hourly"
            ,{
                headers: {
                    'token': sessionStorage.getItem('token') ? sessionStorage.getItem('token') : ''
                }}
        )
            .then(res=>{
                sessionStorage.setItem("token", res.data.token);
                this.setState({
                    statsHourly:res.data.data
                })
            })
            .catch((err) => console.log(err))
        Axios.get("http://localhost:5555/poi"
            ,{
                headers: {
                    'token': sessionStorage.getItem('token') ? sessionStorage.getItem('token') : ''
                }}
        )
            .then(res=>{
                sessionStorage.setItem("token", res.data.token);
                this.setState({
                    poi:res.data.data
                })
            })
            .catch((err) => console.log(err))
    }

    toggleDisplay(givenState){
        this.setState({
            displayStatsHourly:false,
            displayStatsDaily:false,
            displayEvent:false,
            displayMap:false,
            displaySearch:false
        })
        switch (givenState) {
            case "Hourly":
                this.setState({
                    displayStatsHourly: true
                })
                break;
            case "Daily":
                this.setState({
                    displayStatsDaily: true
                })
                break;
            case "Event":
                this.setState({
                    displayEvent: true
                })
                break;
            case "Search":
                this.setState({
                    displaySearch: true
                })
                break;
            case "Map":
                this.setState({
                    displayMap: true
                })
                break;

        }

    }


    render() {
        return (
            <div>
                <button onClick={()=>this.toggleDisplay("Hourly")}>StatsHourly</button>
                <button onClick={()=>this.toggleDisplay("Daily")}>StatsDaily</button>
                <button onClick={()=>this.toggleDisplay("Event")}>Events</button>
                <button onClick={()=>this.toggleDisplay("Search")}>FuzzySearch</button>
                <button onClick={()=>this.toggleDisplay("Map")}>Location</button>

                {this.state.displayStatsHourly &&<StatsHourly hourly={this.state.statsHourly}/>}
                {this.state.displayStatsDaily && <StatsDaily daily={this.state.statsDaily}/>}
                {this.state.displayEvent && <EventsComponent edaily={this.state.eventDaily}/>}
                {this.state.displaySearch && <FuzzySearch poi={this.state.poi}/>}
                {this.state.displayMap && <GeoMap poi={this.state.poi}/>}

            </div>
        );
    }
}


export default App;
