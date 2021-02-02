import React from 'react';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-markercluster';


function GeoMap(props) {

    const zoom = 4

    return (
        <MapContainer center={{lat: 45, lng: -100}} zoom={zoom}>
            <TileLayer
                attribution='Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
                url='https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}'
                id='mapbox/streets-v11'
                accessToken='pk.eyJ1Ijoic2h1YmhhbXIxNzQiLCJhIjoiY2trbjk3aDQ3MjhxZzJxcGRpYWxtNXZ1dyJ9.2Dp5JLthegG-Nj7YCBM29w'
            />
            <MarkerClusterGroup
                spiderfyDistanceMultiplier={1}
                showCoverageOnHover={false}
                spiderfyOnMaxZoom={false}
                zoomToBoundsOnClick={true}
            >
            {props.poi && props.poi.map((item)=>(
                <Marker position={[item.lat, item.lon]} key={item.name}>
                    <Popup>{item.name} x:{item.lat} y: {item.lon}</Popup>
                </Marker>

            ))}
            </MarkerClusterGroup>

        </MapContainer>
    );
}

export default GeoMap;