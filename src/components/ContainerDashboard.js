import React, { useEffect, useState } from 'react'
import HostCard from './HostCard'
import styled from 'styled-components'
import fakedata from '../mock2'

const myData = [
    fakedata[0].slice(0, 10),
    fakedata[0].slice(11, 17),
    fakedata[0].slice(18, 27),
    fakedata[0].slice(28, 65)
]


const Container = styled.div`
    max-width: 100%;
    padding: 10px 20px;
`
export default function ContainerDashboard() {
    const [hosts, setData] = useState([])
    useEffect(() => {
        setTimeout(() => setData(myData), 200)
    }, [])
    return <Container>
        {hosts.map((host, index) => <HostCard key={index} data={host}/>)}
    </Container>
}